import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { MemberFormValues, memberSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerMember } from "../../actions";
import { motion } from "framer-motion";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";

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
          <Input
            {...register("name")}
            placeholder="이름"
            className="w-full border p-2 rounded-md"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
          <Input
            {...register("phoneNumber")}
            placeholder="전화번호"
            className="w-full border p-2 rounded-md"
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
          )}
          <div className="flex justify-end gap-2">
            <div className="flex justify-end gap-2">
              <Button type="button" variant="clear" onClick={onClose}>
                취소
              </Button>
              <Button type="submit">등록</Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
