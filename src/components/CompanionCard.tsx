import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import BookmarkButton from "./BookmarkButton";
interface CompanionCardProps {
  id: string;
  name: string;
  subject: string;
  topic: string;
  duration: number;
  color: string;
  variant?: 'default' | 'library';
}
const CompanionCard = ({id, name, subject, topic, duration, color, variant = 'default'}: CompanionCardProps) => {
  const isLibrary = variant === 'library';
  
  return (
    <article 
      className={`companion-card flex flex-col w-full md:w-[320px] rounded-[15px] p-6 transition-shadow ${
        isLibrary 
          ? 'border-2 border-black shadow-none' 
          : 'rounded-lg shadow-md hover:shadow-lg'
      }`}
      style={{ backgroundColor: color }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {isLibrary ? (
            <div className="inline-flex items-center text-white text-sm capitalize bg-[#111] rounded-full px-[14px] py-[2px] font-medium">
              {subject}
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-white/80 text-sm font-medium">
              {subject}
            </div>
          )}
        </div>
        <BookmarkButton companionId={id} variant={variant} />
      </div>
      
      <div className="flex-1 mb-4">
        <h2 className="text-2xl font-bold mb-2">{name}</h2>
        <p className="text-sm text-black mb-4">{topic}</p>
        <div className="flex items-center gap-2">
          <Image 
            src="/icons/clock.svg" 
            alt="duration" 
            width={16} 
            height={16}
            className="opacity-70"
          />
          <p className="text-sm text-black">{duration} minutes</p>
        </div>
      </div>
      
      <Link href={`/companions/${id}`} className="w-full mt-auto">
        {isLibrary ? (
          <button 
            className="w-full h-12 bg-black text-white hover:bg-black/90 border-2 border-black rounded-md font-medium text-base cursor-pointer flex items-center justify-center gap-2 transition-colors"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M8 5v14l11-7z" 
                fill="currentColor"
              />
            </svg>
            <span>Launch Lesson</span>
          </button>
        ) : (
          <Button 
            variant="outline" 
            className="w-full bg-white/90 hover:bg-white"
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path 
                d="M8 5v14l11-7z" 
                fill="currentColor"
              />
            </svg>
            <span>Start Session</span>
          </Button>
        )}
      </Link>
    </article>
  );
};

export default CompanionCard;
