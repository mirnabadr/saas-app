import CompanionForm from "@/components/CompanionForm";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {newCompanionPermissions} from "@/lib/actions/companion.actions";
import Image from "next/image";
import Link from "next/link";

const NewCompanion = async () => {
    const { userId } = await auth();
    if(!userId) redirect('/sign-in');

    const canCreateCompanion = await newCompanionPermissions();

    return (
        <main className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
            {canCreateCompanion ? (
                <article className="w-full max-w-2xl gap-4 flex flex-col items-center justify-center text-center">
                    <h1 className="font-black text-4xl">Companion Builder</h1>

                    <div className="w-full">
                        <CompanionForm />
                    </div>
                </article>
                ) : (
                    <article className="companion-limit flex flex-col items-center justify-center text-center gap-6">
                        <Image src="/images/limit.svg" alt="Companion limit reached" width={360} height={230} />
                        <div className="cta-badge font-black">
                            Upgrade your plan
                        </div>
                        <h1 className="font-black text-4xl">You've Reached Your Limit</h1>
                        <p className="font-black text-xl">You've reached your session limit. Upgrade to create more sessions and pro features.</p>
                        <Link href="/subscription" className="cta-badge btn w-lg justify-center font-black text-2xl px-8 py-4 text-white rounded-lg transition-colors hover:opacity-90" style={{ backgroundColor: '#7B5CFA' }}>
                            Upgrade My Plan
                        </Link>
                    </article>
                )}
        </main>
    )
}

export default NewCompanion