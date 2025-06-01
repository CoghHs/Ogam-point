"use client";

import { useSelectedMemberStore } from "@/stores/selectedMemberStore";
import MemberList from "./_components/MemberList";
import MemberDetail from "./_components/MemberDatail";

export default function MemberPage() {
  const { selectedMember } = useSelectedMemberStore();

  return (
    <div className="relative h-screen flex md:flex-row">
      {/* 리스트 영역 */}
      <div className="w-full md:w-1/5 overflow-y-auto scrollbar-hide">
        <MemberList />
      </div>

      {/* 데스크탑 전용 상세 영역 */}
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
    </div>
  );
}
