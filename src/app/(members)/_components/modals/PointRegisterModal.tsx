"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pointSchema, PointFormValues } from "../../schema";
import { registerPoint } from "../../actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PointFormValues>({
    resolver: zodResolver(pointSchema),
  });

  const mutation = useMutation({
    mutationFn: (data: PointFormValues) => registerPoint(memberId, data),
    onSuccess: (res) => {
      if (res?.error) {
        setErrorMessage("적립금 등록에 실패했습니다.");
      } else {
        queryClient.invalidateQueries({
          queryKey: ["pointHistories", memberId],
        });
        onClose();
      }
    },
  });

  const onSubmit = (data: PointFormValues) => {
    setErrorMessage("");
    mutation.mutate(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-sm text-gray-500 hover:text-black"
        >
          닫기
        </button>

        <h2 className="text-xl font-semibold mb-4">적립금 등록</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              적립금 금액
            </label>
            <input
              type="number"
              {...register("amount", { valueAsNumber: true })}
              className="w-full border px-3 py-2 rounded-md text-sm"
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
