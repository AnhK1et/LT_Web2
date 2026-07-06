# AKStore Database - ERD (Entity Relationship Diagram)

## Phiên bản: 2.0 (Updated)

---

## Tổng quan Database

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    AKStore Database Architecture                              │
│                                         3NF Normalized                                            │
│                                   Version 2.0 - Full Features                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Sơ đồ Entity Relationship

```
┌─────────────────┐         ┌─────────────────┐
│     roles       │         │     users       │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄───────┐│ id (PK)         │
│ name            │  1:N   ││ name            │
│ slug            │        ││ email (UNIQUE)  │
│ description     │        ││ password        │
│ created_at      │        ││ phone           │
│ updated_at      │        ││ address         │
│ deleted_at      │        ││ avatar          │
└─────────────────┘        ││ role_id (FK)   │──────────┐
                           ││ status         │          │
                           ││ created_at      │          │
                           ││ updated_at      │          │
                           ││ deleted_at      │          │
                           └─────────────────┘          │
                                │                       │
                                │ 1:1                   │
                                ▼                       │
┌─────────────────┐         ┌─────────────────┐        │
│     carts       │         │     orders      │        │
├─────────────────┤         ├─────────────────┤        │
│ id (PK)         │         │ id (PK)         │        │
│ user_id (FK)    │────────►│ order_code (UNIQUE)│    │
│ session_id      │   1:N   │ user_id (FK)    │◄───────┘
│ created_at      │         │ receiver_name   │   1:N
│ updated_at      │         │ receiver_phone  │
│ deleted_at      │         │ receiver_address│
└─────────────────┘         │ receiver_city   │
        │                   │ receiver_district│
        │ 1:N               │ note            │
        ▼                   │ subtotal        │
┌─────────────────┐         │ shipping_fee    │
│   cart_items    │         │ discount_amount │
├─────────────────┤         │ total_price     │
│ id (PK)         │         │ payment_method  │────────┐│
│ cart_id (FK)    │────────►│ _id (FK)              ││
│ product_id(FK)  │◄────────┤ payment_status │        ││
│ quantity        │   N:1   │ order_status    │        ││
│ price           │         │ created_at      │        ││
│ created_at      │         │ updated_at      │        ││
│ updated_at      │         │ deleted_at      │        ││
│ deleted_at      │         └─────────────────┘        │
└─────────────────┘                │                   │
        ▲                          │ 1:N               │
        │ N:1                      ▼                   │
┌─────────────────┐         ┌─────────────────┐        │
│    products     │         │  order_details  │        │
├─────────────────┤         ├─────────────────┤        │
│ id (PK)         │         │ id (PK)         │        │
│ name            │         │ order_id (FK)   │────────┘
│ slug (UNIQUE)   │         │ product_id(FK)  │◄────────┐
│ sku (UNIQUE)    │   N:1   │ product_name   │        │
│ price           │         │ price           │        │
│ sale_price      │         │ quantity        │        │
│ short_desc      │         │ discount_amount │        │
│ description     │         │ subtotal        │        │
│ thumbnail       │         │ created_at      │        │
│ quantity        │         │ updated_at      │        │
│ sold_count      │         │ deleted_at      │        │
│ view_count      │         └─────────────────┘        │
│ category_id(FK) │◄──────────────────────────────────┘
│ brand_id (FK)  │◄────────┐                          │
│ is_featured     │         │                          │
│ is_new          │         │                          │
│ warranty_months │         │                          │
│ status          │         │                          │
│ created_at      │         │                          │
│ updated_at      │         │                          │
│ deleted_at      │         │                          │
└─────────────────┘         │                          │
        │                   │                          │
        │ 1:N               │                          │
        ▼                   │                          │
┌─────────────────┐         │                          │
│ product_images  │         │                          │
├─────────────────┤         │                          │
│ id (PK)         │         │                          │
│ product_id(FK)  │─────────┘                          │
│ image_url       │                                    │
│ alt_text        │                                    │
│ display_order   │                                    │
│ is_primary      │                                    │
│ created_at      │                                    │
│ updated_at      │                                    │
│ deleted_at      │                                    │
└─────────────────┘                                    │


┌─────────────────┐         ┌─────────────────┐
│   categories    │         │    brands       │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │         │ id (PK)         │
│ name            │◄────────┤ name            │
│ slug (UNIQUE)   │   1:N   │ slug (UNIQUE)   │
│ description     │         │ logo            │
│ image           │         │ website         │
│ parent_id (FK)  │────────►│ country         │
│ display_order   │ (self)  │ display_order   │
│ is_featured     │         │ is_featured     │
│ status          │         │ status          │
│ created_at      │         │ created_at      │
│ updated_at      │         │ updated_at      │
│ deleted_at      │         │ deleted_at      │
└─────────────────┘         └─────────────────┘


┌─────────────────┐
│payment_methods  │
├─────────────────┤
│ id (PK)         │
│ name            │◄────────────────────────────────────────┘
│ code            │  (1:N với orders)
│ icon            │
│ fee_percentage  │
│ is_active       │
│ display_order   │
│ created_at      │
│ updated_at      │
│ deleted_at      │
└─────────────────┘


┌─────────────────┐
│    banners      │
├─────────────────┤
│ id (PK)         │
│ title           │
│ subtitle        │
│ image_url       │
│ link            │
│ link_type       │
│ target_id       │
│ display_order   │
│ status          │
│ start_date      │
│ end_date        │
│ created_at      │
│ updated_at      │
│ deleted_at      │
└─────────────────┘
```

