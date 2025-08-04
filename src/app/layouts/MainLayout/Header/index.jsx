/* eslint-disable no-unused-vars */
// Import Dependencies
import { HomeIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import LogoType from "assets/logotype.svg?react";
import Logo from "assets/mainLogo.svg?react";
import { Link } from "react-router";

// Local Imports
import { Profile } from "../Profile";
import { useThemeContext } from "app/contexts/theme/context";
import { SidebarToggleBtn } from "components/shared/SidebarToggleBtn";

// ----------------------------------------------------------------------

function SlashIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="20"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        d="M3.5.5h12c1.7 0 3 1.3 3 3v13c0 1.7-1.3 3-3 3h-12c-1.7 0-3-1.3-3-3v-13c0-1.7 1.3-3 3-3z"
        opacity="0.4"
      />
      <path fill="currentColor" d="M11.8 6L8 15.1h-.9L10.8 6h1z" />
    </svg>
  );
}

export function Header() {
  const { cardSkin } = useThemeContext();

  return (
    <header
      className={clsx(
        "app-header transition-content sticky top-0 z-20 flex h-[65px] shrink-0 items-center justify-between border-b border-gray-200 bg-white/80 px-[--margin-x] backdrop-blur backdrop-saturate-150 dark:border-dark-600",
        cardSkin === "shadow" ? "dark:bg-dark-750/80" : "dark:bg-dark-900/80",
      )}
    >
      <SidebarToggleBtn />
      
      <div className="flex items-center gap-4">
        <Link to="/">
          <div className="flex flex-row justify-start gap-2">
            <Logo className="size-14" />
            <p className="py-3 text-xl font-semibold uppercase text-orange-500 dark:text-dark-100">
              Traffic Counting Management System
            </p>
          </div>
        </Link>
      </div>

      {/* Right-side container with HomeIcon and Profile side-by-side */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <HomeIcon className="size-10" />
        </Link>
        <Profile />
      </div>
    </header>
  );
}
