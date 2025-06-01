"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const key = searchParams.get("key");
    const validKey = process.env.NEXT_PUBLIC_SITE_ACCESS_KEY;

    setAuthorized(key === validKey);
  }, [searchParams]);

  if (authorized === null) {
    return <div className="text-center mt-40">접근 확인 중...</div>;
  }

  if (!authorized) {
    return (
      <div className="text-center mt-40 text-red-500">
        접근 권한이 없습니다.
      </div>
    );
  }

  return <>{children}</>;
}
