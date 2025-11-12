"use client";
import Link from "next/link";
import Image from "next/image";
import NavItems from "./NavItems";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
        <Link 
          href="/subscription" 
          className={cn(
            "hover:text-primary transition-colors text-base font-medium",
            pathname === "/subscription" ? "text-primary font-semibold" : "text-muted-foreground"
          )}
        >
          Subscription
        </Link>
        <Link 
          href="/sign-in" 
          className={cn(
            "hover:text-primary transition-colors text-base font-medium",
            pathname === "/sign-in" ? "text-primary font-semibold" : "text-muted-foreground"
          )}
        >
          Sign In
        </Link>
      </div>
    </nav>
  )
}

export default Navbar


