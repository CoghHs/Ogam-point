"use client";

import { useState } from "react";
import MemberList from "./_components/MemberList";
import MemberDetailModal from "./_components/modals/MemberDatailModal";

export default function Members() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <main className="">
      <MemberList setSelectedId={setSelectedId} />
      {selectedId && (
        <MemberDetailModal
          selectedId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </main>
  );
}
