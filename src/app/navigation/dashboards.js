/* eslint-disable no-unused-vars */
import { HomeIcon, UserGroupIcon, UserPlusIcon, CurrencyDollarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import DashboardsIcon from 'assets/dualicons/dashboards.svg?react'
import { NAV_TYPE_ROOT, NAV_TYPE_ITEM } from 'constants/app.constant'

const ROOT_DASHBOARDS = '/dashboards'

const path = (root, item) => `${root}${item}`;

export const dashboards = {
    id: 'home',
    type: NAV_TYPE_ITEM,
    path: '/dashboards/home',
    title: 'Home',
    transKey: 'nav.dashboards.home',
    Icon: HomeIcon,
    childs: [
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
        },
        {
            id: 'dashboards.payroll',
            path: path(ROOT_DASHBOARDS, '/payroll'),
            type: NAV_TYPE_ITEM,
            title: 'Payroll Calculation',
            transKey: 'nav.dashboards.payroll',
            Icon: CurrencyDollarIcon,
        },
        {
            id: 'dashboards.administration',
            path: path(ROOT_DASHBOARDS, '/administration'),
            type: NAV_TYPE_ITEM,
            title: 'Administration',
            transKey: 'nav.dashboards.administration',
            Icon: ShieldCheckIcon,
        },
    ]
}
