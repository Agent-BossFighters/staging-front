import DashboardRoutes from './dashboard/dashboard.routes';
import PolicyRoutes from './policy/policy.routes';
import StaticRoutes from './static/static.routes';

export const IndexRoutes = [
  { path: '/dashboard/*', element: <DashboardRoutes /> },
  { path: '/policy/*', element: <PolicyRoutes /> },
  { path: '/*', element: <StaticRoutes /> },
];
