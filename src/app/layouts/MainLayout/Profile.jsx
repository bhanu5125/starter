// Import Dependencies
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import UserI from "../../../images/user.png";
import { useAuthContext } from "app/contexts/auth/context";

// Local Imports
import { Avatar, Button } from "components/ui";

// ----------------------------------------------------------------------

export function Profile() {
  const { logout } = useAuthContext();

  const handleLogout = () => {
    logout();
  };
  return (
    <Popover className="relative">
      <PopoverButton
        as={Avatar}
        size={10}
        role="button"
        src={UserI}
        alt="Profile"
      />
      <Transition
        enter="duration-200 ease-out"
        enterFrom="translate-x-2 opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="duration-200 ease-out"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="translate-x-2 opacity-0"
      >
        <PopoverPanel
          anchor={{ to: "right end", gap: 12 }}
          className="z-[70] flex w-64 flex-col rounded-lg border border-gray-150 bg-white shadow-soft transition dark:border-dark-600 dark:bg-dark-700 dark:shadow-none"
        >
            <>
              <div className="flex items-center gap-4 rounded-t-lg bg-gray-100 px-4 py-5 dark:bg-dark-800">
                <Avatar
                  size={12}
                  src={UserI}
                  alt="Profile"
                >
                  </Avatar>
                <div>
                  <div
                    className="text-base font-medium text-gray-700 hover:text-primary-600 focus:text-primary-600 dark:text-dark-100 dark:hover:text-primary-400 dark:focus:text-primary-400"
                  >
                    {localStorage.getItem("username")}
                  </div>
                </div>
              </div>
              <div className="px-4 pt-4">
                <Button className="w-full gap-2" onClick={handleLogout}>
                  <ArrowLeftStartOnRectangleIcon className="size-4.5" />
                  <span>Logout</span>
                </Button>
              </div>
            </>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
