'use client';

import {useEffect, useState} from 'react'
import {vapi} from "@/lib/vapi.sdk";
import Image from "next/image";
import { addToSessionHistory } from '@/lib/actions/companion.actions';

interface CompanionComponentProps {
    companionId: string;
    subject: string;
    topic: string;
    name: string;
    userName: string;
    userImage: string;
    style: string;
    voice: string;
}

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}

const CompanionComponent = ({ companionId, subject, topic, name, userName, userImage, style, voice }: CompanionComponentProps) => {
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
        // add to session history (companionId)
        addToSessionHistory(companionId);
        const onError = (error: Error) => console.log('Error', error);

        vapi.on('call-start', onCallStart);
        vapi.on('call-end', onCallEnd);
        vapi.on('error', onError);

        return () => {
            vapi.off('call-start', onCallStart);
            vapi.off('call-end', onCallEnd);
            vapi.off('error', onError);
        }
    }, []);

    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted)
    }

    return (
        <>
            <div className="card flex flex-col items-center justify-center max-md:min-w-[94vw]" style={{ minWidth: '310px', minHeight: '290px', padding: '44px 32px', borderRadius: '26px', border: '2.5px solid #000', background: '#fff', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', width: '100%' }}>
                <button 
                    className="flex flex-col items-center gap-3 w-full bg-transparent border-none cursor-pointer" 
                    onClick={toggleMicrophone} 
                    disabled={callStatus !== CallStatus.ACTIVE}
                    style={{ background: 'transparent', border: 'none', cursor: callStatus === CallStatus.ACTIVE ? 'pointer' : 'not-allowed' }}
                >
                    <Image src={isMuted ? '/icons/mic-off.svg' : '/icons/mic-on.svg'} alt="mic" width={48} height={48} />
                    <p className="text-black font-medium" style={{ fontSize: '1.3rem' }}>
                        {isMuted ? 'Turn on microphone' : 'Turn off microphone'}
                    </p>
                </button>
            </div>
        </>
    )
}

export default CompanionComponent