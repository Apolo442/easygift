import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/hooks/AuthContext";
import ProtectedRoute from "@/components/routeprotetion";
import { useRouter } from "next/router";

const protectedRoutes = [
  "/presentes",
  "/evento",
  "/confirmar",
  "/galeria",
  "/gerenciar",
];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const isProtected = protectedRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      {isProtected ? (
        <ProtectedRoute>
          <Component {...pageProps} />
        </ProtectedRoute>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}
