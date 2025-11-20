import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  getUserCompanions,
  getUserSessions,
  getBookmarkedCompanions,
} from "@/lib/actions/companion.actions";
import Image from "next/image";
import CompanionList from "@/components/CompanionList";
import CompanionCard from "@/components/CompanionCard";
import { getSubjectColor } from "@/lib/utils";

const Profile = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const companions = await getUserCompanions(user.id);
  const sessionHistory = await getUserSessions(user.id);
  const bookmarkedCompanions = await getBookmarkedCompanions(user.id);
  
  // Get unique session count - filter out invalid sessions and deduplicate by session ID
  const validUniqueSessions = (() => {
    if (!sessionHistory || !Array.isArray(sessionHistory)) return [];
    const seenIds = new Set<string>();
    return sessionHistory.filter((session: any) => {
      // Filter out null, undefined, or sessions without valid ID
      if (!session || !session.id) return false;
      // Deduplicate by session ID
      if (seenIds.has(session.id)) return false;
      seenIds.add(session.id);
      return true;
    });
  })();

  return (
    <main className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <section className="flex justify-between gap-4 max-sm:flex-col items-center">
        <div className="flex gap-4 items-center">
          <Image
            src={user.imageUrl || '/default-avatar.png'}
            alt={user.firstName || user.emailAddresses[0]?.emailAddress || 'User profile'}
            width={110}
            height={110}
          />
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-2xl">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="border border-black rouded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image
                src="/icons/check.svg"
                alt="checkmark"
                width={22}
                height={22}
              />
              <p className="text-2xl font-bold">{validUniqueSessions.length}</p>
            </div>
            <div>Lessons completed</div>
          </div>
          <div className="border border-black rouded-lg p-3 gap-2 flex flex-col h-fit">
            <div className="flex gap-2 items-center">
              <Image src="/icons/cap.svg" alt="cap" width={22} height={22} />
              <p className="text-2xl font-bold">{companions.length}</p>
            </div>
            <div>Companions created</div>
          </div>
        </div>
      </section>
      <Accordion type="multiple">
        <AccordionItem value="bookmarks">
          <AccordionTrigger className="text-2xl font-bold">
            Bookmarked Companions {`(${bookmarkedCompanions.filter((c: any) => c && c.id).length})`}
          </AccordionTrigger>
          <AccordionContent>
            <div className="compnions-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {bookmarkedCompanions
                .filter((companion: any) => companion && companion.id)
                .map((companion: any) => (
                  <CompanionCard
                    key={companion.id}
                    id={companion.id}
                    name={companion.name}
                    subject={companion.subject}
                    topic={companion.topic}
                    duration={companion.duration}
                    color={getSubjectColor(companion.subject)}
                    variant="library"
                  />
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="recent">
          <AccordionTrigger className="text-2xl font-bold">
            Recent Sessions
          </AccordionTrigger>
          <AccordionContent>
            <CompanionList
              title="Recent Sessions"
              Companions={(() => {
                // Extract companions from sessions and deduplicate by companion ID
                const seenCompanionIds = new Set<string>();
                return sessionHistory
                  .filter((session: any) => session?.companions)
                  .map((session: any) => ({
                    ...session.companions,
                    sessionId: session.id || `session-${Math.random()}`
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
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="companions">
          <AccordionTrigger className="text-2xl font-bold">
            My Companions {`(${companions.length})`}
          </AccordionTrigger>
          <AccordionContent>
            <CompanionList 
              title="My Companions" 
              Companions={companions?.filter((companion: any) => companion && companion.id) || []} 
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
};
export default Profile;