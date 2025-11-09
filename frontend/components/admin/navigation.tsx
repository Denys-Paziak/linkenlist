"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LinkIcon,
  Tag,
  Users,
  Settings,
  FileText,
  Building,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SafeLink } from "./safe-link";
import { Button } from "../ui/button";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Links", href: "/admin/links", icon: LinkIcon },
  { name: "Deals", href: "/admin/deals", icon: Tag },
  { name: "Real Estate", href: "/admin/real-estate", icon: Building },
  { name: "Resources", href: "/admin/resources", icon: FileText },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Comms & Moderation", href: "/admin/comms", icon: MessageSquare },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href + "/"));
          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                isActive && "bg-gray-100 text-gray-900"
              )}
              asChild
            >
              <SafeLink href={item.href}>
                <item.icon className="h-4 w-4" />
                {item.name}
              </SafeLink>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
