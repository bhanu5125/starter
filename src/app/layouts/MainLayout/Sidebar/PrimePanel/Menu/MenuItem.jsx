// Import Dependencies
import PropTypes from "prop-types";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useRouteLoaderData } from "react-router";

// Local Imports
import { isRouteActive } from "utils/isRouteActive";
import { Badge } from "components/ui";

// ----------------------------------------------------------------------

export function MenuItem({ data }) {
  const { t } = useTranslation();
  const { path, title, transKey, Icon, id, linkProps } = data;
  const info = useRouteLoaderData("root")?.[id]?.info;

  // Determine the display title - prioritize title, then try to get from transKey, or fallback to path
  const displayTitle = title || (transKey ? t(transKey) : path.split('/').pop().replace(/-/g, ' '));
  
  // Only show active state if this is a direct link (no children)
  const isActive = !data.childs?.length && isRouteActive(path, location.pathname);

  return (
    <Link
      to={path}
      data-menu-active={isActive}
      className={`group flex h-10 w-full items-center justify-between rounded-lg px-3 text-gray-600 outline-none transition-colors 
        ${isActive 
          ? 'bg-primary-600/10 text-primary-600 dark:bg-primary-400/15 dark:text-primary-400' 
          : 'hover:bg-primary-600/10 hover:text-primary-600 dark:hover:bg-primary-400/15 dark:hover:text-primary-400'}
        focus:bg-primary-600/10 focus:text-primary-600 active:bg-primary-600/15 active:text-primary-600 
        dark:text-dark-200 dark:focus:bg-primary-400/15 dark:focus:text-primary-400 dark:active:bg-primary-400/20 dark:active:text-primary-400`}
      {...linkProps}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="size-5" />}
        <span className="truncate text-sm capitalize">{displayTitle}</span>
      </div>
      {info && info.val && (
        <Badge color={info.color} className="ml-auto">
          {info.val}
        </Badge>
      )}
    </Link>
  );
}

MenuItem.propTypes = {
  data: PropTypes.object.isRequired,
};