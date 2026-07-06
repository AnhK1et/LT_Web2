-- =====================================================
-- AKStore Database Schema
-- Database: akstore
-- Engine: MySQL 8.0+
-- Normalization: 3NF
-- Version: 2.0 (Updated)
-- =====================================================

-- Xóa database cũ nếu tồn tại
DROP DATABASE IF EXISTS akstore;

-- Tạo database mới
CREATE DATABASE akstore
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE akstore;

-- =====================================================
-- BẢNG 1: ROLES - Quản lý phân quyền
-- =====================================================

CREATE TABLE roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID vai trò',
    name VARCHAR(50) NOT NULL COMMENT 'Tên vai trò (Admin, User, Staff...)',
    slug VARCHAR(50) NOT NULL COMMENT 'Slug vai trò (admin, user, staff...)',
    description VARCHAR(255) NULL COMMENT 'Mô tả vai trò',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật',
    deleted_at TIMESTAMP NULL COMMENT 'Ngày xóa mềm',
    
    INDEX idx_roles_slug (slug),
    UNIQUE INDEX idx_roles_name_slug (name, slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng vai trò người dùng';

-- =====================================================
-- BẢNG 2: USERS - Quản lý người dùng
-- =====================================================

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID người dùng',
    name VARCHAR(100) NOT NULL COMMENT 'Họ và tên',
    email VARCHAR(255) NOT NULL COMMENT 'Email đăng nhập',
    password VARCHAR(255) NOT NULL COMMENT 'Mật khẩu (đã mã hóa)',
    phone VARCHAR(20) NULL COMMENT 'Số điện thoại',
    address TEXT NULL COMMENT 'Địa chỉ mặc định',
    avatar VARCHAR(500) NULL COMMENT 'Đường dẫn ảnh đại diện',
    role_id BIGINT UNSIGNED NOT NULL COMMENT 'ID vai trò',
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active' COMMENT 'Trạng thái tài khoản',
    remember_token VARCHAR(100) NULL COMMENT 'Token remember me',
    email_verified_at TIMESTAMP NULL COMMENT 'Thời gian xác thực email',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật',
    deleted_at TIMESTAMP NULL COMMENT 'Ngày xóa mềm',
    
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    
    INDEX idx_users_email (email),
    INDEX idx_users_phone (phone),
    INDEX idx_users_role (role_id),
    INDEX idx_users_status (status),
    
    UNIQUE INDEX idx_users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng người dùng (Admin/User)';

-- =====================================================
-- BẢNG 3: CATEGORIES - Quản lý danh mục sản phẩm
-- =====================================================

CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID danh mục',
    name VARCHAR(100) NOT NULL COMMENT 'Tên danh mục',
    slug VARCHAR(100) NOT NULL COMMENT 'Slug URL thân thiện',
    description TEXT NULL COMMENT 'Mô tả danh mục',
    image VARCHAR(500) NULL COMMENT 'Đường dẫn ảnh danh mục',
    parent_id BIGINT UNSIGNED NULL COMMENT 'ID danh mục cha (null = root)',
    display_order INT DEFAULT 0 COMMENT 'Thứ tự hiển thị',
    is_featured BOOLEAN DEFAULT FALSE COMMENT 'Hiển thị trang chủ',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT 'Trạng thái',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật',
    deleted_at TIMESTAMP NULL COMMENT 'Ngày xóa mềm',
    
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_parent (parent_id),
    INDEX idx_categories_display_order (display_order),
    INDEX idx_categories_status (status),
    INDEX idx_categories_is_featured (is_featured),
    
    UNIQUE INDEX idx_categories_slug_unique (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng danh mục sản phẩm';

-- =====================================================
-- BẢNG 4: BRANDS - Quản lý thương hiệu
-- =====================================================

CREATE TABLE brands (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID thương hiệu',
    name VARCHAR(100) NOT NULL COMMENT 'Tên thương hiệu',
    slug VARCHAR(100) NOT NULL COMMENT 'Slug URL thân thiện',
    logo VARCHAR(500) NULL COMMENT 'Đường dẫn logo',
    website VARCHAR(255) NULL COMMENT 'Website thương hiệu',
    description TEXT NULL COMMENT 'Mô tả thương hiệu',
    country VARCHAR(50) NULL COMMENT 'Quốc gia xuất xứ',
    display_order INT DEFAULT 0 COMMENT 'Thứ tự hiển thị',
    is_featured BOOLEAN DEFAULT FALSE COMMENT 'Hiển thị trang chủ',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT 'Trạng thái',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật',
    deleted_at TIMESTAMP NULL COMMENT 'Ngày xóa mềm',
    
    INDEX idx_brands_slug (slug),
    INDEX idx_brands_name (name),
    INDEX idx_brands_display_order (display_order),
    INDEX idx_brands_status (status),
    INDEX idx_brands_is_featured (is_featured),
    
    UNIQUE INDEX idx_brands_slug_unique (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng thương hiệu sản phẩm';

-- =====================================================
-- BẢNG 5: PRODUCTS - Quản lý sản phẩm
-- =====================================================

CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID sản phẩm',
    name VARCHAR(255) NOT NULL COMMENT 'Tên sản phẩm',
    slug VARCHAR(255) NOT NULL COMMENT 'Slug URL thân thiện',
    sku VARCHAR(100) NULL COMMENT 'Mã SKU sản phẩm',
    price DECIMAL(15, 2) NOT NULL DEFAULT 0 COMMENT 'Giá gốc (VNĐ)',
    sale_price DECIMAL(15, 2) NULL COMMENT 'Giá khuyến mãi (VNĐ)',
    short_description VARCHAR(500) NULL COMMENT 'Mô tả ngắn',
    description TEXT NULL COMMENT 'Mô tả chi tiết (HTML)',
    specifications TEXT NULL COMMENT 'Thông số kỹ thuật (JSON)',
    thumbnail VARCHAR(500) NULL COMMENT 'Ảnh đại diện',
    quantity INT DEFAULT 0 COMMENT 'Số lượng tồn kho',
    sold_count INT DEFAULT 0 COMMENT 'Số lượng đã bán',
    view_count INT DEFAULT 0 COMMENT 'Số lượt xem',
    category_id BIGINT UNSIGNED NOT NULL COMMENT 'ID danh mục',
    brand_id BIGINT UNSIGNED NOT NULL COMMENT 'ID thương hiệu',
    is_featured BOOLEAN DEFAULT FALSE COMMENT 'Sản phẩm nổi bật',
    is_new BOOLEAN DEFAULT FALSE COMMENT 'Sản phẩm mới',
    warranty_months INT DEFAULT 12 COMMENT 'Thời gian bảo hành (tháng)',
    status ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active' COMMENT 'Trạng thái',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật',
    deleted_at TIMESTAMP NULL COMMENT 'Ngày xóa mềm',
    
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) REFERENCES brands(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- CHECK Constraints cho products
    CONSTRAINT chk_products_price CHECK (price >= 0),
    CONSTRAINT chk_products_sale_price CHECK (sale_price IS NULL OR sale_price >= 0),
    CONSTRAINT chk_products_quantity CHECK (quantity >= 0),
    CONSTRAINT chk_products_sold_count CHECK (sold_count >= 0),
    CONSTRAINT chk_products_view_count CHECK (view_count >= 0),
    CONSTRAINT chk_products_warranty CHECK (warranty_months >= 0),
    
    INDEX idx_products_name (name),
    INDEX idx_products_slug (slug),
    INDEX idx_products_sku (sku),
    INDEX idx_products_price (price),
    INDEX idx_products_sale_price (sale_price)akstoreakstoreakstore,
    INDEX idx_products_category (category_id),
    INDEX idx_products_brand (brand_id),
    INDEX idx_products_status (status),
    INDEX idx_products_is_featured (is_featured),
    INDEX idx_products_is_new (is_new),
    INDEX idx_products_view_count (view_count),
    INDEX idx_products_sold_count (sold_count),
    
    -- Composite Indexes cho tối ưu hiệu năng
    INDEX idx_products_category_brand (category_id, brand_id),
    INDEX idx_products_status_category (status, category_id),
    INDEX idx_products_featured_status (is_featured, status, price),
    
    UNIQUE INDEX idx_products_slug_unique (slug),
    UNIQUE INDEX idx_products_sku_unique (sku)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng sản phẩm';

-- =====================================================
-- BẢNG 6: PRODUCT_IMAGES - Hình ảnh sản phẩm
-- =====================================================
-- Version 2.0: Đã thêm deleted_at và UNIQUE constraint

CREATE TABLE product_images (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID ảnh',
    product_id BIGINT UNSIGNED NOT NULL COMMENT 'ID sản phẩm',
    image_url VARCHAR(500) NOT NULL COMMENT 'Đường dẫn ảnh',
    alt_text VARCHAR(255) NULL COMMENT 'Alt text cho ảnh',
    display_order INT DEFAULT 0 COMMENT 'Thứ tự hiển thị (0 = ảnh chính)',
    is_primary BOOLEAN DEFAULT FALSE COMMENT 'Là ảnh chính',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật',
    deleted_at TIMESTAMP NULL COMMENT 'Ngày xóa mềm',
    
    CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    INDEX idx_product_images_product (product_id),
    INDEX idx_product_images_display_order (display_order),
    
    -- UNIQUE: Không có 2 ảnh trùng thứ tự trong cùng 1 sản phẩm
    UNIQUE INDEX idx_product_images_product_order (product_id, display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng hình ảnh sản phẩm';

-- =====================================================
-- BẢNG 7: CARTS - Giỏ hàng
-- =====================================================

CREATE TABLE carts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID giỏ hàng',
    user_id BIGINT UNSIGNED NOT NULL COMMENT 'ID người dùng',
    session_id VARCHAR(100) NULL COMMENT 'Session ID (cho khách chưa đăng nhập)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật',
    deleted_at TIMESTAMP NULL COMMENT 'Ngày xóa mềm',
    
    CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    INDEX idx_carts_user (user_id),
    INDEX idx_carts_session (session_id),
    
    UNIQUE INDEX idx_carts_user_unique (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng giỏ hàng';

-- =====================================================
-- BẢNG 8: CART_ITEMS - Chi tiết giỏ hàng
-- =====================================================
-- Version 2.0: Đã thêm deleted_at và CHECK constraint

CREATE TABLE cart_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID item',
    cart_id BIGINT UNSIGNED NOT NULL COMMENT 'ID giỏ hàng',
    product_id BIGINT UNSIGNED NOT NULL COMMENT 'ID sản phẩm',
    quantity INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Số lượng',
    price DECIMAL(15, 2) NOT NULL COMMENT 'Giá tại thời điểm thêm vào',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật',
    deleted_at TIMESTAMP NULL COMMENT 'Ngày xóa mềm',
    
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- CHECK Constraints cho cart_items
    CONSTRAINT chk_cart_items_quantity CHECK (quantity >= 1),
    CONSTRAINT chk_cart_items_price CHECK (price >= 0),
    
    INDEX idx_cart_items_cart (cart_id),
    INDEX idx_cart_items_product (product_id),
    
    -- Composite Index cho tối ưu truy vấn
    INDEX idx_cart_items_cart_product (cart_id, product_id),
    
    UNIQUE INDEX idx_cart_items_cart_product_unique (cart_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng chi tiết giỏ hàng';

-- =====================================================
-- BẢNG 9: PAYMENT_METHODS - Phương thức thanh toán
-- =====================================================

CREATE TABLE payment_methods (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID phương thức',
    name VARCHAR(100) NOT NULL COMMENT 'Tên phương thức (COD, Chuyển khoản...)',
    code VARCHAR(50) NOT NULL COMMENT 'Mã phương thức (cod, bank_transfer...)',
    description TEXT NULL COMMENT 'Mô tả chi tiết',
    icon VARCHAR(255) NULL COMMENT 'Icon phương thức',
    instructions TEXT NULL COMMENT 'Hướng dẫn thanh toán',
    fee_percentage DECIMAL(5, 2) DEFAULT 0 COMMENT 'Phí thanh toán (%)',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Còn hoạt động không',
    display_order INT DEFAULT 0 COMMENT 'Thứ tự hiển thị',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật',
    deleted_at TIMESTAMP NULL COMMENT 'Ngày xóa mềm',
    
    -- CHECK Constraints cho payment_methods
    CONSTRAINT chk_payment_methods_fee CHECK (fee_percentage >= 0 AND fee_percentage <= 100),
    
    INDEX idx_payment_methods_code (code),
    INDEX idx_payment_methods_is_active (is_active),
    INDEX idx_payment_methods_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng phương thức thanh toán';

-- =====================================================
-- BẢNG 10: ORDERS - Đơn hàng
-- =====================================================
-- Version 2.0: Đã thêm CHECK constraints và Composite Index

CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID đơn hàng',
    order_code VARCHAR(50) NOT NULL COMMENT 'Mã đơn hàng (AK-YYYYMMDD-XXXXX)',
    user_id BIGINT UNSIGNED NULL COMMENT 'ID người dùng (null = khách)',
    receiver_name VARCHAR(100) NOT NULL COMMENT 'Tên người nhận',
    receiver_phone VARCHAR(20) NOT NULL COMMENT 'SĐT người nhận',
    receiver_address TEXT NOT NULL COMMENT 'Địa chỉ giao hàng',
    receiver_city VARCHAR(100) NULL COMMENT 'Thành phố',
    receiver_district VARCHAR(100) NULL COMMENT 'Quận/Huyện',
    note TEXT NULL COMMENT 'Ghi chú đơn hàng',
    subtotal DECIMAL(15, 2) NOT NULL DEFAULT 0 COMMENT 'Tổng tiền hàng',
    shipping_fee DECIMAL(15, 2) DEFAULT 0 COMMENT 'Phí vận chuyển',
    discount_amount DECIMAL(15, 2) DEFAULT 0 COMMENT 'Giảm giá',
    total_price DECIMAL(15, 2) NOT NULL DEFAULT 0 COMMENT 'Tổng thanh toán',
    payment_method_id BIGINT UNSIGNED NOT NULL COMMENT 'ID phương thức thanh toán',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending' COMMENT 'Trạng thái thanh toán',
    order_status ENUM('pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled', 'returned') DEFAULT 'pending' COMMENT 'Trạng thái đơn hàng',
    cancelled_reason TEXT NULL COMMENT 'Lý do hủy đơn',
    delivered_at TIMESTAMP NULL COMMENT 'Thời gian giao hàng thành công',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật',
    deleted_at TIMESTAMP NULL COMMENT 'Ngày xóa mềm',
    
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_orders_payment_method FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- CHECK Constraints cho orders
    CONSTRAINT chk_orders_subtotal CHECK (subtotal >= 0),
    CONSTRAINT chk_orders_shipping_fee CHECK (shipping_fee >= 0),
    CONSTRAINT chk_orders_discount CHECK (discount_amount >= 0),
    CONSTRAINT chk_orders_total CHECK (total_price >= 0),
    CONSTRAINT chk_orders_discount_not_exceed CHECK (discount_amount <= subtotal),
    
    INDEX idx_orders_order_code (order_code),
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (order_status),
    INDEX idx_orders_payment_status (payment_status),
    INDEX idx_orders_payment_method (payment_method_id),
    INDEX idx_orders_created_at (created_at),
    INDEX idx_orders_receiver_phone (receiver_phone),
    
    -- Composite Indexes cho tối ưu hiệu năng
    INDEX idx_orders_user_status (user_id, order_status),
    INDEX idx_orders_user_created (user_id, created_at),
    
    UNIQUE INDEX idx_orders_order_code_unique (order_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng đơn hàng';

-- =====================================================
-- BẢNG 11: ORDER_DETAILS - Chi tiết đơn hàng
-- =====================================================
-- Version 2.0: Đã thêm deleted_at và CHECK constraints

CREATE TABLE order_details (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID chi tiết',
    order_id BIGINT UNSIGNED NOT NULL COMMENT 'ID đơn hàng',
    product_id BIGINT UNSIGNED NOT NULL COMMENT 'ID sản phẩm',
    product_name VARCHAR(255) NOT NULL COMMENT 'Tên sản phẩm (snapshot)',
    product_sku VARCHAR(100) NULL COMMENT 'SKU sản phẩm (snapshot)',
    product_image VARCHAR(500) NULL COMMENT 'Ảnh sản phẩm (snapshot)',
    price DECIMAL(15, 2) NOT NULL COMMENT 'Giá tại thời điểm đặt',
    quantity INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Số lượng đặt',
    discount_amount DECIMAL(15, 2) DEFAULT 0 COMMENT 'Giảm giá item',
    subtotal DECIMAL(15, 2) NOT NULL COMMENT 'Thành tiền (price * quantity - discount)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật',
    deleted_at TIMESTAMP NULL COMMENT 'Ngày xóa mềm',
    
    CONSTRAINT fk_order_details_order FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_order_details_product FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    
    -- CHECK Constraints cho order_details
    CONSTRAINT chk_order_details_quantity CHECK (quantity >= 1),
    CONSTRAINT chk_order_details_price CHECK (price >= 0),
    CONSTRAINT chk_order_details_discount CHECK (discount_amount >= 0),
    CONSTRAINT chk_order_details_subtotal CHECK (subtotal >= 0),
    CONSTRAINT chk_order_details_discount_not_exceed CHECK (discount_amount <= (price * quantity)),
    
    INDEX idx_order_details_order (order_id),
    INDEX idx_order_details_product (product_id),
    
    -- Composite Index cho tối ưu truy vấn
    INDEX idx_order_details_order_product (order_id, product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng chi tiết đơn hàng';

-- =====================================================
-- BẢNG 12: BANNERS - Banner trang chủ
-- =====================================================

CREATE TABLE banners (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT 'ID banner',
    title VARCHAR(255) NOT NULL COMMENT 'Tiêu đề banner',
    subtitle VARCHAR(255) NULL COMMENT 'Phụ đề banner',
    image_url VARCHAR(500) NOT NULL COMMENT 'Đường dẫn ảnh banner',
    link VARCHAR(500) NULL COMMENT 'Link khi click banner',
    link_type ENUM('product', 'category', 'brand', 'url', 'none') DEFAULT 'none' COMMENT 'Loại link',
    target_id BIGINT UNSIGNED NULL COMMENT 'ID target (sản phẩm/danh mục/thương hiệu)',
    display_order INT DEFAULT 0 COMMENT 'Thứ tự hiển thị',
    status ENUM('active', 'inactive') DEFAULT 'active' COMMENT 'Trạng thái',
    start_date TIMESTAMP NULL COMMENT 'Ngày bắt đầu hiển thị',
    end_date TIMESTAMP NULL COMMENT 'Ngày kết thúc hiển thị',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Ngày tạo',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Ngày cập nhật',
    deleted_at TIMESTAMP NULL COMMENT 'Ngày xóa mềm',
    
    INDEX idx_banners_status (status),
    INDEX idx_banners_display_order (display_order),
    INDEX idx_banners_start_date (start_date),
    INDEX idx_banners_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng banner trang chủ';

-- =====================================================
-- VIEWS: Tiện ích truy vấn
-- =====================================================

-- View: Sản phẩm với thông tin đầy đủ
CREATE OR REPLACE VIEW v_products_full AS
SELECT 
    p.*,
    c.name AS category_name,
    c.slug AS category_slug,
    b.name AS brand_name,
    b.slug AS brand_slug,
    (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = TRUE AND deleted_at IS NULL LIMIT 1) AS primary_image
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands b ON p.brand_id = b.id
WHERE p.deleted_at IS NULL;

-- View: Đơn hàng với thông tin khách hàng
CREATE OR REPLACE VIEW v_orders_full AS
SELECT 
    o.*,
    u.name AS customer_name,
    u.email AS customer_email,
    u.phone AS customer_phone,
    pm.name AS payment_method_name
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN payment_methods pm ON o.payment_method_id = pm.id
WHERE o.deleted_at IS NULL;

-- View: Thống kê doanh thu theo ngày
CREATE OR REPLACE VIEW v_revenue_stats AS
SELECT 
    DATE(created_at) AS date,
    COUNT(*) AS total_orders,
    SUM(total_price) AS total_revenue,
    SUM(CASE WHEN order_status = 'delivered' THEN total_price ELSE 0 END) AS delivered_revenue,
    SUM(CASE WHEN order_status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled_orders
FROM orders
WHERE deleted_at IS NULL
GROUP BY DATE(created_at);

-- View: Thống kê sản phẩm bán chạy
CREATE OR REPLACE VIEW v_top_selling_products AS
SELECT 
    p.id,
    p.name,
    p.sku,
    p.thumbnail,
    p.price,
    p.sale_price,
    c.name AS category_name,
    b.name AS brand_name,
    p.sold_count,
    p.view_count,
    ROUND(p.sold_count / NULLIF(p.view_count, 0) * 100, 2) AS conversion_rate
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands b ON p.brand_id = b.id
WHERE p.deleted_at IS NULL
ORDER BY p.sold_count DESC
LIMIT 20;

-- View: Thống kê đơn hàng theo trạng thái
CREATE OR REPLACE VIEW v_orders_by_status AS
SELECT 
    order_status,
    COUNT(*) AS total_orders,
    SUM(total_price) AS total_revenue
FROM orders
WHERE deleted_at IS NULL
GROUP BY order_status;

-- =====================================================
-- TRIGGERS: Tự động cập nhật
-- =====================================================

-- Trigger: Tự động tạo giỏ hàng khi tạo user mới
DELIMITER //
CREATE TRIGGER tr_after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO carts (user_id) VALUES (NEW.id);
END//
DELIMITER ;

-- Trigger: Cập nhật sold_count khi có đơn hàng mới
DELIMITER //
CREATE TRIGGER tr_after_order_detail_insert
AFTER INSERT ON order_details
FOR EACH ROW
BEGIN
    UPDATE products 
    SET sold_count = sold_count + NEW.quantity
    WHERE id = NEW.product_id;
END//
DELIMITER ;

-- Trigger: Giảm quantity khi đặt hàng thành công
DELIMITER //
CREATE TRIGGER tr_after_order_confirmed
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.order_status = 'confirmed' AND OLD.order_status != 'confirmed' THEN
        UPDATE products p
        JOIN order_details od ON p.id = od.product_id
        SET p.quantity = p.quantity - od.quantity
        WHERE od.order_id = NEW.id;
    END IF;
END//
DELIMITER ;

-- =====================================================
-- COMMENTS: Mô tả database
-- =====================================================

ALTER TABLE roles COMMENT = 'Bảng vai trò: Admin, User, Staff...';
ALTER TABLE users COMMENT = 'Bảng người dùng: Khách hàng và Admin';
ALTER TABLE categories COMMENT = 'Bảng danh mục sản phẩm (có cấu trúc cây)';
ALTER TABLE brands COMMENT = 'Bảng thương hiệu sản phẩm';
ALTER TABLE products COMMENT = 'Bảng sản phẩm chính';
ALTER TABLE product_images COMMENT = 'Bảng hình ảnh gallery sản phẩm';
ALTER TABLE carts COMMENT = 'Bảng giỏ hàng (1 cart/user)';
ALTER TABLE cart_items COMMENT = 'Bảng chi tiết giỏ hàng';
ALTER TABLE payment_methods COMMENT = 'Bảng phương thức thanh toán';
ALTER TABLE orders COMMENT = 'Bảng đơn hàng';
ALTER TABLE order_details COMMENT = 'Bảng chi tiết đơn hàng';
ALTER TABLE banners COMMENT = 'Bảng banner trang chủ';
