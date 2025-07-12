import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/AuthContext";

// HOC que protege rotas para apenas admins
const withAdminProtection = (WrappedComponent: React.ComponentType) => {
  return function AdminProtectedComponent(
    props: React.ComponentProps<typeof WrappedComponent>
  ) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && (!user || !user.isAdmin)) {
        router.replace("/presentes");
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return <p style={{ textAlign: "center" }}>Carregando...</p>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminProtection;
