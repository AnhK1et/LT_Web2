import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Calendar } from 'lucide-react';
import type { User as UserType } from '@/types';

interface ProfileCardProps {
  user: UserType;
  className?: string;
}

export const ProfileCard = ({ user, className }: ProfileCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-card p-6 ${className || ''}`}
    >
      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-accent-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center border-4 border-accent-100">
              <span className="text-3xl font-bold text-white">
                {(user.name || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <h2 className="mt-4 text-xl font-bold text-accent-900">{user.name}</h2>
        <span className="mt-1 px-3 py-1 bg-primary-50 text-primary text-sm rounded-full">
          {user.role?.name === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
        </span>
      </div>

      {/* Info */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-accent-50 rounded-lg">
          <div className="p-2 bg-white rounded-lg">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-accent-500">Họ tên</p>
            <p className="font-medium text-accent-900">{user.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-accent-50 rounded-lg">
          <div className="p-2 bg-white rounded-lg">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-accent-500">Email</p>
            <p className="font-medium text-accent-900">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-accent-50 rounded-lg">
          <div className="p-2 bg-white rounded-lg">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-accent-500">Số điện thoại</p>
            <p className="font-medium text-accent-900">{user.phone || 'Chưa cập nhật'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-accent-50 rounded-lg">
          <div className="p-2 bg-white rounded-lg">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-accent-500">Vai trò</p>
            <p className="font-medium text-accent-900">
              {user.role?.name === 'ADMIN' ? 'Quản trị viên' : 'Khách hàng'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-accent-50 rounded-lg">
          <div className="p-2 bg-white rounded-lg">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-accent-500">Ngày tham gia</p>
            <p className="font-medium text-accent-900">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
