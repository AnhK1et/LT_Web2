import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Tag, Percent, Gift, Clock } from 'lucide-react';
import { Button } from '@/components/ui';

export default function PromotionsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-accent-50 pb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Khuyến mãi</h1>
          <p className="text-white/80">Cập nhật những ưu đãi hấp dẫn nhất</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Promotion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-6 h-6" />
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                  Ưu đãi đặc biệt
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Giảm giá lên đến 50%
              </h2>
              <p className="text-white/80 mb-4">
                Áp dụng cho tất cả sản phẩm điện thoại và laptop
              </p>
              <Button
                onClick={() => navigate('/products?sale=true')}
                className="bg-white text-red-600 hover:bg-white/90"
              >
                Xem ngay
              </Button>
            </div>
            <div className="text-8xl font-bold opacity-50">
              %50
            </div>
          </div>
        </motion.div>

        {/* Promotion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-card p-6"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Percent className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-accent-900 mb-2">Giảm 20% cho đơn hàng đầu tiên</h3>
            <p className="text-accent-600 text-sm mb-4">
              Áp dụng cho khách hàng mới đăng ký tài khoản AKStore
            </p>
            <Button
              variant="secondary"
              onClick={() => navigate('/register')}
              className="w-full"
            >
              Đăng ký ngay
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-card p-6"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Tag className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-accent-900 mb-2">Miễn phí vận chuyển</h3>
            <p className="text-accent-600 text-sm mb-4">
              Miễn phí giao hàng cho đơn hàng từ 500.000đ
            </p>
            <Button
              variant="secondary"
              onClick={() => navigate('/products?minPrice=500000')}
              className="w-full"
            >
              Mua sắm ngay
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-card p-6"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-accent-900 mb-2">Flash Sale hàng ngày</h3>
            <p className="text-accent-600 text-sm mb-4">
              Mỗi ngày từ 10:00 - 12:00 và 20:00 - 22:00
            </p>
            <Button
              variant="secondary"
              onClick={() => navigate('/products?featured=true')}
              className="w-full"
            >
              Khám phá ngay
            </Button>
          </motion.div>
        </div>

        {/* All Sale Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-card p-8"
        >
          <h2 className="text-xl font-bold text-accent-900 mb-6">Sản phẩm giảm giá</h2>
          <p className="text-accent-600 mb-4">
            Xem tất cả sản phẩm đang được giảm giá
          </p>
          <Button onClick={() => navigate('/products?sale=true')}>
            Xem sản phẩm giảm giá
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
