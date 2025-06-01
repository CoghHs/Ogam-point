"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  deleteMember,
  deletePointHistory,
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
  const { selectedMember, setSelectedMember } = useSelectedMemberStore();
  const [openPointModal, setOpenPointModal] = useState(false);
  const [openPointDeductedModal, setOpenPointDeductedModal] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [onConfirmCallback, setOnConfirmCallback] = useState<() => void>(
    () => {}
  );
  const showConfirm = (callback: () => void) => {
    setOnConfirmCallback(() => callback);
    setConfirmOpen(true);
  };
  const queryClient = useQueryClient();

  if (!selectedMember) return null;

  const { data: histories = [] } = useQuery({
    queryKey: ["pointHistories", selectedMember.id],
    queryFn: () => getPointHistories(selectedMember.id),
  });

  const handleDeleteMember = async () => {
    await deleteMember(selectedMember.id);
    queryClient.invalidateQueries({ queryKey: ["members"] });
    setSelectedMember(null);
  };

  const handleDeletePointHistory = async (id: number) => {
    await deletePointHistory(id);
    queryClient.invalidateQueries({
      queryKey: ["pointHistories", selectedMember.id],
    });
  };

  const filteredHistories = histories.filter((h) => {
    if (activeTab === "ALL") return true;
    return h.type === activeTab;
  });

  const handleShowConfirm = (callback: () => void) => {
    setOnConfirmCallback(() => callback);
    setConfirmOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className=" md:ml-4 bg-white rounded-2xl border border-slate-200 "
    >
      {/* Header Section */}
      <div className="px-6 py-6">
        <MemberDetailHeader onBack={() => setSelectedMember(null)} />
        {/* Member Info Card */}
        <MemberInfoCard
          name={selectedMember.name}
          phoneNumber={selectedMember.phoneNumber}
          totalPoint={selectedMember.totalPoint}
        />

        {/* Action Buttons */}

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

        {/* Tabs */}
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
