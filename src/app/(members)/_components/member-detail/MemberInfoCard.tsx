"use client";

import { DollarSign, Phone } from "lucide-react";
import Image from "next/image";

interface MemberInfoCardProps {
  name: string;
  phoneNumber: string;
  totalPoint: number;
}

export default function MemberInfoCard({
  name,
  phoneNumber,
  totalPoint,
}: MemberInfoCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center">
            <Image src="/bbibbi.png" alt="오감로고" width={100} height={100} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">{name}</h2>
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
            <p className="text-sm font-medium text-slate-900">{phoneNumber}</p>
          </div>
        </div>

        {totalPoint !== undefined && (
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-emerald-600 mb-0.5">총 적립금</p>
              <p className="text-sm font-bold text-emerald-700">
                {totalPoint.toLocaleString()}P
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
