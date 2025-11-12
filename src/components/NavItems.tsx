"use client";
import Link from "next/link"
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
    {
        label: "Companions",
        href: "/companions",
    },
    {
        label: "My Journey",
        href: "/my-journey",
    },
   
]
const NavItems = () => {
    const pathname = usePathname();
  return (
    <div className="flex items-center gap-8">
        {navItems.map((item) => (
            <Link 
            href={item.href}
            key={item.href} 
            className={cn(
                "hover:text-primary transition-colors text-base font-medium",
                pathname === item.href && "text-primary font-semibold",
                pathname !== item.href && "text-muted-foreground"
            )}>
                {item.label}
            </Link>
        ))}
    </div>
  )
}

export default NavItems
