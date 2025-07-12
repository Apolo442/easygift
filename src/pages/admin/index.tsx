import React from "react";
import withAdminProtection from "@/hoc/withAdminProtection";
import Navbar from "@/components/navbar";

function AdminPage() {
  return (
    <>
      <Navbar />
      <div style={{ padding: "2rem" }}>
        <h1>Área Administrativa</h1>
        <p>Apenas administradores podem ver isso.</p>
      </div>
    </>
  );
}

export default withAdminProtection(AdminPage);
