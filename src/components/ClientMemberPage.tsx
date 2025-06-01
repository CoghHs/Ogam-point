"use client";

import { useSelectedMemberStore } from "@/stores/selectedMemberStore";

import ProtectedPage from "@/components/ProtectedPage";
import MemberList from "@/app/(members)/_components/MemberList";
import MemberDetail from "@/app/(members)/_components/MemberDatail";

export default function ClientMemberPage() {
  const { selectedMember } = useSelectedMemberStore();

  return (
    <div className="relative h-screen flex md:flex-row">
      <ProtectedPage>
        <div className="w-full md:w-1/5 overflow-y-auto scrollbar-hide">
          <MemberList />
        </div>

        {selectedMember && (
          <div className="w-full md:w-4/5 hidden md:block overflow-y-auto">
            <MemberDetail />
          </div>
        )}

        {selectedMember && (
          <div className="absolute inset-0 z-50 md:hidden">
            <MemberDetail />
          </div>
        )}
      </ProtectedPage>
    </div>
  );
}
