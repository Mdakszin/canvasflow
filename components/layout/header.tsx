import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";

export const Header = () => {
  return (
    <header className="py-3 px-4 md:px-6 border-b shadow-sm bg-background">
      <nav className="flex items-center justify-between">
        {/* Left Side: Logo and Branding */}
        <div className="flex items-center gap-x-4">
          <Link href="/dashboard" className="text-2xl font-bold text-primary hover:opacity-80 transition">
            CanvasFlow
          </Link>
          {/* You can add more navigation links here, e.g., for different sections */}
        </div>

        {/* Right Side: Org Switcher, Theme Toggle, and User Profile */}
        <div className="flex items-center gap-x-4">
          <ThemeToggle />
          <OrganizationSwitcher
            hidePersonal
            afterCreateOrganizationUrl="/dashboard"
            afterLeaveOrganizationUrl="/dashboard"
            afterSelectOrganizationUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "flex items-center justify-center",
                organizationSwitcherTrigger: "focus:ring-2 focus:ring-primary focus:ring-offset-2"
              },
            }}
          />
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9"
              }
            }}
          />
        </div>
      </nav>
    </header>
  );
};