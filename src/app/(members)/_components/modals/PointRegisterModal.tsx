"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pointSchema, PointFormValues } from "../../schema";
import { registerPoint } from "../../actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSelectedMemberStore } from "@/stores/selectedMemberStore";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";

interface PointRegisterModalProps {
  memberId: number;
  onClose: () => void;
}

export default function PointRegisterModal({
  memberId,
  onClose,
}: PointRegisterModalProps) {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState("");
  const { updateTotalPoint } = useSelectedMemberStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PointFormValues>({
    resolver: zodResolver(pointSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: PointFormValues) => registerPoint(data, memberId),
    onSuccess: (res, variables) => {
      if (res?.error) {
        setErrorMessage("적립금 등록에 실패했습니다.");
      } else {
        queryClient.invalidateQueries({
          queryKey: ["pointHistories", memberId],
        });
        queryClient.invalidateQueries({
          queryKey: ["members"],
        });
        updateTotalPoint(variables.amount);
        onClose();
      }
    },
  });

  const onSubmit = (data: PointFormValues) => {
    setErrorMessage("");
    mutation.mutate({
      ...data,
      type: "REGISTER",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative"
      >
        <Button
          onClick={onClose}
          variant="clear"
          size="sm"
          className="absolute top-3 right-3 text-sm text-gray-500 hover:text-black"
        >
          닫기
        </Button>

        <h2 className="text-xl font-semibold mb-4">적립금 등록</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input type="hidden" value="REGISTER" {...register("type")} />
          <div className="space-y-2">
            <label className="block text-[16px] font-medium mb-1">등록일</label>
            <Input
              type="date"
              {...register("createdAt")}
              defaultValue={new Date().toISOString().split("T")[0]}
            />
            {errors.createdAt && (
              <p className="text-red-500 text-xs mt-1">
                {errors.createdAt.message}
              </p>
            )}
            <Input
              type="number"
              {...register("amount", { valueAsNumber: true })}
              placeholder="예: 1000"
            />
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white text-sm py-2 rounded-md hover:bg-blue-700"
          >
            {isSubmitting ? "등록 중..." : "적립금 등록"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
