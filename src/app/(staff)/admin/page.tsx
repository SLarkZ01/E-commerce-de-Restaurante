import { obtenerStatsAdmin } from "@/lib/acciones/admin";
import { DashboardAdmin } from "@/components/admin/dashboardAdmin";
import { SkeletonDashboard } from "@/components/admin/skeletonDashboard";
import { Suspense } from "react";

export default function PaginaAdmin() {
  return (
    <Suspense fallback={<SkeletonDashboard />}>
      <ContenidoDashboard />
    </Suspense>
  );
}

async function ContenidoDashboard() {
  const stats = await obtenerStatsAdmin();
  return <DashboardAdmin statsIniciales={stats} />;
}
