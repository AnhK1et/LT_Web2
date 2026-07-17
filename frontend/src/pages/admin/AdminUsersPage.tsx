import { useState, useMemo } from 'react';
import { AdminTable } from '@/components/admin';
import { Button, Input } from '@/components/ui';
import { useAdminUsers, useUpdateUserStatus } from '@/hooks/useAdmin';
import type { User } from '@/types';

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | undefined>();

  const queryParams = useMemo(() => ({
    page: page - 1,
    size: 10,
    keyword: searchKeyword,
    role: roleFilter,
  }), [page, searchKeyword, roleFilter]);

  const { users, totalPages, totalElements, isLoading, refetch } = useAdminUsers(queryParams);

  const updateStatusMutation = useUpdateUserStatus();

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await updateStatusMutation.mutateAsync({ id: user.id, status: newStatus });
    refetch();
  };

  const columns = [
    {
      key: 'avatar',
      label: 'Avatar',
      render: (item: User) => (
        item.avatar ? (
          <img
            src={item.avatar}
            alt={item.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            {item.name.charAt(0).toUpperCase()}
          </div>
        )
      ),
      className: 'w-12',
    },
    {
      key: 'name',
      label: 'Tên',
      render: (item: User) => (
        <div>
          <p className="font-medium text-accent-900">{item.name}</p>
          <p className="text-xs text-accent-500">{item.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'SĐT',
      render: (item: User) => item.phone || '-',
    },
    {
      key: 'role',
      label: 'Vai trò',
      render: (item: User) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            item.role?.name === 'ADMIN'
              ? 'bg-purple-100 text-purple-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {item.role?.name === 'ADMIN' ? 'Quản trị' : 'Khách hàng'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (item: User) => (
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            item.status === 'ACTIVE'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {item.status === 'ACTIVE' ? 'Hoạt động' : 'Khóa'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Ngày tạo',
      render: (item: User) => (
        <span className="text-sm text-accent-600">
          {new Date(item.createdAt).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (item: User) => (
        <button
          onClick={() => handleToggleStatus(item)}
          disabled={updateStatusMutation.isPending}
          className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
            item.status === 'ACTIVE'
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {item.status === 'ACTIVE' ? 'Khóa' : 'Mở khóa'}
        </button>
      ),
      className: 'text-right',
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-accent-900">Người dùng</h1>
            <p className="text-accent-500 mt-1">Quản lý tài khoản người dùng ({totalElements} người dùng)</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-card p-4 flex flex-wrap gap-4">
          <Input
            placeholder="Tìm kiếm người dùng..."
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-64"
          />
          <select
            value={roleFilter || ''}
            onChange={(e) => {
              setRoleFilter(e.target.value || undefined);
              setPage(1);
            }}
            className="px-4 py-2 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tất cả vai trò</option>
            <option value="CUSTOMER">Khách hàng</option>
            <option value="ADMIN">Quản trị</option>
          </select>
        </div>

        {/* Table */}
        <AdminTable
          columns={columns}
          data={users}
          loading={isLoading}
          emptyText="Không có người dùng nào"
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  page === i + 1
                    ? 'bg-primary text-white'
                    : 'bg-white text-accent-600 hover:bg-accent-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
