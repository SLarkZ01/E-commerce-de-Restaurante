import { Suspense } from "react";
import AuthResolver from "@/components/staff/authResolver";
import { ShellSkeleton } from "@/components/staff/shellSkeleton";

export default function LayoutStaff({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<ShellSkeleton>{children}</ShellSkeleton>}>
      <AuthResolver>{children}</AuthResolver>
    </Suspense>
  );
}
