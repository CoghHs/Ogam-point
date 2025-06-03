"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  deleteMember,
  deletePointHistory,
  getMembers,
  getPointHistories,
} from "../actions";
import PointRegisterModal from "./modals/PointRegisterModal";
import { useSelectedMemberStore } from "@/stores/selectedMemberStore";
import ConfirmModal from "@/components/ConfirmModal";
import PointDeductedModal from "./modals/PointDeductedModal";
import MemberDetailHeader from "./member-detail/MemberDetailHeader";
import MemberInfoCard from "./member-detail/MemberInfoCard";
import MemberActionButtons from "./member-detail/MemberActionButtons";
import MemberPointTabs from "./member-detail/MemberPointTabs";
import MemberHistoryList from "./member-detail/MemberHistoryList";
import { ClipboardList } from "lucide-react";

export default function MemberDetail() {
  const [activeTab, setActiveTab] = useState<"ALL" | "REGISTER" | "DEDUCT">(
    "ALL"
  );

  const selectedMember = useSelectedMemberStore((s) => s.selectedMember);
  const setSelectedMember = useSelectedMemberStore((s) => s.setSelectedMember);

  const [openPointModal, setOpenPointModal] = useState(false);
  const [openPointDeductedModal, setOpenPointDeductedModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(
    () => {}
  );

  const queryClient = useQueryClient();

  const memberId = selectedMember?.id;

  const { data: histories = [] } = useQuery({
    queryKey: ["pointHistories", memberId],
    queryFn: () => getPointHistories(memberId!),
    enabled: !!memberId,
  });

  const handleDeleteMember = async () => {
    if (!memberId) return;
    await deleteMember(memberId);
    queryClient.invalidateQueries({ queryKey: ["members"] });
    setSelectedMember(null);
  };

  const handleDeletePointHistory = async (id: number) => {
    if (!memberId) return;

    await deletePointHistory(id);

    queryClient.invalidateQueries({ queryKey: ["pointHistories", memberId] });
    queryClient.invalidateQueries({ queryKey: ["members"] });

    const updatedMembers = await queryClient.fetchQuery({
      queryKey: ["members"],
      queryFn: getMembers,
    });

    const updatedMember = updatedMembers.find((m) => m.id === memberId);

    if (updatedMember) {
      const { id, name, phoneNumber, totalPoint } = updatedMember;
      setSelectedMember({ id, name, phoneNumber, totalPoint });
    }
  };

  const handleShowConfirm = (callback: () => void) => {
    setOnConfirmCallback(() => callback);
    setConfirmOpen(true);
  };

  const filteredHistories = histories.filter((h) => {
    if (activeTab === "ALL") return true;
    return h.type === activeTab;
  });

  if (!selectedMember) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="md:ml-4 bg-white rounded-2xl border border-slate-200"
    >
      {/* Header Section */}
      <div className="px-6 py-6">
        <MemberDetailHeader onBack={() => setSelectedMember(null)} />

        <MemberInfoCard
          name={selectedMember.name}
          phoneNumber={selectedMember.phoneNumber}
          totalPoint={selectedMember.totalPoint}
        />

        <MemberActionButtons
          onRegisterClick={() => setOpenPointModal(true)}
          onDeductClick={() => setOpenPointDeductedModal(true)}
          onDeleteClick={() => handleShowConfirm(handleDeleteMember)}
        />
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            적립금 히스토리
          </h3>
          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            총 {filteredHistories.length}건
          </span>
        </div>

        <MemberPointTabs activeTab={activeTab} onChange={setActiveTab} />

        <MemberHistoryList
          histories={filteredHistories}
          onDelete={(id) =>
            handleShowConfirm(() => handleDeletePointHistory(id))
          }
        />
      </div>

      {/* Modals */}
      {confirmOpen && (
        <ConfirmModal
          message="정말 삭제하시겠습니까?"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={() => {
            onConfirmCallback();
            setConfirmOpen(false);
          }}
        />
      )}

      {openPointModal && (
        <PointRegisterModal
          memberId={selectedMember.id}
          onClose={() => setOpenPointModal(false)}
        />
      )}

      {openPointDeductedModal && (
        <PointDeductedModal
          currentPoint={selectedMember.totalPoint}
          memberId={selectedMember.id}
          onClose={() => setOpenPointDeductedModal(false)}
        />
      )}
    </motion.div>
  );
}
