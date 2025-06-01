"use client";

import { Calendar, Trash2 } from "lucide-react";
import { PointHistory } from "@prisma/client";

interface MemberHistoryCardProps {
  history: PointHistory;
  onDelete: () => void;
}

export default function MemberHistoryCard({
  history,
  onDelete,
}: MemberHistoryCardProps) {
  const { amount, createdAt, expiredAt, type, isExpired, reason } = history;

  // 적립 항목에서만 소멸 예정일 관련 계산
  const progressPercent = expiredAt
    ? Math.max(
        10,
        Math.min(
          100,
          ((new Date(expiredAt).getTime() - new Date().getTime()) /
            (365 * 24 * 60 * 60 * 1000)) *
            100
        )
      )
    : 100;

  return (
    <div
      className={`group border rounded-2xl p-5 transition-all duration-200 ${
        isExpired
          ? "bg-slate-100 border-slate-300 text-slate-400"
          : "bg-white border-slate-200/60 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10"
      }`}
    >
      {/* 금액 + 삭제 */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            type === "DEDUCT"
              ? "bg-red-100 text-red-500"
              : isExpired
              ? "bg-slate-300 text-slate-500"
              : "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
          }`}
        >
          {type === "DEDUCT" ? "-" : "+"}
          {amount.toLocaleString()}P
        </div>

        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all duration-200 p-1 hover:bg-red-50 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* 차감 타입일 경우 간단한 정보만 출력 */}
      {type === "DEDUCT" ? (
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            차감일: {new Date(createdAt).toLocaleDateString()}
          </div>
          {reason && (
            <div className="flex items-center gap-2">
              <div className="text-sm flex gap-2 items-center mb-1">
                <Calendar className="w-4 h-4 text-slate-400" />
                사유: {reason}
              </div>
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <span className="flex items-center justify-between text-xs text-slate-500 mb-1">
              차감 완료
            </span>
            <div className="w-full bg-red-500 rounded-full h-1.5"></div>
          </div>
        </div>
      ) : (
        // 적립일 경우
        <>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              등록일: {new Date(createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              {isExpired ? (
                <span className="text-red-500 font-semibold">
                  소멸됨:{" "}
                  {expiredAt ? new Date(expiredAt).toLocaleDateString() : ""}
                </span>
              ) : (
                <>
                  소멸 예정일:{" "}
                  {expiredAt
                    ? new Date(expiredAt).toLocaleDateString()
                    : "무제한"}
                </>
              )}
            </div>
          </div>

          {!isExpired && expiredAt && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>만료까지</span>
                <span>
                  {Math.max(
                    0,
                    Math.ceil(
                      (new Date(expiredAt).getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  )}
                  일
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
          {}
        </>
      )}
    </div>
  );
}
