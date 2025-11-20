'use client';

import Image from "next/image";
import { getSubjectColor } from "@/lib/utils";
import SoundWaveAnimation from "./SoundWaveAnimation";

interface MathExpertCardProps {
  name: string;
  subject: string;
  isVoiceActive: boolean;
}

const MathExpertCard = ({ name, subject, isVoiceActive }: MathExpertCardProps) => {
  return (
    <div className="card max-md:min-w-[94vw]" style={{ 
      minWidth: '620px', 
      minHeight: '750px', 
      padding: '88px 64px', 
      borderRadius: '26px', 
      border: '2.5px solid #000', 
      background: '#fff', 
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <div 
        className="flex items-center justify-center rounded-lg mb-5" 
        style={{ 
          width: '300px', 
          height: '300px', 
          backgroundColor: getSubjectColor(subject),
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {isVoiceActive ? (
          <SoundWaveAnimation isActive={isVoiceActive} />
        ) : (
          <Image 
            src={`/icons/${subject}.svg`} 
            alt={subject} 
            width={200} 
            height={200} 
          />
        )}
      </div>
      <p className="font-bold text-black text-center" style={{ fontSize: '2.6rem' }}>
        {name}
      </p>
    </div>
  );
};

export default MathExpertCard;

