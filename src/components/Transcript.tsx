'use client';

import { useEffect, useState, useRef } from 'react';
import { vapi } from "@/lib/vapi.sdk";

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: Date;
}

interface TranscriptProps {
    isActive: boolean;
}

const Transcript = ({ isActive }: TranscriptProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const wasAtBottomRef = useRef(true);
    const previousScrollHeightRef = useRef(0);

    // Check if user is at bottom of scroll container
    const isAtBottom = () => {
        if (!scrollContainerRef.current) return true;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        // Consider "at bottom" if within 100px of the bottom (to account for new messages)
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        return distanceFromBottom < 100;
    };

    // Handle scroll events to track if user manually scrolled up
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            wasAtBottomRef.current = isAtBottom();
            previousScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        if (!isActive) {
            return;
        }

        const onTranscript = (data: any) => {
            console.log('VAPI Message/Transcript received:', data);
            
            let role: 'user' | 'assistant' = 'assistant';
            let content = '';

            // VAPI transcript messages can have different structures:
            // 1. Direct transcript: { type: 'transcript', role: 'user'|'assistant', transcript: 'text' }
            // 2. Nested: { message: { type: 'transcript', role: '...', transcript: '...' } }
            // 3. Conversation update: { messages: [{ role: '...', content: '...' }] }

            // Check if this is a transcript message
            if (data.type === 'transcript' || data.message?.type === 'transcript') {
                const transcriptData = data.type === 'transcript' ? data : data.message;
                
                // Get role
                if (transcriptData.role === 'user' || transcriptData.role === 'assistant') {
                    role = transcriptData.role;
                } else if (transcriptData.speaker === 'user') {
                    role = 'user';
                }
                
                // Get content
                content = transcriptData.transcript || transcriptData.text || transcriptData.content || '';
            }
            // Check for direct role and content
            else if (data.role === 'user' || data.role === 'assistant') {
                role = data.role;
                content = data.transcript || data.text || data.content || '';
            }
            // Check for nested message structure
            else if (data.message) {
                if (data.message.role) {
                    role = data.message.role === 'user' ? 'user' : 'assistant';
                }
                content = data.message.transcript || data.message.text || data.message.content || '';
            }
            // Check for direct transcript/text fields
            else if (data.transcript || data.text) {
                content = data.transcript || data.text || '';
                // Try to infer role from other fields
                if (data.userId || data.speaker === 'user' || data.from === 'user') {
                    role = 'user';
                }
            }
            // Handle string messages
            else if (typeof data === 'string') {
                content = data;
            }

            // Only add message if it has content
            if (content && content.trim()) {
                const newMessage: Message = {
                    role,
                    content: content.trim(),
                    timestamp: new Date(),
                };
                console.log('Adding transcript message:', newMessage);
                setMessages((prev) => {
                    // Avoid duplicates by checking if same content and role exists
                    const exists = prev.some(m => 
                        m.content.trim() === newMessage.content.trim() && 
                        m.role === newMessage.role
                    );
                    if (!exists) {
                        return [...prev, newMessage];
                    }
                    return prev;
                });
            }
        };

        // Listen for VAPI message events
        // When clientMessages includes "transcript", VAPI emits messages with transcript data
        vapi.on('message', onTranscript);
        
        // Also try listening for conversation-update which might contain transcripts
        const onConversationUpdate = (update: any) => {
            console.log('VAPI Conversation update:', update);
            // Check if this update contains transcript data
            if (update.messages && Array.isArray(update.messages)) {
                update.messages.forEach((msg: any) => {
                    if (msg.role && msg.content) {
                        const newMessage: Message = {
                            role: msg.role === 'user' ? 'user' : 'assistant',
                            content: msg.content,
                            timestamp: new Date(),
                        };
                        setMessages((prev) => {
                            // Avoid duplicates
                            const exists = prev.some(m => m.content === newMessage.content && m.role === newMessage.role);
                            if (!exists) {
                                return [...prev, newMessage];
                            }
                            return prev;
                        });
                    }
                });
            }
        };
        
        // Try to listen for conversation-update (may not be in TypeScript types but might work at runtime)
        try {
            (vapi as any).on('conversation-update', onConversationUpdate);
        } catch (e) {
            console.log('conversation-update event not available');
        }

        return () => {
            vapi.off('message', onTranscript);
            try {
                (vapi as any).off('conversation-update', onConversationUpdate);
            } catch (e) {
                // Ignore
            }
        };
    }, [isActive]);

    // Auto-scroll to bottom only if user was at bottom before new message
    useEffect(() => {
        // Use requestAnimationFrame to ensure DOM has updated before checking scroll position
        requestAnimationFrame(() => {
            if (!scrollContainerRef.current || !messagesEndRef.current) return;
            
            // Only auto-scroll if user was at bottom before the new message arrived
            // This prevents auto-scrolling when user has manually scrolled up
            if (wasAtBottomRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
                // Update ref to reflect that we're now at bottom after scrolling
                wasAtBottomRef.current = true;
            } else {
                // User scrolled up, so check current position and update ref
                wasAtBottomRef.current = isAtBottom();
            }
            
            // Update previous scroll height for next comparison
            if (scrollContainerRef.current) {
                previousScrollHeightRef.current = scrollContainerRef.current.scrollHeight;
            }
        });
    }, [messages]);

    // Clear messages when call ends
    useEffect(() => {
        if (!isActive && messages.length > 0) {
            // Optionally keep messages or clear them
            // setMessages([]);
        }
    }, [isActive, messages.length]);

    if (!isActive && messages.length === 0) {
        return null;
    }

    return (
        <div className="card max-md:min-w-[94vw]" style={{ 
            minWidth: '620px', 
            minHeight: '400px', 
            maxHeight: '600px',
            padding: '24px', 
            borderRadius: '26px', 
            border: '2.5px solid #000', 
            background: '#fff', 
            boxShadow: '0 2px 16px rgba(0,0,0,0.08)', 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <h3 className="font-bold text-black mb-4" style={{ fontSize: '1.5rem' }}>
                Conversation Transcript
            </h3>
            <div 
                ref={scrollContainerRef}
                onScroll={handleScroll}
                style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px',
                    paddingRight: '8px'
                }}
            >
                {messages.length === 0 ? (
                    <p className="text-black opacity-50" style={{ fontSize: '1rem' }}>
                        Waiting for conversation to start...
                    </p>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            style={{
                                padding: '12px 16px',
                                borderRadius: '12px',
                                background: message.role === 'user' ? '#f0f0f0' : '#000',
                                color: message.role === 'user' ? '#000' : '#fff',
                                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%',
                                wordWrap: 'break-word',
                            }}
                        >
                            <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '4px' }}>
                                {message.role === 'user' ? 'You' : 'Assistant'}
                            </div>
                            <div style={{ fontSize: '1rem', lineHeight: '1.5' }}>
                                {message.content}
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default Transcript;

