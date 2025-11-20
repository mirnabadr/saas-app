"use client";
import Link from "next/link";
import Image from "next/image";
import NavItems from "./NavItems";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const pathname = usePathname();
  
  return (
    <nav className="flex items-center justify-between px-6 md:px-8 py-4 border-b w-full bg-background">
      {/* Left Section: Logo */}
      <div className="flex items-center">
        <Link href="/" className="flex items-center cursor-pointer">
          <Image 
            src="/images/logo.svg" 
            alt="Converso logo"
            width={46}
            height={44}   
          />
        </Link>
      </div>

      {/* Right Section: All Navigation Items */}
      <div className="flex items-center gap-8">
        <Link 
          href="/" 
          className={cn(
            "hover:text-primary transition-colors text-base font-medium",
            pathname === "/" ? "text-primary font-semibold" : "text-muted-foreground"
          )}
        >
          Home
        </Link>
        <NavItems />
        <SignedOut>
          <Link 
            href="/sign-in" 
            className="bg-white border border-gray-300 rounded-full px-4 py-2 text-base font-medium text-foreground hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Sign In
          </Link>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}

export default Navbar


