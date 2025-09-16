import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom"
import { useAuth } from "@contexts";
import type { ContextProps } from "@types";
import { BasePanel, FullLoader } from "@components";
import { lazy, Suspense } from "react";
import { Sends, Drivers, Tracking } from "@pages";

// Lazy loading de páginas principales
const Login = lazy(() => import("@pages").then(m => ({ default: m.Login })));
const Home = lazy(() => import("@pages").then(m => ({ default: m.Home })));

const ProtectedRoute = ({ children }: ContextProps) => {
  const { isAutenticated } = useAuth();
  switch (true) {
    case (!isAutenticated()):
      return <Navigate to="/login" />
    default:
      return (
        <BasePanel>
          {children}
        </BasePanel>
      );
  }
}

// Configuración del router con createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<FullLoader fullSize={true} altText="Cargando Login..." />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sends",
    element: (
      <ProtectedRoute>
        <Sends />
      </ProtectedRoute>
    ),
  },
  {
    path: "/drivers",
    element: (
      <ProtectedRoute>
        <Drivers />
      </ProtectedRoute>
    ),
  },
  {
    path: "/tracking",
    element: (
      <Suspense fallback={<FullLoader fullSize={true} altText="Cargando Tracking..." />}>
        <Tracking />
      </Suspense>
    ),
  },
]);

// Componente Router que usa RouterProvider
export const Router = () => {
  return <RouterProvider router={router} />;
};