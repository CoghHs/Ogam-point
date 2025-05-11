"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMember,
  deletePointHistory,
  getPointHistories,
} from "../../actions";
import { motion } from "framer-motion";
import PointRegisterModal from "./PointRegisterModal";

interface MemberDetailModalProps {
  selectedId: number;
  onClose: () => void;
}

export default function MemberDetailModal({
  selectedId,
  onClose,
}: MemberDetailModalProps) {
  const [openPointModal, setOpenPointModal] = useState(false);
  const { data: histories = [] } = useQuery({
    queryKey: ["pointHistories", selectedId],
    queryFn: () => getPointHistories(selectedId),
  });
  const queryClient = useQueryClient();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-xl shadow-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-sm"
        >
          닫기
        </button>

        <h2 className="text-xl font-semibold mb-4">회원 상세</h2>
        <button
          onClick={async () => {
            await deleteMember(selectedId);
            queryClient.invalidateQueries({
              queryKey: ["members"],
            });
            onClose();
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
            <li key={h.id} className="border p-2 rounded-md">
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
                    queryKey: ["pointHistories", selectedId],
                  });
                }}
                className="text-sm px-3 py-1 bg-red-600 text-white rounded-md mb-4"
              >
                적립금 삭제
              </button>
            </li>
          ))}
        </ul>

        {openPointModal && (
          <PointRegisterModal
            memberId={selectedId}
            onClose={() => setOpenPointModal(false)}
          />
        )}
      </motion.div>
    </div>
  );
}