---

## Chi tiết Relationship

```
┌──────────────┬─────────────────────┬─────────────────────┬──────────────────────────────────┐
│ Parent       │ Child               │ Type                │ Notes                             │
├──────────────┼─────────────────────┼─────────────────────┼──────────────────────────────────┤
│ roles        │ users               │ 1:N                 │ User có 1 role                   │
├──────────────┼─────────────────────┼─────────────────────┼──────────────────────────────────┤
│ users        │ carts               │ 1:1                 │ Mỗi user có 1 cart              │
├──────────────┼─────────────────────┼─────────────────────┼──────────────────────────────────┤
│ users        │ orders              │ 1:N                 │ User có nhiều orders            │
├──────────────┼─────────────────────┼─────────────────────┼──────────────────────────────────┤
│ carts        │ cart_items          │ 1:N                 │ Cart có nhiều items             │
├──────────────┼─────────────────────┼─────────────────────┼──────────────────────────────────┤
│ products     │ cart_items          │ 1:N                 │ Product trong nhiều carts        │
├──────────────┼─────────────────────┼─────────────────────┼──────────────────────────────────┤
│ orders       │ order_details       │ 1:N                 │ Order có nhiều items             │
├──────────────┼─────────────────────┼─────────────────────┼──────────────────────────────────┤
│ products     │ order_details       │ 1:N                 │ Product trong nhiều orders       │
├──────────────┼─────────────────────┼─────────────────────┼──────────────────────────────────┤
│ categories   │ products            │ 1:N                 │ Category có nhiều products      │
├──────────────┼─────────────────────┼─────────────────────┼──────────────────────────────────┤
│ brands       │ products            │ 1:N                 │ Brand có nhiều products         │
├──────────────┼─────────────────────┼─────────────────────┼──────────────────────────────────┤
│ products     │ product_images       │ 1:N                 │ Product có nhiều images          │
├──────────────┼─────────────────────┼─────────────────────┼──────────────────────────────────┤
│ categories   │ categories (self)    │ 1:N                 │ Danh mục cha/con                │
├──────────────┼─────────────────────┼─────────────────────┼──────────────────────────────────┤
│ payment_methods│ orders             │ 1:N                 │ Payment cho nhiều orders        │
└──────────────┴─────────────────────┴─────────────────────┴──────────────────────────────────┘
```

---

## Composite Indexes (Version 2.0)

```
┌─────────────────┬────────────────────────────────────────────────────────┐
│ Bảng            │ Composite Indexes                                      │
├─────────────────┼────────────────────────────────────────────────────────┤
│ products        │ (category_id, brand_id)                                 │
│                 │ (status, category_id)                                  │
│                 │ (is_featured, status, price)                           │
├─────────────────┼────────────────────────────────────────────────────────┤
│ orders          │ (user_id, order_status)                                │
│                 │ (user_id, created_at)                                  │
├─────────────────┼────────────────────────────────────────────────────────┤
│ cart_items      │ (cart_id, product_id) - UNIQUE                         │
├─────────────────┼────────────────────────────────────────────────────────┤
│ order_details   │ (order_id, product_id)                                 │
├─────────────────┼────────────────────────────────────────────────────────┤
│ product_images  │ (product_id, display_order) - UNIQUE                    │
└─────────────────┴────────────────────────────────────────────────────────┘
```

---

## CHECK Constraints (Version 2.0)

