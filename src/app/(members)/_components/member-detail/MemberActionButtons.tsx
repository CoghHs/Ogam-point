"use client";

import { Button } from "@/components/common/Button";
import { Minus, Plus, Trash2 } from "lucide-react";

interface MemberActionButtonsProps {
  onRegisterClick: () => void;
  onDeductClick: () => void;
  onDeleteClick: () => void;
}

export default function MemberActionButtons({
  onRegisterClick,
  onDeductClick,
  onDeleteClick,
}: MemberActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6">
      <Button
        onClick={onRegisterClick}
        className="w-full sm:flex-1 flex items-center justify-center gap-1.5 text-sm"
      >
        <Plus className="w-4 h-4" />
        <span className="truncate">적립금 등록</span>
      </Button>
      <Button
        onClick={onDeductClick}
        variant="destructive"
        className="w-full sm:flex-1 flex items-center justify-center gap-1.5 text-sm"
      >
        <Minus className="w-4 h-4" />
        <span className="truncate">적립금 차감</span>
      </Button>
      <Button
        onClick={onDeleteClick}
        variant="ghost"
        className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-sm text-slate-600 hover:text-red-600 hover:bg-red-100"
      >
        <Trash2 className="w-4 h-4" />
        <span className="truncate">회원 삭제</span>
      </Button>
    </div>
  );
}
