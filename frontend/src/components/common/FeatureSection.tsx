import { motion } from 'framer-motion';
import { Shield, Truck, Headphones, BadgeCheck } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Sản phẩm chính hãng',
    description: '100% sản phẩm chính hãng từ các nhà sản xuất uy tín',
  },
  {
    icon: BadgeCheck,
    title: 'Bảo hành dài hạn',
    description: 'Bảo hành chính hãng lên đến 24 tháng',
  },
  {
    icon: Truck,
    title: 'Giao hàng nhanh',
    description: 'Giao hàng trong 24h tại các thành phố lớn',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    description: 'Đội ngũ hỗ trợ luôn sẵn sàng giải đáp',
  },
];

export const FeatureSection = () => {
  return (
    <section className="py-12 bg-accent-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-accent-900 mb-3">
            Tại sao chọn AKStore?
          </h2>
          <p className="text-accent-500">
            Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho bạn
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 text-center shadow-card hover:shadow-card-hover transition-shadow"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-accent-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-accent-500">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
