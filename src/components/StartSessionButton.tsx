'use client';

import {useEffect, useState} from 'react'
import {cn, configureAssistant} from "@/lib/utils";
import {vapi, isVapiConfigured} from "@/lib/vapi.sdk";

interface StartSessionButtonProps {
    companionId: string;
    subject: string;
    topic: string;
    style: string;
    voice: string;
    onStatusChange?: (status: CallStatus) => void;
}

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const StartSessionButton = ({ companionId, subject, topic, style, voice, onStatusChange }: StartSessionButtonProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);

    // Notify parent of status changes
    useEffect(() => {
        onStatusChange?.(callStatus);
    }, [callStatus, onStatusChange]);

    useEffect(() => {
        const onCallStart = () => {
            console.log('Call started successfully');
            setCallStatus(CallStatus.ACTIVE);
        };
        
        const onCallEnd = () => {
            console.log('Call ended');
            setCallStatus(CallStatus.FINISHED);
        };

        const onMessage = (message: any) => {
            console.log('VAPI Message event:', message);
        };
        
        const onError = (error: any) => {
            // Check if error is empty or has no meaningful content
            // Handle null, undefined, empty object, or object with only undefined/null/empty string values
            let isEmpty = false;
            
            // First check: null or undefined
            if (!error) {
                isEmpty = true;
            } 
            // Second check: empty object {}
            else if (typeof error === 'object' && !Array.isArray(error)) {
                const keys = Object.keys(error);
                if (keys.length === 0) {
                    isEmpty = true;
                } else {
                    // Third check: object with only empty/null/undefined values
                    try {
                        const allEmpty = Object.values(error).every(val => 
                            val === null || 
                            val === undefined || 
                            val === '' ||
                            (typeof val === 'object' && val !== null && !Array.isArray(val) && Object.keys(val).length === 0)
                        );
                        isEmpty = allEmpty;
                    } catch (e) {
                        // If we can't check, assume it's not empty
                        isEmpty = false;
                    }
                }
            }
            
            // If empty, handle silently without any console output
            if (isEmpty) {
                // Empty error objects are often informational from VAPI's internal WebRTC connection
                // Don't log anything - just reset status silently and return
                setCallStatus(CallStatus.INACTIVE);
                return;
            }
            
            // Only log meaningful errors
            console.error('VAPI Error event received:', error);
            setCallStatus(CallStatus.INACTIVE);
            
            // Extract meaningful error message from VAPI error structure
            let errorMessage = '';
            
            // Check for nested VAPI error structure first: error.error.error.message
            const nestedMessage = error?.error?.error?.message;
            const statusCode = error?.error?.error?.statusCode;
            
            if (nestedMessage) {
                // Check if it's an authorization error
                if (nestedMessage.includes('Authorization') || nestedMessage.includes('Unauthorized') || statusCode === 401) {
                    errorMessage = 'VAPI API key is missing or invalid.\n\nPlease:\n1. Create a .env.local file in the root directory\n2. Add: NEXT_PUBLIC_VAPI_API_KEY=your_api_key_here\n3. Restart your development server';
                } else {
                    errorMessage = nestedMessage;
                }
            } else if (error?.error?.message) {
                errorMessage = error.error.message;
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            } else if (error && typeof error === 'object') {
                // Try to extract from error object
                const errorStr = JSON.stringify(error);
                if (errorStr !== '{}') {
                    // Check if it's an authorization error
                    if (errorStr.includes('Authorization') || errorStr.includes('Unauthorized') || errorStr.includes('401')) {
                        errorMessage = 'VAPI API key is missing or invalid. Please check your NEXT_PUBLIC_VAPI_API_KEY in .env.local and restart the server.';
                    } else {
                        errorMessage = errorStr;
                    }
                } else {
                    // This shouldn't happen now due to isEmpty check, but keep as fallback
                    return;
                }
            } else {
                errorMessage = 'Unknown error occurred. Please check your VAPI API key and configuration.';
            }
            
            // Only show alert for meaningful errors
            if (errorMessage) {
                alert(`Error: ${errorMessage}`);
            }
        };

        // Listen for additional events that might help debug
        const onStatusUpdate = (status: any) => {
            console.log('VAPI Status update:', status);
        };

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('error', onError);
        vapi.on('status-update', onStatusUpdate);
        vapi.on('message', onMessage);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('error', onError);
            vapi.off('status-update', onStatusUpdate);
            vapi.off('message', onMessage);
        }
    }, []);

    const handleCall = async () => {
        try {
            // Validate API key first
            if (!isVapiConfigured()) {
                throw new Error('VAPI API key is missing. Please create a .env.local file in the root directory and add: NEXT_PUBLIC_VAPI_API_KEY=your_api_key_here\n\nThen restart your development server.');
            }

            setCallStatus(CallStatus.CONNECTING)

            // Request microphone permission first
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                console.log('Microphone permission granted');
            } catch (micError) {
                console.error('Microphone permission denied:', micError);
                alert('Microphone permission is required to start a session. Please allow microphone access and try again.');
                setCallStatus(CallStatus.INACTIVE);
                return;
            }

            const assistant = configureAssistant(voice, style);
            
            // Replace template variables in the system message
            const systemMessage = assistant.model?.messages?.[0]?.content || '';
            const updatedSystemMessage = systemMessage
                .replace(/\{\{ topic \}\}/g, topic)
                .replace(/\{\{ subject \}\}/g, subject)
                .replace(/\{\{ style \}\}/g, style);
            
            if (assistant.model?.messages?.[0]) {
                assistant.model.messages[0].content = updatedSystemMessage;
            }

            // Replace template variables in firstMessage
            if (assistant.firstMessage) {
                assistant.firstMessage = assistant.firstMessage.replace(/\{\{topic\}\}/g, topic);
            }

            console.log('Starting VAPI call with assistant:', assistant);
            console.log('Voice:', voice, 'Style:', style);
            console.log('Voice ID:', assistant.voice?.voiceId);
            console.log('VAPI configured:', isVapiConfigured());
            
            // Validate assistant configuration
            if (!assistant.voice?.voiceId) {
                throw new Error('Invalid voice configuration. Voice ID is missing.');
            }
            
            if (!assistant.model?.provider || !assistant.model?.model) {
                throw new Error('Invalid model configuration.');
            }
            
            // Start the call - VAPI will handle the connection
            // Note: vapi.start() might not return a promise, so we handle it differently
            try {
                vapi.start(assistant);
                console.log('VAPI start called successfully');
                // The 'call-start' event will update the status when connection is established
            } catch (startError: any) {
                console.error('Error in vapi.start():', startError);
                throw startError;
            }
        } catch (error: any) {
            console.error('Error starting call:', error);
            setCallStatus(CallStatus.INACTIVE);
            
            // Extract meaningful error message
            let errorMessage = 'Failed to start session. ';
            
            if (error?.message) {
                errorMessage += error.message;
            } else if (error?.error?.error?.message) {
                // Handle nested VAPI error structure
                errorMessage += error.error.error.message;
            } else if (typeof error === 'string') {
                errorMessage += error;
            } else if (error?.toString && error.toString() !== '[object Object]') {
                errorMessage += error.toString();
            } else {
                errorMessage += 'Please check your VAPI API key and configuration.';
            }
            
            alert(`Error: ${errorMessage}`);
        }
    }

    const handleDisconnect = () => {
        setCallStatus(CallStatus.FINISHED)
        vapi.stop()
    }

    return (
        <button 
            className={cn('rounded-lg cursor-pointer transition-colors text-white font-medium w-full', callStatus === CallStatus.ACTIVE ? 'bg-red-700' : 'bg-black', callStatus === CallStatus.CONNECTING && 'animate-pulse')} 
            onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
            style={{ borderRadius: '26px', border: '2.5px solid #000', padding: '20px 32px', fontSize: '1.3rem', minHeight: '80px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}
        >
            {callStatus === CallStatus.ACTIVE
            ? "End Session"
            : callStatus === CallStatus.CONNECTING
                ? 'Connecting'
            : 'Start Session'
            }
        </button>
    )
}

export default StartSessionButton

