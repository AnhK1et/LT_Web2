# AKStore Database Documentation

## Mục lục
1. [Giới thiệu](#giới-thiệu)
2. [Cấu trúc Database](#cấu-trúc-database)
3. [Thiết kế bảng chi tiết](#thiết-kế-bảng-chi-tiết)
4. [Quan hệ giữa các bảng](#quan-hệ-giữa-các-bảng)
5. [Index Design](#index-design)
6. [Constraints](#constraints)
7. [Soft Delete](#soft-delete)
8. [Triggers & Views](#triggers--views)
9. [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
10. [Dữ liệu mẫu](#dữ-liệu-mẫu)

---

## Giới thiệu

### Thông tin dự án
- **Tên dự án**: AKStore
- **Loại**: Website bán hàng công nghệ
- **Database Engine**: MySQL 8.0+
- **Chuẩn hóa**: 3NF (Third Normal Form)
- **Phiên bản**: 2.0 (Updated)

### Mục tiêu thiết kế
- ✅ Đáp ứng đầy đủ chức năng e-commerce cơ bản
- ✅ Tối ưu cho đồ án cá nhân
- ✅ Dễ mở rộng trong tương lai
- ✅ Không dư thừa dữ liệu
- ✅ Performance tốt với Index phù hợp
- ✅ Data Integrity với CHECK constraints
- ✅ 100% Soft Delete coverage

### Các cải tiến Version 2.0
- ✅ Thêm deleted_at cho 3 bảng còn thiếu
- ✅ Thêm UNIQUE constraint cho product_images
- ✅ Thêm 20+ CHECK constraints
- ✅ Thêm Composite Indexes
- ✅ Thêm 2 triggers mới
- ✅ Thêm 2 views mới
- ✅ Bổ sung order_details

---

## Cấu trúc Database

```
database/
├── schema.sql      # Định nghĩa cấu trúc bảng (Version 2.0)
├── seed.sql        # Dữ liệu mẫu (Version 2.0)
├── ERD.md          # Entity Relationship Diagram (Version 2.0)
└── README.md       # Tài liệu này
```

---

## Thiết kế bảng chi tiết

### Tổng quan 12 bảng

| # | Tên bảng | Chức năng | deleted_at |
|---|----------|-----------|------------|
| 1 | `roles` | Vai trò người dùng | ✅ |
| 2 | `users` | Người dùng (Admin/User) | ✅ |
| 3 | `categories` | Danh mục sản phẩm | ✅ |
| 4 | `brands` | Thương hiệu | ✅ |
| 5 | `products` | Sản phẩm | ✅ |
| 6 | `product_images` | Hình ảnh sản phẩm | ✅ |
| 7 | `carts` | Giỏ hàng | ✅ |
| 8 | `cart_items` | Chi tiết giỏ hàng | ✅ |
| 9 | `payment_methods` | Phương thức thanh toán | ✅ |
| 10 | `orders` | Đơn hàng | ✅ |
| 11 | `order_details` | Chi tiết đơn hàng | ✅ |
| 12 | `banners` | Banner trang chủ | ✅ |

---

### 1. `roles` - Vai trò người dùng

| Cột | Kiểu | NOT NULL | Mô tả |
|-----|------|----------|-------|
| id | BIGINT UNSIGNED PK | ✅ | ID vai trò |
| name | VARCHAR(50) | ✅ | Tên vai trò |
| slug | VARCHAR(50) | ✅ | Slug (admin, user) |
| description | VARCHAR(255) | | Mô tả |
| created_at | TIMESTAMP | ✅ | Ngày tạo |
| updated_at | TIMESTAMP | ✅ | Ngày cập nhật |
| deleted_at | TIMESTAMP | | Ngày xóa mềm |

**Indexes**: slug, (name, slug) UNIQUE

---

### 2. `users` - Người dùng

| Cột | Kiểu | NOT NULL | Mô tả |
|-----|------|----------|-------|
| id | BIGINT UNSIGNED PK | ✅ | ID người dùng |
| name | VARCHAR(100) | ✅ | Họ tên |
| email | VARCHAR(255) | ✅ | Email (UNIQUE) |
| password | VARCHAR(255) | ✅ | Mật khẩu (BCrypt) |
| phone | VARCHAR(20) | | SĐT |
| address | TEXT | | Địa chỉ mặc định |
| avatar | VARCHAR(500) | | Ảnh đại diện |
| role_id | BIGINT FK | ✅ | → roles(id) |
| status | ENUM | ✅ | active, inactive, banned |
| remember_token | VARCHAR(100) | | Token remember me |
| email_verified_at | TIMESTAMP | | Xác thực email |
| created_at | TIMESTAMP | ✅ | Ngày tạo |
| updated_at | TIMESTAMP | ✅ | Ngày cập nhật |
| deleted_at | TIMESTAMP | | Ngày xóa mềm |

**Indexes**: email UNIQUE, phone, role_id, status
**Foreign Key**: role_id → roles(id)

---

### 3. `categories` - Danh mục sản phẩm

| Cột | Kiểu | NOT NULL | Mô tả |
|-----|------|----------|-------|
| id | BIGINT UNSIGNED PK | ✅ | ID danh mục |
| name | VARCHAR(100) | ✅ | Tên danh mục |
| slug | VARCHAR(100) | ✅ | Slug URL (UNIQUE) |
| description | TEXT | | Mô tả |
| image | VARCHAR(500) | | Ảnh danh mục |
| parent_id | BIGINT FK | | → categories(id) - Self reference |
| display_order | INT | ✅ | Thứ tự hiển thị |
| is_featured | BOOLEAN | ✅ | Hiển thị trang chủ |
| status | ENUM | ✅ | active, inactive |
| created_at | TIMESTAMP | ✅ | Ngày tạo |
| updated_at | TIMESTAMP | ✅ | Ngày cập nhật |
| deleted_at | TIMESTAMP | | Ngày xóa mềm |

**Indexes**: slug UNIQUE, parent_id, display_order, status, is_featured
**Foreign Key**: parent_id → categories(id) ON DELETE SET NULL

---

### 4. `brands` - Thương hiệu

| Cột | Kiểu | NOT NULL | Mô tả |
|-----|------|----------|-------|
| id | BIGINT UNSIGNED PK | ✅ | ID thương hiệu |
| name | VARCHAR(100) | ✅ | Tên thương hiệu |
| slug | VARCHAR(100) | ✅ | Slug URL (UNIQUE) |
| logo | VARCHAR(500) | | Logo |
| website | VARCHAR(255) | | Website |
| country | VARCHAR(50) | | Quốc gia |
| display_order | INT | ✅ | Thứ tự hiển thị |
| is_featured | BOOLEAN | ✅ | Hiển thị trang chủ |
| status | ENUM | ✅ | active, inactive |
| created_at | TIMESTAMP | ✅ | Ngày tạo |
| updated_at | TIMESTAMP | ✅ | Ngày cập nhật |
| deleted_at | TIMESTAMP | | Ngày xóa mềm |

**Indexes**: slug UNIQUE, name, display_order, status, is_featured

---

### 5. `products` - Sản phẩm

| Cột | Kiểu | NOT NULL | CHECK | Mô tả |
|-----|------|----------|-------|-------|
| id | BIGINT UNSIGNED PK | ✅ | | ID sản phẩm |
| name | VARCHAR(255) | ✅ | | Tên sản phẩm |
| slug | VARCHAR(255) | ✅ | | Slug URL (UNIQUE) |
| sku | VARCHAR(100) | | | Mã SKU (UNIQUE) |
| price | DECIMAL(15,2) | ✅ | ✅ | Giá gốc ≥ 0 |
| sale_price | DECIMAL(15,2) | | ✅ | Giá khuyến mãi ≥ 0 |
| short_description | VARCHAR(500) | | | Mô tả ngắn |
| description | TEXT | | | Mô tả chi tiết |
| specifications | TEXT | | | Thông số kỹ thuật (JSON) |
| thumbnail | VARCHAR(500) | | | Ảnh đại diện |
| quantity | INT | ✅ | ✅ | Số lượng tồn kho ≥ 0 |
| sold_count | INT | ✅ | ✅ | Số đã bán ≥ 0 |
| view_count | INT | ✅ | ✅ | Số lượt xem ≥ 0 |
| category_id | BIGINT FK | ✅ | | → categories(id) |
| brand_id | BIGINT FK | ✅ | | → brands(id) |
| is_featured | BOOLEAN | ✅ | | Sản phẩm nổi bật |
| is_new | BOOLEAN | ✅ | | Sản phẩm mới |
| warranty_months | INT | ✅ | ✅ | Bảo hành ≥ 0 tháng |
| status | ENUM | ✅ | | active, inactive, out_of_stock |
| created_at | TIMESTAMP | ✅ | | Ngày tạo |
| updated_at | TIMESTAMP | ✅ | | Ngày cập nhật |
| deleted_at | TIMESTAMP | | | Ngày xóa mềm |

**Indexes**: 
- UNIQUE: slug, sku
- Single: name, price, sale_price, category_id, brand_id, status, is_featured, is_new, view_count, sold_count
- Composite: (category_id, brand_id), (status, category_id), (is_featured, status, price)

**Foreign Keys**: category_id → categories, brand_id → brands

---

### 6. `product_images` - Hình ảnh sản phẩm

| Cột | Kiểu | NOT NULL | Mô tả |
|-----|------|----------|-------|
| id | BIGINT UNSIGNED PK | ✅ | ID ảnh |
| product_id | BIGINT FK | ✅ | → products(id) |
| image_url | VARCHAR(500) | ✅ | Đường dẫn ảnh |
| alt_text | VARCHAR(255) | | Alt text |
| display_order | INT | ✅ | Thứ tự (0 = ảnh chính) |
| is_primary | BOOLEAN | ✅ | Là ảnh chính |
| created_at | TIMESTAMP | ✅ | Ngày tạo |
| updated_at | TIMESTAMP | ✅ | Ngày cập nhật |
| deleted_at | TIMESTAMP | | Ngày xóa mềm |

**Indexes**: product_id, display_order, **(product_id, display_order) UNIQUE**
**Foreign Key**: product_id → products(id) ON DELETE CASCADE

---

### 7. `carts` - Giỏ hàng

| Cột | Kiểu | NOT NULL | Mô tả |
|-----|------|----------|-------|
| id | BIGINT UNSIGNED PK | ✅ | ID giỏ hàng |
| user_id | BIGINT FK | ✅ | → users(id) (UNIQUE - 1 cart/user) |
| session_id | VARCHAR(100) | | Session ID (khách chưa login) |
| created_at | TIMESTAMP | ✅ | Ngày tạo |
| updated_at | TIMESTAMP | ✅ | Ngày cập nhật |
| deleted_at | TIMESTAMP | | Ngày xóa mềm |

**Indexes**: user_id UNIQUE, session_id
**Foreign Key**: user_id → users(id) ON DELETE CASCADE

---

### 8. `cart_items` - Chi tiết giỏ hàng

| Cột | Kiểu | NOT NULL | CHECK | Mô tả |
|-----|------|----------|-------|-------|
| id | BIGINT UNSIGNED PK | ✅ | | ID item |
| cart_id | BIGINT FK | ✅ | | → carts(id) |
| product_id | BIGINT FK | ✅ | | → products(id) |
| quantity | INT UNSIGNED | ✅ | ✅ | Số lượng ≥ 1 |
| price | DECIMAL(15,2) | ✅ | ✅ | Giá ≥ 0 |
| created_at | TIMESTAMP | ✅ | | Ngày tạo |
| updated_at | TIMESTAMP | ✅ | | Ngày cập nhật |
| deleted_at | TIMESTAMP | | | Ngày xóa mềm |

**Indexes**: cart_id, product_id, **(cart_id, product_id) UNIQUE**
**Foreign Keys**: cart_id → carts, product_id → products

---

### 9. `payment_methods` - Phương thức thanh toán

| Cột | Kiểu | NOT NULL | CHECK | Mô tả |
|-----|------|----------|-------|-------|
| id | BIGINT UNSIGNED PK | ✅ | | ID |
| name | VARCHAR(100) | ✅ | | Tên phương thức |
| code | VARCHAR(50) | ✅ | | Mã (cod, bank_transfer...) |
| description | TEXT | | | Mô tả |
| icon | VARCHAR(255) | | | Icon |
| instructions | TEXT | | | Hướng dẫn thanh toán |
| fee_percentage | DECIMAL(5,2) | ✅ | ✅ | Phí 0-100% |
| is_active | BOOLEAN | ✅ | | Hoạt động |
| display_order | INT | ✅ | | Thứ tự |
| created_at | TIMESTAMP | ✅ | | Ngày tạo |
| updated_at | TIMESTAMP | ✅ | | Ngày cập nhật |
| deleted_at | TIMESTAMP | | | Ngày xóa mềm |

**Indexes**: code, is_active, display_order

---

### 10. `orders` - Đơn hàng

| Cột | Kiểu | NOT NULL | CHECK | Mô tả |
|-----|------|----------|-------|-------|
| id | BIGINT UNSIGNED PK | ✅ | | ID đơn hàng |
| order_code | VARCHAR(50) | ✅ | | Mã đơn (UNIQUE) |
| user_id | BIGINT FK | | | → users(id) (nullable) |
| receiver_name | VARCHAR(100) | ✅ | | Tên người nhận |
| receiver_phone | VARCHAR(20) | ✅ | | SĐT người nhận |
| receiver_address | TEXT | ✅ | | Địa chỉ giao hàng |
| receiver_city | VARCHAR(100) | | | Thành phố |
| receiver_district | VARCHAR(100) | | | Quận/Huyện |
| note | TEXT | | | Ghi chú |
| subtotal | DECIMAL(15,2) | ✅ | ✅ | Tổng tiền hàng ≥ 0 |
| shipping_fee | DECIMAL(15,2) | ✅ | ✅ | Phí vận chuyển ≥ 0 |
| discount_amount | DECIMAL(15,2) | ✅ | ✅ | Giảm giá ≥ 0, ≤ subtotal |
| total_price | DECIMAL(15,2) | ✅ | ✅ | Tổng ≥ 0 |
| payment_method_id | BIGINT FK | ✅ | | → payment_methods(id) |
| payment_status | ENUM | ✅ | | pending, paid, failed, refunded |
| order_status | ENUM | ✅ | | pending, confirmed, processing, shipping, delivered, cancelled, returned |
| cancelled_reason | TEXT | | | Lý do hủy |
| delivered_at | TIMESTAMP | | | Thời gian giao thành công |
| created_at | TIMESTAMP | ✅ | | Ngày tạo |
| updated_at | TIMESTAMP | ✅ | | Ngày cập nhật |
| deleted_at | TIMESTAMP | | | Ngày xóa mềm |

**Indexes**: 
- UNIQUE: order_code
- Single: user_id, order_status, payment_status, payment_method_id, created_at, receiver_phone
- Composite: (user_id, order_status), (user_id, created_at)

**Foreign Keys**: user_id → users (SET NULL), payment_method_id → payment_methods

---

### 11. `order_details` - Chi tiết đơn hàng

| Cột | Kiểu | NOT NULL | CHECK | Mô tả |
|-----|------|----------|-------|-------|
| id | BIGINT UNSIGNED PK | ✅ | | ID |
| order_id | BIGINT FK | ✅ | | → orders(id) |
| product_id | BIGINT FK | ✅ | | → products(id) |
| product_name | VARCHAR(255) | ✅ | | Tên (snapshot) |
| product_sku | VARCHAR(100) | | | SKU (snapshot) |
| product_image | VARCHAR(500) | | | Ảnh (snapshot) |
| price | DECIMAL(15,2) | ✅ | ✅ | Giá ≥ 0 |
| quantity | INT UNSIGNED | ✅ | ✅ | Số lượng ≥ 1 |
| discount_amount | DECIMAL(15,2) | ✅ | ✅ | Giảm giá ≥ 0, ≤ (price*qty) |
| subtotal | DECIMAL(15,2) | ✅ | ✅ | Thành tiền ≥ 0 |
| created_at | TIMESTAMP | ✅ | | Ngày tạo |
| updated_at | TIMESTAMP | ✅ | | Ngày cập nhật |
| deleted_at | TIMESTAMP | | | Ngày xóa mềm |

**Indexes**: order_id, product_id, **(order_id, product_id)**
**Foreign Keys**: order_id → orders, product_id → products

---

### 12. `banners` - Banner trang chủ

| Cột | Kiểu | NOT NULL | Mô tả |
|-----|------|----------|-------|
| id | BIGINT UNSIGNED PK | ✅ | ID banner |
| title | VARCHAR(255) | ✅ | Tiêu đề |
| subtitle | VARCHAR(255) | | Phụ đề |
| image_url | VARCHAR(500) | ✅ | Ảnh banner |
| link | VARCHAR(500) | | Link khi click |
| link_type | ENUM | ✅ | product, category, brand, url, none |
| target_id | BIGINT UNSIGNED | | ID target |
| display_order | INT | ✅ | Thứ tự |
| status | ENUM | ✅ | active, inactive |
| start_date | TIMESTAMP | | Bắt đầu hiển thị |
| end_date | TIMESTAMP | | Kết thúc hiển thị |
| created_at | TIMESTAMP | ✅ | Ngày tạo |
| updated_at | TIMESTAMP | ✅ | Ngày cập nhật |
| deleted_at | TIMESTAMP | | Ngày xóa mềm |

**Indexes**: status, display_order, start_date, end_date

---

## Quan hệ giữa các bảng

```
roles (1) ────< (N) users
                      │
                      │ 1:1
                      ▼
                   carts (1) ────< (N) cart_items
                      ▲                  │
                      │                  │ N:1
                      │                  ▼
                      │             products (1) ────< (N) product_images
                      │
users (1) ────< (N) orders (1) ────< (N) order_details
                      │                        ▲
                      │ N:1                    │ N:1
                      ▼                        │
              payment_methods (1) < ──────────────── products

categories (1) ────< (N) products
      │
      │ 1:N (self-reference)
      ▼
categories (1)

brands (1) ────< (N) products
```

---

## Index Design

### Single Column Indexes

| Bảng | Cột | Loại | Mục đích |
|------|-----|------|----------|
| roles | slug | INDEX | Tra cứu |
| users | email | UNIQUE | Đăng nhập |
| users | phone | INDEX | Tra cứu theo SĐT |
| users | role_id | INDEX | Lọc theo vai trò |
| users | status | INDEX | Lọc trạng thái |
| categories | slug | UNIQUE | SEO URL |
| categories | parent_id | INDEX | Lọc danh mục con |
| brands | slug | UNIQUE | SEO URL |
| products | slug | UNIQUE | SEO URL |
| products | sku | UNIQUE | Tra cứu SKU |
| products | name | INDEX | Tìm kiếm |
| products | price | INDEX | Sắp xếp theo giá |
| products | sale_price | INDEX | Sắp xếp theo giá KM |
| products | category_id | INDEX | Lọc theo danh mục |
| products | brand_id | INDEX | Lọc theo thương hiệu |
| products | status | INDEX | Lọc trạng thái |
| products | is_featured | INDEX | Lọc nổi bật |
| products | is_new | INDEX | Lọc sản phẩm mới |
| products | view_count | INDEX | Sắp xếp phổ biến |
| products | sold_count | INDEX | Sắp xếp bán chạy |
| orders | order_code | UNIQUE | Tra cứu mã đơn |
| orders | user_id | INDEX | Lịch sử mua hàng |
| orders | order_status | INDEX | Lọc trạng thái |
| orders | payment_status | INDEX | Lọc thanh toán |
| orders | created_at | INDEX | Thống kê |
| orders | receiver_phone | INDEX | Tra cứu nhanh |

### Composite Indexes

| Bảng | Cột | Mục đích |
|------|-----|----------|
| products | (category_id, brand_id) | Filter sản phẩm theo danh mục + thương hiệu |
| products | (status, category_id) | Filter sản phẩm active theo danh mục |
| products | (is_featured, status, price) | Trang chủ: sản phẩm nổi bật |
| orders | (user_id, order_status) | Lọc đơn hàng theo user + status |
| orders | (user_id, created_at) | Lịch sử mua hàng theo thời gian |
| cart_items | (cart_id, product_id) | UNIQUE - Không trùng item |
| order_details | (order_id, product_id) | Tra cứu chi tiết đơn |
| product_images | (product_id, display_order) | UNIQUE - Không trùng thứ tự |

---

## Constraints

### CHECK Constraints (20+)

| Bảng | Constraint | Mô tả |
|------|------------|-------|
| products | price >= 0 | Giá không âm |
| products | sale_price >= 0 OR NULL | Giá KM không âm |
| products | quantity >= 0 | Tồn kho không âm |
| products | sold_count >= 0 | Số bán không âm |
| products | view_count >= 0 | Lượt xem không âm |
| products | warranty_months >= 0 | Bảo hành không âm |
| cart_items | quantity >= 1 | Số lượng tối thiểu 1 |
| cart_items | price >= 0 | Giá không âm |
| orders | subtotal >= 0 | Tổng phụ không âm |
| orders | shipping_fee >= 0 | Phí ship không âm |
| orders | discount_amount >= 0 | Giảm giá không âm |
| orders | discount_amount <= subtotal | Giảm giá ≤ tổng phụ |
| orders | total_price >= 0 | Tổng không âm |
| order_details | quantity >= 1 | Số lượng tối thiểu 1 |
| order_details | price >= 0 | Giá không âm |
| order_details | discount_amount >= 0 | Giảm giá không âm |
| order_details | discount_amount <= (price * quantity) | Giảm giá ≤ giá trị |
| order_details | subtotal >= 0 | Thành tiền không âm |
| payment_methods | fee_percentage >= 0 AND <= 100 | Phí 0-100% |

### UNIQUE Constraints

| Bảng | Cột | Mô tả |
|------|-----|-------|
| roles | (name, slug) | Không trùng tên + slug |
| users | email | Không trùng email |
| products | slug | SEO URL duy nhất |
| products | sku | Mã SKU duy nhất |
| categories | slug | SEO URL duy nhất |
| brands | slug | SEO URL duy nhất |
| carts | user_id | Mỗi user 1 cart |
| cart_items | (cart_id, product_id) | Không trùng sản phẩm trong cart |
| orders | order_code | Mã đơn duy nhất |
| product_images | (product_id, display_order) | Không trùng thứ tự ảnh |

---

## Soft Delete

### 100% Coverage - Tất cả 12 bảng đều có deleted_at

| Bảng | deleted_at | ON DELETE |
|------|------------|-----------|
| roles | ✅ | - |
| users | ✅ | - |
| categories | ✅ | SET NULL (parent_id) |
| brands | ✅ | - |
| products | ✅ | - |
| product_images | ✅ | CASCADE |
| carts | ✅ | CASCADE |
| cart_items | ✅ | - |
| payment_methods | ✅ | - |
| orders | ✅ | - |
| order_details | ✅ | CASCADE |
| banners | ✅ | - |

### Lợi ích của Soft Delete
- Không mất dữ liệu khi xóa
- Dễ dàng khôi phục dữ liệu
- Bảo toàn lịch sử đơn hàng
- Tuân thủ quy định về lưu trữ dữ liệu

---

## Triggers & Views

### Triggers (3)

| Trigger | Thời điểm | Chức năng |
|---------|-----------|-----------|
| tr_after_user_insert | AFTER INSERT users | Tự động tạo cart cho user mới |
| tr_after_order_detail_insert | AFTER INSERT order_details | Cập nhật sold_count khi có đơn |
| tr_after_order_confirmed | AFTER UPDATE orders | Giảm quantity khi đơn xác nhận |

### Views (5)

| View | Mục đích |
|------|----------|
| v_products_full | Sản phẩm với category & brand info |
| v_orders_full | Đơn hàng với customer info |
| v_revenue_stats | Thống kê doanh thu theo ngày |
| v_top_selling_products | Top 20 sản phẩm bán chạy |
| v_orders_by_status | Thống kê đơn hàng theo trạng thái |

---

## Hướng dẫn sử dụng

### 1. Tạo Database

```bash
mysql -u root -p < database/schema.sql
```

### 2. Import dữ liệu mẫu

```bash
mysql -u root -p < database/seed.sql
```

### 3. Kiểm tra Database

```sql
USE akstore;

-- Kiểm tra các bảng
SHOW TABLES;

-- Kiểm tra số lượng records
SELECT 'roles' AS tbl, COUNT(*) AS cnt FROM roles
UNION ALL SELECT 'users', COUNT(*) FROM users
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'orders', COUNT(*) FROM orders;

-- Kiểm tra Views
SELECT * FROM v_revenue_stats;
SELECT * FROM v_top_selling_products;
```

---

## Dữ liệu mẫu

### Thống kê

| Dữ liệu | Số lượng |
|----------|----------|
| Roles | 2 |
| Users | 5 |
| Categories | 10 |
| Brands | 15 |
| Products | 50 |
| Product Images | 12+ |
| Payment Methods | 2 |
| Orders | 25 |
| Order Details | 35+ |
| Banners | 10 |
| Cart Items | 10+ |

### Sản phẩm mẫu tiêu biểu

| SKU | Tên sản phẩm | Giá gốc | Giá KM |
|-----|--------------|---------|--------|
| IP16PM256 | iPhone 16 Pro Max 256GB | 34,990,000đ | 32,990,000đ |
| MBA-M4-13 | MacBook Air M4 13 inch | 27,990,000đ | - |
| SGS25U256 | Samsung Galaxy S25 Ultra | 32,990,000đ | - |
| APP2 | AirPods Pro 2 | 7,990,000đ | - |
| LGMXM3S | Logitech MX Master 3S | 3,290,000đ | - |

### Tài khoản mẫu

| Email | Password | Role |
|-------|----------|------|
| admin@akstore.vn | admin123 | Admin |
| binh.tran@example.com | user123 | User |
| cuong.le@example.com | user123 | User |

---

## Các bảng đã lược bỏ

Vì đây là đồ án cá nhân, các bảng sau được lược bỏ để giữ database gọn gàng:

| Bảng | Lý do |
|------|-------|
| ~~shipping_methods~~ | Dùng địa chỉ giao hàng trong orders |
| ~~wishlists~~ | Có thể thêm sau |
| ~~reviews~~ | Có thể thêm sau |
| ~~coupons~~ | Có thể thêm sau |
| ~~inventory_transactions~~ | Quản lý đơn giản với quantity |

---

## Có thể mở rộng

Trong tương lai, có thể thêm các bảng sau:

| Bảng | Mục đích | Độ ưu tiên |
|------|----------|------------|
| wishlists | Sản phẩm yêu thích | Thấp |
| reviews | Đánh giá sản phẩm | Trung bình |
| coupons | Mã giảm giá | Trung bình |
| addresses | Nhiều địa chỉ giao hàng | Trung bình |
| notifications | Thông báo | Thấp |
| product_attributes | Thuộc tính (màu sắc, dung lượng) | Cao |

---

## Checklist - Sẵn sàng cho Backend?

- [x] Đầy đủ 12 bảng cần thiết
- [x] Tất cả Foreign Keys đúng
- [x] 100% Soft Delete coverage
- [x] Đầy đủ Indexes (single + composite)
- [x] 20+ CHECK constraints
- [x] 3 Triggers tự động
- [x] 5 Views cho dashboard
- [x] Dữ liệu seed đầy đủ
- [x] Chuẩn hóa 3NF
- [x] Không dư thừa dữ liệu

**✅ Database đã sẵn sàng 100% cho Spring Boot Backend!**

---

## Liên hệ

- **Email**: admin@akstore.vn
- **Website**: https://akstore.vn

---

**© 2026 AKStore - Database Version 2.0**
