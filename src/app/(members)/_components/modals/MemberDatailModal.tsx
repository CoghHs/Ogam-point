"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  deleteMember,
  deletePointHistory,
  getPointHistories,
} from "../../actions";
import PointRegisterModal from "./PointRegisterModal";
import { useSelectedMemberStore } from "@/stores/selectedMemberStore";
import ConfirmModal from "@/components/ConfirmModal";
import {
  ChevronLeft,
  User,
  Phone,
  DollarSign,
  Plus,
  Trash2,
  ClipboardList,
  Calendar,
  Clock,
  Minus,
} from "lucide-react";
import PointDeductedModal from "./PointDeductedModal";

export default function MemberDetailModal() {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex md:ml-4 bg-white rounded-2xl border border-slate-200 flex-col h-full"
    >
      {/* Header Section */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedMember(null)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-sm font-medium">목록으로</span>
          </button>
        </div>

        {/* Member Info Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                  {selectedMember.name}
                </h2>
                <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                  회원
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">연락처</p>
                <p className="text-sm font-medium text-slate-900">
                  {selectedMember.phoneNumber}
                </p>
              </div>
            </div>

            {selectedMember.totalPoint !== undefined && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-emerald-600 mb-0.5">총 적립금</p>
                  <p className="text-sm font-bold text-emerald-700">
                    {selectedMember.totalPoint.toLocaleString()}P
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setOpenPointModal(true)}
            className="flex-1 bg-blue-500 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            적립금 등록
          </button>
          <button
            onClick={() => setOpenPointDeductedModal(true)}
            className="flex-1 bg-red-500 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Minus className="w-5 h-5" />
            적립금 차감
          </button>
          <button
            onClick={() => showConfirm(() => handleDeleteMember())}
            className="px-4 py-3 bg-slate-50 hover:bg-red-100 text-slate-600 hover:text-red-600 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            회원 삭제
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            적립금 히스토리
          </h3>
          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            총 {filteredHistories.length}건
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["ALL", "REGISTER", "DEDUCT"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab === "ALL" ? "전체" : tab === "REGISTER" ? "추가" : "차감"}
            </button>
          ))}
        </div>

        {filteredHistories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <ClipboardList className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500">아직 적립금 내역이 없습니다</p>
            <p className="text-sm text-slate-400 mt-1">적립금을 등록해보세요</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredHistories.map((h) => (
              <div
                key={h.id}
                className="group bg-white border border-slate-200/60 hover:border-blue-200 rounded-2xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {h.type === "DEDUCT" ? "-" : "+"}
                    {h.amount.toLocaleString()}P
                  </div>
                  <button
                    onClick={() =>
                      showConfirm(() => handleDeletePointHistory(h.id))
                    }
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all duration-200 p-1 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    등록일: {new Date(h.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    소멸 예정일:{" "}
                    {h.expiredAt
                      ? new Date(h.expiredAt).toLocaleDateString()
                      : "무제한"}
                  </div>
                </div>

                {/* Progress bar for expiration */}
                {h.expiredAt && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>만료까지</span>
                      <span>
                        {Math.max(
                          0,
                          Math.ceil(
                            (new Date(h.expiredAt).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        )}
                        일
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max(
                            10,
                            Math.min(
                              100,
                              ((new Date(h.expiredAt).getTime() -
                                new Date().getTime()) /
                                (365 * 24 * 60 * 60 * 1000)) *
                                100
                            )
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
