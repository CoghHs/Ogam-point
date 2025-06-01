"use client";
import { ChevronLeft } from "lucide-react";

interface MemberDetailHeaderProps {
  onBack: () => void;
}

export default function MemberDetailHeader({
  onBack,
}: MemberDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        <span className="text-sm font-medium">목록으로</span>
      </button>
    </div>
  );
}
