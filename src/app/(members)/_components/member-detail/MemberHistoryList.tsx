"use client";

import { PointHistory } from "@prisma/client";
import { ClipboardList } from "lucide-react";
import MemberHistoryCard from "./MemberHistoryCard";

interface MemberHistoryListProps {
  histories: PointHistory[];
  onDelete: (id: number) => void;
}

export default function MemberHistoryList({
  histories,
  onDelete,
}: MemberHistoryListProps) {
  if (histories.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
          <ClipboardList className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500">아직 적립금 내역이 없습니다</p>
        <p className="text-sm text-slate-400 mt-1">적립금을 등록해보세요</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {histories.map((h) => (
        <MemberHistoryCard
          key={h.id}
          history={h}
          onDelete={() => onDelete(h.id)}
        />
      ))}
    </div>
  );
}