```
┌─────────────────┬────────────────────────────────────────────────────────┐
│ Bảng            │ CHECK Constraints                                      │
├─────────────────┼────────────────────────────────────────────────────────┤
│ products        │ price >= 0                                            │
│                 │ sale_price >= 0 (hoặc NULL)                           │
│                 │ quantity >= 0                                          │
│                 │ sold_count >= 0                                       │
│                 │ view_count >= 0                                       │
│                 │ warranty_months >= 0                                  │
├─────────────────┼────────────────────────────────────────────────────────┤
│ cart_items      │ quantity >= 1                                          │
│                 │ price >= 0                                             │
├─────────────────┼────────────────────────────────────────────────────────┤
│ orders          │ subtotal >= 0                                          │
│                 │ shipping_fee >= 0                                      │
│                 │ discount_amount >= 0                                    │
│                 │ discount_amount <= subtotal                            │
│                 │ total_price >= 0                                       │
├─────────────────┼────────────────────────────────────────────────────────┤
│ order_details   │ quantity >= 1                                          │
│                 │ price >= 0                                             │
│                 │ discount_amount >= 0                                    │
│                 │ discount_amount <= (price * quantity)                  │
│                 │ subtotal >= 0                                          │
├─────────────────┼────────────────────────────────────────────────────────┤
│ payment_methods │ fee_percentage >= 0 AND <= 100                         │
└─────────────────┴────────────────────────────────────────────────────────┘
```

---

## Soft Delete Coverage (Version 2.0)

```
┌─────────────────┬──────────────┬──────────────────────────────────────────┐
│ Bảng            │ deleted_at   │ Ghi chú                                  │
├─────────────────┼──────────────┼──────────────────────────────────────────┤
│ roles           │ ✅ Có        │ Xóa mềm vai trò                          │
│ users           │ ✅ Có        │ Xóa mềm người dùng                      │
│ categories      │ ✅ Có        │ Xóa mềm danh mục                        │
│ brands          │ ✅ Có        │ Xóa mềm thương hiệu                     │
│ products        │ ✅ Có        │ Xóa mềm sản phẩm                        │
│ product_images  │ ✅ Có (NEW) │ Xóa mềm ảnh sản phẩm                   │
│ carts           │ ✅ Có        │ Xóa mềm giỏ hàng                        │
│ cart_items      │ ✅ Có (NEW) │ Xóa mềm items giỏ hàng                  │
│ payment_methods │ ✅ Có        │ Xóa mềm phương thức TT                   │
│ orders          │ ✅ Có        │ Xóa mềm đơn hàng                        │
│ order_details   │ ✅ Có (NEW) │ Xóa mềm chi tiết đơn hàng               │
│ banners         │ ✅ Có        │ Xóa mềm banner                          │
├─────────────────┼──────────────┼──────────────────────────────────────────┤
│ TỔNG           │ 12/12 ✅     │ 100% Soft Delete                          │
└─────────────────┴──────────────┴──────────────────────────────────────────┘
```

---

## Triggers (Version 2.0)

```
┌─────────────────────────────────┬──────────────────────────────────────────────┐
│ Trigger                          │ Chức năng                                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ tr_after_user_insert            │ Tự động tạo cart khi tạo user mới          │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ tr_after_order_detail_insert    │ Cập nhật sold_count khi có đơn hàng mới    │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ tr_after_order_confirmed        │ Giảm quantity khi đơn hàng được xác nhận    │
└─────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## Views cho Dashboard (Version 2.0)

```
┌─────────────────────────────────┬──────────────────────────────────────────────┐
│ View                             │ Mục đích                                    │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ v_products_full                 │ Sản phẩm với category & brand info          │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ v_orders_full                   │ Đơn hàng với customer info                  │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ v_revenue_stats                 │ Thống kê doanh thu theo ngày                │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ v_top_selling_products          │ Top 20 sản phẩm bán chạy                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ v_orders_by_status              │ Thống kê đơn hàng theo trạng thái          │
└─────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## Điểm khác biệt Version 2.0 vs Version 1.0

| Tính năng | Version 1.0 | Version 2.0 |
|------------|-------------|-------------|
| deleted_at coverage | 9/12 bảng | 12/12 bảng ✅ |
| UNIQUE constraints | Thiếu 1 | Đầy đủ ✅ |
| CHECK constraints | Không có | 20+ CHECKs ✅ |
| Composite Indexes | Cơ bản | Đầy đủ ✅ |
| Triggers | 1 | 3 ✅ |
| Views | 3 | 5 ✅ |
| Order Details | 25 items | 35+ items ✅ |

---

## Ưu tiên thiết kế cho đồ án cá nhân

### ✅ Đã bao gồm đầy đủ:
- Đầy đủ chức năng CRUD sản phẩm
- Giỏ hàng (1 cart mỗi user)
- Đặt hàng với chi tiết
- Phân quyền Admin/User
- Banner trang chủ
- Thanh toán (COD)
- Dashboard thống kê
- Soft Delete 100%

### ❌ Đã lược bỏ (có thể thêm sau):
- ~~Bảng `shipping_methods`~~ - Dùng địa chỉ giao hàng trong orders
- ~~Bảng `wishlists`~~ - Không cần thiết cho MVP
- ~~Bảng `reviews/ratings`~~ - Có thể thêm sau
- ~~Bảng `coupons`~~ - Có thể thêm sau
