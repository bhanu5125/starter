// Import Dependencies
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useRouteLoaderData } from "react-router";

// Local Imports
import { isRouteActive } from "utils/isRouteActive";
import { Accordion, Badge } from "components/ui";
import { MenuItem } from "./MenuItem";

// ----------------------------------------------------------------------

export function CollapsibleItem({ data }) {
  const { t } = useTranslation();
  const { id, title, transKey, Icon, path, childs } = data;
  const info = useRouteLoaderData("root")?.[id]?.info;

  const isActive = isRouteActive(path, location.pathname);

  return (
    <Accordion.Item value={path}>
      <Accordion.Control
        data-menu-active={isActive}
        className="group flex h-10 w-full items-center justify-between rounded-lg px-3 text-gray-600 outline-none transition-colors hover:bg-primary-600/10 hover:text-primary-600 focus:bg-primary-600/10 focus:text-primary-600 active:bg-primary-600/15 active:text-primary-600 data-[menu-active=true]:bg-primary-600/10 data-[menu-active=true]:text-primary-600 dark:text-dark-200 dark:hover:bg-primary-400/15 dark:hover:text-primary-400 dark:focus:bg-primary-400/15 dark:focus:text-primary-400 dark:active:bg-primary-400/20 dark:active:text-primary-400 dark:data-[menu-active=true]:bg-primary-400/15 dark:data-[menu-active=true]:text-primary-400"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="size-5" />}
          <span className="truncate text-sm">{t(transKey) || title}</span>
        </div>
        <div className="flex items-center gap-2">
          {info && info.val && (
            <Badge color={info.color}>{info.val}</Badge>
          )}
          <ChevronDownIcon className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </div>
      </Accordion.Control>
      <Accordion.Content className="space-y-1 pl-4 pt-1">
        {childs?.map((item) => (
          <MenuItem key={item.path} data={item} />
        ))}
      </Accordion.Content>
    </Accordion.Item>
  );
}

CollapsibleItem.propTypes = {
  data: PropTypes.object.isRequired,
};