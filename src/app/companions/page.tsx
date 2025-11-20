import { getAllCompanions, getRecentSessions } from "@/lib/actions/companion.actions";
import CompanionCard from "@/components/CompanionCard";
import { getSubjectColor } from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";

type Props = {
  searchParams?: Promise<{
    subject?: string;
    topic?: string;
  }>;
};

const CompanionsLibrary = async ({ searchParams }: Props) => {
  const filters = await searchParams;
  const subject = filters?.subject || '';
  const topic = filters?.topic || '';
  const companions = await getAllCompanions({ subject, topic });
  const recentSessionsCompanions = await getRecentSessions(10);
  console.log({ message: 'RECENT SESSIONS', recentSessionsCompanions });
  console.log({ message: 'COMPANIONS', companions });
  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <section className="flex justify-between gap-4 max-sm:flex-col mb-8">
        <h1 className="text-2xl font-bold">Companions Library</h1>
        <div className="flex gap-4">
          <SearchInput />
          <SubjectFilter />
        </div>
      </section>
      <section className="compnions-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companions.map((companion) => (
          <CompanionCard key={companion.id} {...companion} color={getSubjectColor(companion.subject)} variant="library" />
        ))}
      </section>
    </main>
  )
}

export default CompanionsLibrary;
