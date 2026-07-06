import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
} from 'lucide-react';

// Facebook icon as SVG
const FacebookIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
import { Button, Input } from '@/components/ui';
import Swal from 'sweetalert2';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const storeInfo = {
  name: 'AKStore',
  address: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
  phone: '1900 1234',
  email: 'contact@akstore.com',
  facebook: 'https://facebook.com/akstore',
  zalo: 'https://zalo.me/akstore',
  hours: '8:00 - 21:00 (Thứ 2 - Chủ Nhật)',
};

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log('Contact form submitted:', data);
    
    Swal.fire({
      icon: 'success',
      title: 'Gửi liên hệ thành công!',
      text: 'Cảm ơn bạn đã liên hệ với AKStore. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
      confirmButtonText: 'Đóng',
      confirmButtonColor: '#D70018',
    });
    
    reset();
  };

  return (
    <div className="min-h-screen bg-accent-50 pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary to-red-700 text-white py-12">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-center"
          >
            Liên hệ AKStore
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center text-white/80 mt-2"
          >
            Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-card p-8">
              <h2 className="text-2xl font-bold text-accent-900 mb-6">Thông tin liên hệ</h2>
              
              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <MapPin className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-accent-900 mb-1">Địa chỉ cửa hàng</h3>
                    <p className="text-accent-600">{storeInfo.address}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Phone className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-accent-900 mb-1">Hotline</h3>
                    <p className="text-accent-600">{storeInfo.phone}</p>
                    <p className="text-sm text-accent-500">Hỗ trợ 24/7</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Mail className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-accent-900 mb-1">Email</h3>
                    <p className="text-accent-600">{storeInfo.email}</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Clock className="w-6 h-6 text-primary group-hover:text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-accent-900 mb-1">Giờ mở cửa</h3>
                    <p className="text-accent-600">{storeInfo.hours}</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-6 border-t border-accent-100">
                <h3 className="font-semibold text-accent-900 mb-4">Kết nối với chúng tôi</h3>
                <div className="flex gap-4">
                  <a
                    href={storeInfo.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <FacebookIcon />
                  </a>
                  <a
                    href={storeInfo.zalo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-card p-4 overflow-hidden"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4469!2d106.7033!3d10.7722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzE5LjIiTiAxMDbCsDQyJzE0LjMiRQ!5e0!3m2!1svi!2s!4v1234567890"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
                title="AKStore Location"
              />
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-card p-8"
          >
            <h2 className="text-2xl font-bold text-accent-900 mb-2">Gửi tin nhắn</h2>
            <p className="text-accent-600 mb-6">
              Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Nhập họ và tên của bạn"
                  error={errors.name?.message}
                  {...register('name', {
                    required: 'Vui lòng nhập họ và tên',
                    minLength: {
                      value: 2,
                      message: 'Họ và tên phải có ít nhất 2 ký tự',
                    },
                  })}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Vui lòng nhập email',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email không hợp lệ',
                    },
                  })}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  error={errors.phone?.message}
                  {...register('phone', {
                    required: 'Vui lòng nhập số điện thoại',
                    pattern: {
                      value: /^(0[0-9]{9,10})$/,
                      message: 'Số điện thoại không hợp lệ',
                    },
                  })}
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Nhập tiêu đề liên hệ"
                  error={errors.subject?.message}
                  {...register('subject', {
                    required: 'Vui lòng nhập tiêu đề',
                    minLength: {
                      value: 5,
                      message: 'Tiêu đề phải có ít nhất 5 ký tự',
                    },
                  })}
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-accent-700 mb-2">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Nhập nội dung tin nhắn của bạn..."
                  className="w-full px-4 py-3 border-2 border-accent-200 rounded-xl focus:border-primary focus:outline-none resize-none transition-colors"
                  {...register('message', {
                    required: 'Vui lòng nhập nội dung',
                    minLength: {
                      value: 10,
                      message: 'Nội dung phải có ít nhất 10 ký tự',
                    },
                  })}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-red-700 py-4"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                <Send className="w-5 h-5 mr-2" />
                Gửi liên hệ
              </Button>
            </form>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-white rounded-2xl shadow-card p-8"
        >
          <h2 className="text-2xl font-bold text-accent-900 mb-6 text-center">
            Câu hỏi thường gặp
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: 'Thời gian giao hàng là bao lâu?',
                a: 'Đơn hàng nội thành TP.HCM giao trong 2-4 giờ. Các tỉnh thành khác từ 1-3 ngày tùy khu vực.',
              },
              {
                q: 'Chính sách đổi trả như thế nào?',
                a: 'Đổi trả trong 7 ngày nếu sản phẩm lỗi từ nhà sản xuất. Sản phẩm còn nguyên vẹn seal và phụ kiện.',
              },
              {
                q: 'Tôi có thể thanh toán bằng cách nào?',
                a: 'Chấp nhận thanh toán COD, chuyển khoản, thẻ ATM, Visa/Mastercard và ví điện tử.',
              },
              {
                q: 'Làm sao để được hỗ trợ bảo hành?',
                a: 'Liên hệ hotline 1900 1234 hoặc mang sản phẩm đến cửa hàng gần nhất kèm hóa đơn.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-accent-50 rounded-xl p-5 hover:-translate-y-1 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-accent-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-accent-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
