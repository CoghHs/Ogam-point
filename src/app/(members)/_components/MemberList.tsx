"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { deleteMember, getMembers } from "../actions";
import MemberRegisterModal from "./modals/MemberRegisterModal";

interface MemberListProps {
  setSelectedId: (id: number) => void;
}

export default function MemberList({ setSelectedId }: MemberListProps) {
  const [open, setOpen] = useState(false);
  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });
  const handleDeleteMember = async (id: number) => {
    const ok = confirm("회원목록에서 제거합니다.");
    if (!ok) {
      return;
    }
    await deleteMember(id);
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">회원 목록</h2>
        <button
          onClick={() => setOpen(true)}
          className="text-sm px-3 py-1 bg-black text-white rounded-md"
        >
          + 회원 등록
        </button>
      </div>
      <ul className="space-y-2">
        {members?.map((m: any) => (
          <li
            key={m.id}
            className="cursor-pointer"
            onClick={() => setSelectedId(m.id)}
          >
            <div className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-100">
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-sm text-gray-500">{m.phoneNumber}</p>
              </div>
              <div>
                <p>{m.totalPoint}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {open && <MemberRegisterModal onClose={() => setOpen(false)} />}
    </div>
  );
}
