import ClientMemberPage from "@/components/ClientMemberPage";
import { Suspense } from "react";

export default function MemberPage() {
  return (
    <Suspense fallback={<div>오감요가</div>}>
      <ClientMemberPage />
    </Suspense>
  );
}
