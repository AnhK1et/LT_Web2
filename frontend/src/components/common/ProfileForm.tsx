import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User as UserIcon, Phone, MapPin } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { useAuthStore } from '@/store';
import type { User as UserType } from '@/types';
import Swal from 'sweetalert2';

interface ProfileFormData {
  name: string;
  phone: string;
  address: string;
}

interface ProfileFormProps {
  onSuccess?: () => void;
}

export const ProfileForm = ({ onSuccess }: ProfileFormProps) => {
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    // TODO: Call API to update profile if backend supports
    // For now, just show success
    Swal.fire({
      icon: 'success',
      title: 'Cập nhật thành công!',
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: 'top-end',
    });

    onSuccess?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-card p-6"
    >
        <h2 className="text-lg font-bold text-accent-900 mb-6 flex items-center gap-2">
        <UserIcon className="w-5 h-5 text-primary" />
        Thông tin cá nhân
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Họ và tên"
          placeholder="Nhập họ và tên"
          error={errors.name?.message}
          {...register('name', {
            required: 'Họ và tên là bắt buộc',
            minLength: {
              value: 2,
              message: 'Họ và tên phải có ít nhất 2 ký tự',
            },
          })}
        />

        <Input
          label="Số điện thoại"
          type="tel"
          placeholder="Nhập số điện thoại"
          error={errors.phone?.message}
          {...register('phone', {
            pattern: {
              value: /^(0[0-9]{9,10})$/,
              message: 'Số điện thoại không hợp lệ',
            },
          })}
        />

        <div>
          <label className="block text-sm font-medium text-accent-700 mb-1 flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Địa chỉ
          </label>
          <textarea
            rows={3}
            placeholder="Nhập địa chỉ của bạn"
            className="w-full px-4 py-3 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
            {...register('address')}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={!isDirty}
            className="flex-1"
          >
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
