import React from 'react'

import CompanionCard from '@/components/CompanionCard'
import CompanionList from '@/components/CompanionList'
import { getAllCompanions, getRecentSessions } from '@/lib/actions/companion.actions'
import { getSubjectColor } from '@/lib/utils'
import CTA from '@/components/CTA'
const Page = async () => {
  const companions = await getAllCompanions({limit: 3});
  const recentSessionsCompanions = await getRecentSessions(10);
  console.log({ message: 'RECENT SESSIONS', recentSessionsCompanions });
  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Popular Companions</h1>
      <section className="flex flex-col md:flex-row justify-center items-stretch gap-6 mb-8">
        {companions.map((companion) => (
          <CompanionCard 
          key={companion.id} 
          {...companion} 
          color={getSubjectColor(companion.subject)} 
          
          />
        ))}
       
        
      </section>

      <section className="flex flex-col lg:flex-row gap-6 items-stretch">   
        <CompanionList
        title = "Recent Completed Sessions"
        Companions ={(() => {
          // Extract companions and deduplicate by companion ID, keeping the most recent session
          const seenCompanionIds = new Set<string>();
          return recentSessionsCompanions
            .filter((session: any) => session.companions) // Filter out any null companions
            .map((session: any) => ({
              ...session.companions,
              sessionId: session.id // Add session ID for unique key
            }))
            .filter((companion: any) => {
              // Only keep the first occurrence of each companion (most recent due to ordering)
              if (seenCompanionIds.has(companion.id)) {
                return false;
              }
              seenCompanionIds.add(companion.id);
              return true;
            });
        })()} 
        className="w-2/3 max-lg:w-full" />
        <div className="w-1/3 max-lg:w-full">
          <CTA />
        </div>
      </section>
    </main>
  );
};

export default Page;