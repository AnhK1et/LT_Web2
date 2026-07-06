import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Eye,
  Rocket,
  BadgeCheck,
  Shield,
  BadgeDollarSign,
  Headphones,
  CheckCircle2,
  Truck,
  RefreshCw,
  Award,
  Star,
  Smartphone,
  Monitor,
  Watch,
} from 'lucide-react';
import { Button } from '@/components/ui';

const stats = [
  { value: 50000, suffix: '+', label: 'Khách hàng', icon: Star },
  { value: 5000, suffix: '+', label: 'Đơn hàng', icon: Smartphone },
  { value: 100, suffix: '+', label: 'Sản phẩm', icon: Monitor },
  { value: 50, suffix: '+', label: 'Thương hiệu', icon: Watch },
];

const coreValues = [
  {
    icon: BadgeCheck,
    title: 'Chính hãng',
    description: '100% sản phẩm chính hãng từ nhà sản xuất',
    color: 'text-green-600 bg-green-100',
  },
  {
    icon: Shield,
    title: 'Uy tín',
    description: 'Hơn 5 năm kinh nghiệm trong ngành công nghệ',
    color: 'text-blue-600 bg-blue-100',
  },
  {
    icon: BadgeDollarSign,
    title: 'Giá tốt',
    description: 'Cam kết giá cạnh tranh nhất thị trường',
    color: 'text-orange-600 bg-orange-100',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    description: 'Đội ngũ tư vấn nhiệt tình mọi lúc',
    color: 'text-purple-600 bg-purple-100',
  },
];

const whyChoose = [
  'Sản phẩm chính hãng 100%',
  'Bảo hành chính hãng lên đến 24 tháng',
  'Đổi trả trong 7 ngày nếu lỗi',
  'Giao hàng nhanh trong 24h',
  'Thanh toán an toàn, đa dạng',
  'Tư vấn viên chuyên nghiệp',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-accent-50 pb-16">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary to-red-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border-4 border-white rounded-full" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <span className="text-primary font-bold text-3xl">AK</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Về AKStore</h1>
            <p className="text-xl text-white/90 mb-8">
              Hệ thống bán lẻ thiết bị công nghệ hàng đầu Việt Nam
            </p>
            <Button
              onClick={() => navigate('/products')}
              className="bg-white text-primary hover:bg-white/90 px-8 py-3"
              size="lg"
            >
              Khám phá sản phẩm
            </Button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-card p-8 md:p-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-accent-900 mb-6 text-center">
              Giới thiệu về AKStore
            </h2>
            <div className="prose prose-accent max-w-none space-y-4 text-accent-600">
              <p>
                <strong className="text-accent-900">AKStore</strong> là hệ thống bán lẻ thiết bị công nghệ hàng đầu 
                Việt Nam, chuyên cung cấp các sản phẩm chính hãng với giá cả cạnh tranh nhất thị trường. 
                Với hơn 5 năm kinh nghiệm, chúng tôi tự hào phục vụ hơn 50.000 khách hàng trên toàn quốc.
              </p>
              <p>
                Thành lập với sứ mệnh mang đến cho người tiêu dùng Việt Nam những sản phẩm công nghệ 
                chính hãng với mức giá hợp lý nhất, AKStore đã và đang không ngừng phát triển để trở 
                thành điểm đến tin cậy cho mọi tín đồ công nghệ.
              </p>
              <p>
                Chúng tôi chuyên cung cấp đa dạng các sản phẩm từ những thương hiệu lớn trên thế giới:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                {['iPhone & iPad', 'Samsung Galaxy', 'Xiaomi & Redmi', 'Laptop Gaming'].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-accent-50 rounded-xl p-4 text-center hover:bg-primary/5 transition-colors"
                  >
                    <span className="font-medium text-accent-900">{item}</span>
                  </motion.div>
                ))}
              </div>
              <p>
                Ngoài ra, AKStore còn cung cấp đầy đủ các phụ kiện chính hãng như: tai nghe, sạc dự phòng, 
                ốp lưng, dán màn hình, đồng hồ thông minh và nhiều phụ kiện công nghệ khác.
              </p>
              <p>
                Với đội ngũ nhân viên tư vấn chuyên nghiệp, hệ thống cửa hàng hiện đại và dịch vụ hậu 
                mãi tận tâm, AKStore cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-card p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-accent-900 mb-4">Tầm nhìn</h3>
              <p className="text-accent-600 leading-relaxed">
                Trở thành hệ thống bán lẻ công nghệ hàng đầu Việt Nam, nơi mà khách hàng có thể 
                tìm thấy mọi sản phẩm công nghệ chính hãng với mức giá tốt nhất và dịch vụ hậu mãi 
                xuất sắc nhất. Chúng tôi hướng đến việc ứng dụng công nghệ hiện đại để nâng cao 
                trải nghiệm mua sắm của khách hàng.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-card p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-accent-900 mb-4">Sứ mệnh</h3>
              <p className="text-accent-600 leading-relaxed">
                AKStore ra đời với sứ mệnh đơn giản hóa việc tiếp cận công nghệ cho người Việt. 
                Chúng tôi cam kết mang đến những sản phẩm chất lượng cao với mức giá hợp lý, 
                giúp mọi người đều có thể sở hữu thiết bị công nghệ hiện đại để phục vụ công 
                việc và giải trí.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-accent-900 mb-4">Giá trị cốt lõi</h2>
            <p className="text-accent-600 max-w-2xl mx-auto">
              Những giá trị mà AKStore luôn theo đuổi và là kim chỉ nam cho mọi hoạt động
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {coreValues.map((value) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                className="bg-accent-50 rounded-2xl p-6 text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-accent-900 mb-2">{value.title}</h3>
                <p className="text-sm text-accent-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-16 bg-gradient-to-r from-primary to-red-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur">
                  <stat.icon className="w-8 h-8" />
                </div>
                <p className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.value.toLocaleString()}{stat.suffix}
                </p>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-card overflow-hidden"
          >
            <div className="grid md:grid-cols-2">
              {/* Content */}
              <div className="p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-accent-900 mb-6">
                  Vì sao chọn AKStore?
                </h2>
                <div className="space-y-4">
                  {whyChoose.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-accent-700">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Illustration */}
              <div className="bg-gradient-to-br from-primary/5 to-red-50 p-8 md:p-12 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="w-48 h-48 bg-primary rounded-3xl flex items-center justify-center">
                    <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center">
                      <span className="text-primary font-bold text-6xl">AK</span>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center">
                    <Truck className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-accent-900 to-gray-800 rounded-2xl p-12 text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Sẵn sàng trải nghiệm?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Khám phá hàng ngàn sản phẩm công nghệ chính hãng với mức giá hấp dẫn nhất tại AKStore ngay hôm nay!
            </p>
            <Button
              onClick={() => navigate('/products')}
              className="bg-primary hover:bg-red-700 text-white px-8 py-3 text-lg"
              size="lg"
            >
              Khám phá ngay
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
