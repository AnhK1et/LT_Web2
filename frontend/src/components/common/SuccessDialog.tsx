import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderCode: string;
  orderId?: number;
}

export const SuccessDialog = ({ isOpen, onClose, orderCode, orderId }: SuccessDialogProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-500" />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-accent-900 mb-2"
        >
          Đặt hàng thành công!
        </motion.h2>

        {/* Message */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-accent-600 mb-6"
        >
          Cảm ơn bạn đã đặt hàng tại AKStore. Đơn hàng của bạn đang được xử lý.
        </motion.p>

        {/* Order Code */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-accent-50 rounded-xl p-4 mb-6"
        >
          <p className="text-sm text-accent-500 mb-1">Mã đơn hàng</p>
          <p className="text-2xl font-bold text-primary">{orderCode}</p>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-sm text-accent-500 mb-6"
        >
          <Package className="w-4 h-4" />
          <span>Chúng tôi sẽ gửi email xác nhận đơn hàng cho bạn</span>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          {orderId && (
            <Link to={`/orders/${orderId}`}>
              <Button className="w-full" variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Xem chi tiết đơn hàng
              </Button>
            </Link>
          )}
          <Link to="/products">
            <Button className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Tiếp tục mua sắm
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
