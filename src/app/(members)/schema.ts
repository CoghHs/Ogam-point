import { z } from "zod";

export const memberSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요."),
  phoneNumber: z
    .string()
    .regex(/^010\d{4}\d{4}$/, "전화번호 형식은 010xxxxxxxx 입니다."),
});

export const pointSchema = z.object({
  amount: z.number().min(1, "1 이상의 숫자를 입력해주세요."),
  createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "날짜를 선택해주세요.",
  }),
  type: z.enum(["REGISTER", "DEDUCT"]),
  reason: z.string().optional(),
});

export type MemberFormValues = z.infer<typeof memberSchema>;
export type PointFormValues = z.infer<typeof pointSchema>;
