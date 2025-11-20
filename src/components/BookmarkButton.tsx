'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { addBookmark, removeBookmark, isBookmarked } from '@/lib/actions/companion.actions';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

interface BookmarkButtonProps {
  companionId: string;
  variant?: 'default' | 'library';
}

const BookmarkButton = ({ companionId, variant = 'default' }: BookmarkButtonProps) => {
  const [isBooked, setIsBooked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const { user } = useUser();

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      try {
        const bookmarked = await isBookmarked(companionId, user.id);
        setIsBooked(bookmarked);
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkBookmarkStatus();
  }, [companionId, user?.id]);

  const handleToggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user?.id || isLoading) return;

    setIsLoading(true);
    try {
      if (isBooked) {
        const result = await removeBookmark(companionId, pathname);
        if (result !== null) {
          setIsBooked(false);
        }
      } else {
        const result = await addBookmark(companionId, pathname);
        if (result !== null) {
          setIsBooked(true);
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      // Don't update state if there was an error
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'library') {
    return (
      <button
        onClick={handleToggleBookmark}
        className="bg-black rounded-full p-1 flex items-center justify-center -mr-1 hover:opacity-80 transition-opacity cursor-pointer"
        title={isBooked ? 'Remove bookmark' : 'Add bookmark'}
        disabled={isLoading}
      >
        <Image 
          src={isBooked ? '/icons/bookmark-filled.svg' : '/icons/bookmark.svg'}
          alt={isBooked ? 'bookmarked' : 'bookmark'}
          width={12}
          height={15}
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleBookmark}
      className="companion-bookmark p-2 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
      title={isBooked ? 'Remove bookmark' : 'Add bookmark'}
      disabled={isLoading}
    >
      <Image 
        src={isBooked ? '/icons/bookmark-filled.svg' : '/icons/bookmark.svg'} 
        alt={isBooked ? 'bookmarked' : 'bookmark'} 
        width={16} 
        height={16}
        className={isBooked ? 'opacity-100' : 'opacity-80'}
      />
    </button>
  );
};

export default BookmarkButton;

