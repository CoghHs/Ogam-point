import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { MemberFormValues, memberSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerMember } from "../../actions";
import { motion } from "framer-motion";

export default function MemberRegisterModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberFormValues>({ resolver: zodResolver(memberSchema) });
  const onSubmit = async (data: MemberFormValues) => {
    await registerMember(data);
    await queryClient.invalidateQueries({ queryKey: ["members"] });
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 rounded-xl w-96"
      >
        <h3 className="text-lg font-semibold mb-4">회원 등록</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("name")}
            placeholder="이름"
            className="w-full border p-2 rounded-md"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
          <input
            {...register("phoneNumber")}
            placeholder="전화번호"
            className="w-full border p-2 rounded-md"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose}>
              취소
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 transition-colors text-white px-4 py-1 rounded-md"
            >
              등록
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
