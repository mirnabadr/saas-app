'use client';

import { useState } from 'react';
import MathExpertCard from './MathExpertCard';
import CompanionComponent from './CompanionComponent';
import SessionContainer from './SessionContainer';
import Transcript from './Transcript';
import Image from 'next/image';

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

interface CompanionLayoutProps {
    companion: {
        id: string;
        name: string;
        subject: string;
        topic: string;
        style: string;
        voice: string;
    };
    user: {
        firstName: string | null;
        emailAddress: string | null;
        imageUrl: string | null;
    };
}

const CompanionLayout = ({ companion, user }: CompanionLayoutProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const isVoiceActive = callStatus === CallStatus.ACTIVE;

    return (
        <div className="cards-container max-md:flex-col max-md:items-center" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', gap: '48px', marginTop: '38px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0', minWidth: '620px' }} className="max-md:min-w-[94vw]">
                <MathExpertCard 
                    name={companion.name}
                    subject={companion.subject}
                    isVoiceActive={isVoiceActive}
                />
                <div style={{ width: '100%', marginTop: '36px' }} className="max-md:w-full">
                    <Transcript isActive={callStatus === CallStatus.ACTIVE} />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', flex: '0 0 auto' }} className="max-md:w-full max-md:gap-[30px]">
                <div className="card max-md:min-w-[94vw]" style={{ minWidth: '310px', minHeight: '290px', padding: '44px 32px', borderRadius: '26px', border: '2.5px solid #111', background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', width: '100%' }}>
                    <Image 
                        src={user.imageUrl || '/default-avatar.png'} 
                        alt={user.firstName || 'User'} 
                        width={70} 
                        height={70} 
                        style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', background: '#e9e9e9' }}
                    />
                    <p className="font-bold text-black" style={{ fontSize: '1.3rem', fontWeight: 600 }}>
                        {user.firstName || user.emailAddress || 'User'}
                    </p>
                </div>

                <div style={{ width: '100%' }} className="max-md:w-full">
                    <CompanionComponent 
                        {...companion}
                        companionId={companion.id}
                        userName={user.firstName!}
                        userImage={user.imageUrl || ''}
                    />
                </div>

                <SessionContainer 
                    companionId={companion.id}
                    subject={companion.subject}
                    topic={companion.topic}
                    style={companion.style}
                    voice={companion.voice}
                    onCallStatusChange={setCallStatus}
                    showTranscript={false}
                />
            </div>
        </div>
    );
};

export default CompanionLayout;

