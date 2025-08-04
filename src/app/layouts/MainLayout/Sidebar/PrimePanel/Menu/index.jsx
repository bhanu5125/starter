/* eslint-disable no-unused-vars */
// Import Dependencies
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import SimpleBar from "simplebar-react";
import { useTranslation } from "react-i18next";

// Local Imports
import { isRouteActive } from "utils/isRouteActive";
import {
  useDataScrollOverflow,
  useDidUpdate,
  useIsomorphicEffect,
} from "hooks";
import { CollapsibleItem } from "./CollapsibleItem";
import { Accordion } from "components/ui";
import { MenuItem } from "./MenuItem";
import { Divider } from "./Divider";
import {
  NAV_TYPE_COLLAPSE,
  NAV_TYPE_DIVIDER,
  NAV_TYPE_ITEM,
} from "constants/app.constant";

// ----------------------------------------------------------------------

export function Menu({ nav, pathname, title }) {
  const { t } = useTranslation();
  const initialActivePath = useMemo(() => {
    return nav.find((item) => isRouteActive(item.path, pathname))?.path;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { ref, recalculate } = useDataScrollOverflow();
  const [expanded, setExpanded] = useState(initialActivePath || "");

  useDidUpdate(recalculate, [nav]);

  useDidUpdate(() => {
    const activePath = nav.find((item) =>
      isRouteActive(item.path, pathname),
    )?.path;

    if (activePath && expanded !== activePath) {     
      setExpanded(activePath);
    }
  }, [nav, pathname]);

  useIsomorphicEffect(() => {
    const activeItem = ref?.current.querySelector("[data-menu-active=true]");
    activeItem?.scrollIntoView({ block: "center" });
  }, []);

    // Flatten the navigation structure to get all items at the same level
  const flattenNav = (items) => {
    return items.reduce((acc, item) => {
      // Add the current item
      acc.push({
        ...item,
        // Ensure we have a proper title
        title: item.title || (item.transKey ? t(item.transKey) : ''),
        // If it's a root item, use its path, otherwise use the full path
        path: item.path || (item.childs?.[0]?.path)
      });
      
      // Add all children if they exist
      if (item.childs && item.childs.length > 0) {
        acc.push(...flattenNav(item.childs));
      }
      
      return acc;
    }, []);
  };

  // Get all navigation items at the same level
  const allNavItems = flattenNav(nav);

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="flex-1 overflow-hidden">
        <SimpleBar
          scrollableNodeProps={{ ref }}
          className="h-full overflow-x-hidden pb-6"
          style={{ "--scroll-shadow-size": "32px" }}
        >
          <div className="flex h-full flex-col px-4">
            {allNavItems.map((item) => {
              // Skip items that don't have a valid path
              if (!item.path) return null;
              
              // Handle different item types
              switch (item.type) {
                case NAV_TYPE_COLLAPSE:
                  return <CollapsibleItem key={item.id || item.path} data={item} />;
                case NAV_TYPE_ITEM:
                  return (
                    <div key={item.id || item.path} className="mb-1">
                      <MenuItem data={item} />
                    </div>
                  );
                case NAV_TYPE_DIVIDER:
                  return <Divider key={item.id} />;
                default:
                  // For items without a type, treat them as regular menu items
                  return (
                    <div key={item.id || item.path} className="mb-1">
                      <MenuItem data={item} />
                    </div>
                  );
              }
            })}
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}

Menu.propTypes = {
  nav: PropTypes.array,
  pathname: PropTypes.string,
  title: PropTypes.string,
};