
import { HomeIcon, UserGroupIcon, UserPlusIcon, CurrencyDollarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { NAV_TYPE_ITEM } from 'constants/app.constant';
import { isAdmin } from 'utils/auth';

const ROOT_DASHBOARDS = '/dashboards'

const path = (root, item) => `${root}${item}`;

// Common navigation items that are always visible
const commonNavItems = [
    {
        id: 'dashboards.home',
        path: '/dashboards/home',
        type: NAV_TYPE_ITEM,
        title: 'Home',
        transKey: 'nav.dashboards.home',
        Icon: HomeIcon,
    },
    {
        id: 'dashboards.staff',
        path: '/tables/emp1',
        type: NAV_TYPE_ITEM,
        title: 'Manage Staff',
        transKey: 'nav.dashboards.staff',
        Icon: UserGroupIcon,
    },
    {
        id: 'dashboards.attendance',
        path: '/tables/attendance',
        type: NAV_TYPE_ITEM,
        title: 'Attendance',
        transKey: 'nav.dashboards.attendance',
        Icon: UserPlusIcon,
    }
];

// Admin-only navigation items
const adminNavItems = [
    {
        id: 'dashboards.payroll',
        path: path(ROOT_DASHBOARDS, '/payroll'),
        type: NAV_TYPE_ITEM,
        title: 'Payroll Calculation',
        transKey: 'nav.dashboards.payroll',
        Icon: CurrencyDollarIcon,
        adminOnly: true
    },
    {
        id: 'dashboards.administration',
        path: path(ROOT_DASHBOARDS, '/administration'),
        type: NAV_TYPE_ITEM,
        title: 'Administration',
        transKey: 'nav.dashboards.administration',
        Icon: ShieldCheckIcon,
        adminOnly: true
    }
];

// This function will be called whenever the navigation is needed
export const getDashboards = () => {
    // Combine common items with admin items if user is admin
    return [
        ...commonNavItems,
        ...(isAdmin() ? adminNavItems : [])
    ];
};
