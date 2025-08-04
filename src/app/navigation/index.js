import { getDashboards } from "./dashboards";
import { isAuthenticated } from 'utils/auth';

// This function will be called whenever the navigation is needed
export const getNavigation = () => {
    if (!isAuthenticated()) {
        return [];
    }
    return getDashboards();
};

export { baseNavigation } from './baseNavigation';
