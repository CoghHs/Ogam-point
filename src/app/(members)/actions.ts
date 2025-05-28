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

export async function registerPoint(data: PointFormValues, memberId: number) {
  const result = pointSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { amount, createdAt } = result.data;
  const createdDate = new Date(createdAt);
  const expiredDate = new Date(createdDate);
  expiredDate.setFullYear(createdDate.getFullYear() + 1);

  await db.pointHistory.create({
    data: {
      memberId,
      amount,
      type: "REGISTER",
      createdAt: createdDate,
      expiredAt: expiredDate,
    },
  });

  revalidatePath("/");
  return { success: true };
}
export async function deductPoint(
  data: PointFormValues,
  memberId: number,
  currentPoint: number
) {
  const result = pointSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const { amount, createdAt, type } = result.data;

  if (amount > currentPoint) {
    return { error: { amount: ["현재 적립금보다 클 수 없습니다."] } };
  }

  const createdDate = new Date(createdAt);
  const expiredDate = new Date(createdDate);
  expiredDate.setFullYear(createdDate.getFullYear() + 1);

  await db.pointHistory.create({
    data: {
      memberId,
      amount,
      type,
      createdAt: createdDate,
      expiredAt: expiredDate,
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
    const totalPoint = member.PointHistory.reduce((sum, p) => {
      const point = p.type === "DEDUCT" ? -p.amount : p.amount;
      return sum + point;
    }, 0);

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
