import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const CTA = () => {
  return (
    <section className="cta-card bg-[#232325] rounded-lg p-6 text-white h-full flex flex-col">
      <div className="cta-badge bg-[#FFD600] text-black font-bold rounded-full px-3 py-1 text-sm mb-4 mx-auto text-center">
        Start learning your way!
      </div>
      <h2 className="text-3xl font-bold mb-4 text-white">Build and Personalize Learning Companion</h2>
      <p className="text-white/80 mb-6">Pick a name, subject, voice, & personality – and start learning through voice conversations that feel natural and fun.</p>
      <div className="mb-6 flex-1">
        <Image src="/images/cta.svg" alt="cta" width={362} height={232} className="w-full h-auto" />
      </div>
      <Link href="/companions/new" className="block mt-auto">
        <Button className="w-full bg-[#232325] border-2 border-white/20 text-white hover:bg-white/10 hover:text-white">
          <Image src="/icons/plus.svg" alt="plus" width={16} height={16} className="mr-2" />
          <span>Build a New Companion</span>
        </Button>
      </Link>
    </section>
  )
}

export default CTA
