"use client";

import { useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";

interface CompanionSessionProps {
  id?: string;
  name: string;
  subject: string;
  topic: string;
  voice: string;
  style: string;
  duration: number;
  companionId: string;
  userName: string;
  userImage: string;
}

const CompanionSessionComponent = ({
  name,
  subject,
  topic,
  voice,
  style,
  duration,
  companionId,
  userName,
  userImage,
}: CompanionSessionProps) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (isCallActive) {
        vapi.stop();
      }
    };
  }, [isCallActive]);

  const startCall = async () => {
    try {
      setIsLoading(true);
      
      // Configure the assistant for this companion
      const assistant = {
        name: name,
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are ${name}, a ${style} learning companion specializing in ${subject}. Your topic is: ${topic}. Help the user learn through natural conversation. Keep responses engaging and educational.`,
            },
          ],
        },
        voice: voice,
        firstMessage: `Hi ${userName}! I'm ${name}, your ${subject} learning companion. Let's explore ${topic} together. What would you like to learn today?`,
      };

      await vapi.start(assistant);
      setIsCallActive(true);
    } catch (error) {
      console.error("Error starting call:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCall = () => {
    vapi.stop();
    setIsCallActive(false);
  };

  return (
    <div className="mt-6 p-6 border rounded-lg">
      <div className="flex flex-col items-center justify-center gap-4">
        {!isCallActive ? (
          <button
            onClick={startCall}
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Starting..." : "Start Session"}
          </button>
        ) : (
          <button
            onClick={stopCall}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
          >
            End Session
          </button>
        )}
        {isCallActive && (
          <p className="text-sm text-muted-foreground">
            Session is active. Speak naturally to interact with {name}.
          </p>
        )}
      </div>
    </div>
  );
};

export default CompanionSessionComponent;

