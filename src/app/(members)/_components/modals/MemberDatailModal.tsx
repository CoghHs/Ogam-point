"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMember,
  deletePointHistory,
  getPointHistories,
} from "../../actions";
import PointRegisterModal from "./PointRegisterModal";
import { useSelectedMemberStore } from "@/stores/selectedMemberStore";

export default function MemberDetailModal() {
  const { selectedMember, setSelectedMember } = useSelectedMemberStore();
  const [openPointModal, setOpenPointModal] = useState(false);
  const queryClient = useQueryClient();

  if (!selectedMember) return null;

  const { data: histories = [] } = useQuery({
    queryKey: ["pointHistories", selectedMember.id],
    queryFn: () => getPointHistories(selectedMember.id),
  });

  return (
    <div className="p-6 md:ml-4 h-full bg-white overflow-y-auto rounded-2xl border">
      {/* 모바일 닫기 버튼 */}
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setSelectedMember(null)}
          className="text-sm text-gray-500 hover:text-black"
        >
          ← 목록으로
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">
        {selectedMember.name} 님 상세
      </h2>
      <p className="text-sm text-gray-600 mb-1">
        연락처: {selectedMember.phoneNumber}
      </p>
      {selectedMember.totalPoint !== undefined && (
        <p className="text-sm text-gray-600 mb-4">
          총 적립금: {selectedMember.totalPoint.toLocaleString()}P
        </p>
      )}

      <button
        onClick={async () => {
          await deleteMember(selectedMember.id);
          queryClient.invalidateQueries({ queryKey: ["members"] });
          setSelectedMember(null);
        }}
        className="text-sm px-3 py-1 bg-red-600 text-white rounded-md mb-4"
      >
        회원 삭제
      </button>

      <button
        onClick={() => setOpenPointModal(true)}
        className="mb-4 text-sm px-3 py-1 bg-blue-600 text-white rounded-md"
      >
        + 적립금 등록
      </button>

      <ul className="space-y-2">
        {histories.map((h) => (
          <li key={h.id} className="border p-4 w-1/3 rounded-lg ">
            <div>+{h.amount.toLocaleString()}P</div>
            <div className="text-sm text-gray-500">
              등록일: {new Date(h.createdAt).toLocaleDateString()} / 소멸
              예정일:{" "}
              {h.expiredAt ? new Date(h.expiredAt).toLocaleDateString() : "-"}
            </div>
            <button
              onClick={async () => {
                await deletePointHistory(h.id);
                queryClient.invalidateQueries({
                  queryKey: ["pointHistories", selectedMember.id],
                });
              }}
              className="text-sm mt-2 px-3 py-1 bg-red-600 text-white rounded-md"
            >
              적립금 삭제
            </button>
          </li>
        ))}
      </ul>

      {openPointModal && (
        <PointRegisterModal
          memberId={selectedMember.id}
          onClose={() => setOpenPointModal(false)}
        />
      )}
    </div>
  );
}
