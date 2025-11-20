'use client';

import { useState } from 'react';
import StartSessionButton from './StartSessionButton';
import Transcript from './Transcript';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface SessionContainerProps {
    companionId: string;
    subject: string;
    topic: string;
    style: string;
    voice: string;
    onCallStatusChange?: (status: CallStatus) => void;
    showTranscript?: boolean;
}

const SessionContainer = ({ companionId, subject, topic, style, voice, onCallStatusChange, showTranscript = true }: SessionContainerProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);

    const handleStatusChange = (status: CallStatus) => {
        setCallStatus(status);
        onCallStatusChange?.(status);
    };

    return (
        <>
            <div style={{ width: '100%' }} className="max-md:w-full">
                <StartSessionButton 
                    companionId={companionId}
                    subject={subject}
                    topic={topic}
                    style={style}
                    voice={voice}
                    onStatusChange={handleStatusChange}
                />
            </div>
            {showTranscript && (
                <div style={{ width: '100%', marginTop: '32px' }} className="max-md:w-full">
                    <Transcript isActive={callStatus === CallStatus.ACTIVE} />
                </div>
            )}
        </>
    );
};

export default SessionContainer;

