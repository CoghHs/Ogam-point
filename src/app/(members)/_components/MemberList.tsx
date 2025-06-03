"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getMembers } from "../actions";
import MemberRegisterModal from "./modals/MemberRegisterModal";
import { useSelectedMemberStore } from "@/stores/selectedMemberStore";
import Image from "next/image";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";

export default function MemberList() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const setSelectedMember = useSelectedMemberStore((s) => s.setSelectedMember);
  const { data: members = [] } = useQuery({
    queryKey: ["members"],
    queryFn: getMembers,
  });
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="px-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Image src="/ogam.png" alt="오감로고" width={50} height={50} />
          <h2 className="text-2xl font-light ml-1">MEMBERS</h2>
        </div>
        <div>
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
            +
          </Button>
        </div>
      </div>

      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="회원 이름 검색"
      />

      {filteredMembers.length === 0 && (
        <p className="text-sm text-gray-500 mt-5">검색 결과가 없습니다.</p>
      )}

      <ul className="space-y-2 mt-2 ">
        {filteredMembers.map((member) => (
          <li
            key={member.id}
            onClick={() => setSelectedMember(member)}
            className="flex flex-col py-4 cursor-pointer hover:bg-gray-100 px-4 rounded-xl border bg-white"
          >
            <div className="flex justify-between items-center">
              <div className="font-semibold mb-2">{member.name}</div>
            </div>

            <div className="flex justify-between items-end">
              <div className="text-sm text-gray-500 space-y-1">
                <div>{member.phoneNumber}</div>
                <div>적립금: {member.totalPoint.toLocaleString()}P</div>
              </div>
              <div className="text-lg font-semibold text-gray-400 w-8 h-8 border text-center rounded-lg">
                &rarr;
              </div>
            </div>
          </li>
        ))}
      </ul>
      {open && <MemberRegisterModal onClose={() => setOpen(false)} />}
    </div>
  );
}
