"use client";

import { Button } from "@/components/common/Button";

type TabType = "ALL" | "REGISTER" | "DEDUCT";

interface MemberPointTabsProps {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

export default function MemberPointTabs({
  activeTab,
  onChange,
}: MemberPointTabsProps) {
  return (
    <div className="flex gap-2 mb-6">
      {["ALL", "REGISTER", "DEDUCT"].map((tab) => (
        <Button
          key={tab}
          size="md"
          onClick={() => onChange(tab as typeof activeTab)}
          className={`font-medium rounded-3xl ${
            activeTab === tab
              ? "bg-blue-500 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {tab === "ALL" ? "전체" : tab === "REGISTER" ? "추가" : "차감"}
        </Button>
      ))}
    </div>
  );
}
