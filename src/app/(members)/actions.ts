"use server";

import db from "@/lib/prisma";
import {
  MemberFormValues,
  memberSchema,
  PointFormValues,
  pointSchema,
} from "./schema";
import { revalidatePath } from "next/cache";

export async function registerMember(data: MemberFormValues) {
  const result = memberSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }
  await db.member.create({ data: result.data });
  revalidatePath("/");
  return { success: true };
}

export async function registerPoint(memberId: number, data: PointFormValues) {
  const result = pointSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }
  const now = new Date();
  const expiredAt = new Date(now);
  expiredAt.setFullYear(now.getFullYear() + 1);
  await db.pointHistory.create({
    data: {
      memberId,
      amount: result.data.amount,
      createdAt: now,
      expiredAt,
    },
  });
  revalidatePath("/");
  return { success: true };
}

export async function deleteMember(memberId: number) {
  await db.member.delete({
    where: {
      id: memberId,
    },
  });
  revalidatePath("/");
  return { success: true };
}

export async function deletePointHistory(pointId: number) {
  await db.pointHistory.delete({
    where: {
      id: pointId,
    },
  });
  revalidatePath("/");
  return { success: true };
}

export async function getMembers() {
  const members = await db.member.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      PointHistory: true,
    },
  });

  return members.map((member) => {
    const totalPoint = member.PointHistory.reduce(
      (sum, p) => sum + p.amount,
      0
    );
    return {
      ...member,
      totalPoint,
    };
  });
}

export async function getPointHistories(memberId: number) {
  const histories = await db.pointHistory.findMany({
    where: {
      memberId,
    },
    orderBy: { createdAt: "desc" },
  });
  return histories;
}
