import { getCompanion } from "@/lib/actions/companion.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSubjectColor } from "@/lib/utils";
import Image from "next/image";
import CompanionLayout from "@/components/CompanionLayout";
interface CompanionSessionPageProps {

  params: Promise<{
    id: string;
  }>;
}

// params /url/{id} -> {id: string}
// searchParams /url? Key=Value & Key1=Value1
const CompanionSession = async ({params}: CompanionSessionPageProps) => {
  const { id } = await params;
  const companion = await getCompanion(id);
  const user = await currentUser();

  const {name , subject, topic, duration} = companion;
  if (!user) {
    redirect('/sign-in');
  }
  if (!companion) {
    redirect('/companions');
  }
  return (
    <main style={{ paddingLeft: '12px', paddingRight: '12px' }}>
        <div style={{ maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto' }}>
            <article className="flex justify-between items-center py-10 px-9 max-md:flex-col max-md:items-start max-md:min-w-[94vw]" style={{ border: '2.5px solid #000', borderRadius: '26px', background: '#fff', width: '100%', minHeight: '180px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
                <div className="flex flex-1 items-stretch">
                    <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: '72px', height: '72px', marginRight: '20px', backgroundColor: getSubjectColor(companion.subject)}}>
                        <Image src={`/icons/${companion.subject}.svg`} alt={companion.subject} width={54} height={54} />
                    </div>

                    <div className="flex flex-col gap-3 flex-1 justify-center">
                        <div className="flex items-center gap-3">
                            <p className="font-bold text-4xl text-black" style={{ fontSize: '1.5rem' }}>
                                {companion.name}
                            </p>
                            <div className="max-sm:hidden" style={{ background: '#111', color: '#fff', borderRadius: '999px', padding: '0 16px 2px 16px', marginLeft: '24px', fontSize: '18px', fontWeight: 600, verticalAlign: 'middle' }}>
                                {companion.subject}
                            </div>
                        </div>
                        <p className="text-2xl text-black" style={{ fontSize: '1.3rem' }}>{companion.topic}</p>
                    </div>
                </div>
                <div className="text-4xl font-bold text-black max-md:hidden flex items-center" style={{ textAlign: 'right', fontSize: '1.5rem' }}>
                    {companion.duration} minutes
                </div>
            </article>

            <CompanionLayout 
                companion={{
                    id,
                    name: companion.name,
                    subject: companion.subject,
                    topic: companion.topic,
                    style: companion.style,
                    voice: companion.voice
                }}
                user={{
                    firstName: user.firstName,
                    emailAddress: user.emailAddresses[0]?.emailAddress || null,
                    imageUrl: user.imageUrl
                }}
            />
        </div>
    </main>
  )
}

export default CompanionSession
