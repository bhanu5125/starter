/* eslint-disable no-unused-vars */
// Import Dependencies
import clsx from "clsx";
import PropTypes from "prop-types";
import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";

// Local Imports
import { useThemeContext } from "app/contexts/theme/context";
import { Button } from "components/ui";
import { Menu } from "./Menu";
import { getNavigation } from "app/navigation";
import { useEffect, useState } from "react";
import Logo from 'assets/mainLogo.svg';

// ----------------------------------------------------------------------

export function PrimePanel({
  currentSegment,
  pathname,
  close,
  
}) {
  const [navigation, setNavigation] = useState([]);

  // Update navigation when auth state changes
  useEffect(() => {
    // This will cause a re-render when auth state changes
    setNavigation(getNavigation());
    
    // Listen for auth state changes
    const handleAuthChange = () => {
      setNavigation(getNavigation());
    };
    
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);
  const { cardSkin } = useThemeContext();
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        "prime-panel flex h-full flex-col",
        cardSkin === "shadow"
          ? "shadow-soft dark:shadow-dark-900/60"
          : "dark:border-dark-600/80 ltr:border-r rtl:border-l",
      )}
    >
      <div
        className={clsx(
          "flex h-full grow flex-col bg-white",
          cardSkin === "shadow" ? "dark:bg-dark-750" : "dark:bg-dark-900",
        )}
      >
        <div className="relative flex h-16 w-full shrink-0 items-center justify-between px-4">
          <div className="flex items-center">
            <Logo className="h-8 w-auto" />
          </div>
          <Button
            onClick={close}
            isIcon
            variant="flat"
            className="size-7 rounded-full xl:hidden"
          >
            <ChevronLeftIcon className="size-6 rtl:rotate-180" />
          </Button>
        </div>
        <Menu
          nav={navigation}
          pathname={pathname}
        />
      </div>
    </div>
  );
}

PrimePanel.propTypes = {
  currentSegment: PropTypes.object,
  pathname: PropTypes.string,
  close: PropTypes.func,
};