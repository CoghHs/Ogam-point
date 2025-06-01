import { motion } from "framer-motion";
import { Button } from "./common/Button";

type ConfirmModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 rounded-lg shadow-lg w-80"
      >
        <p className="text-gray-800 mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} size="md">
            취소
          </Button>
          <Button onClick={onConfirm} size="md">
            확인
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
