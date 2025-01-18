import PolicyRoutes from './policy/policy.routes';

export const IndexRoutes = [
  { path: '/policy/*', element: <PolicyRoutes /> },
];
