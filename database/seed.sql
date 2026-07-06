-- =====================================================
-- AKStore Database Seed Data
-- Version: 2.0 (Updated)
-- =====================================================

USE akstore;

-- =====================================================
-- ROLES - 2 vai trò
-- =====================================================

INSERT INTO roles (name, slug, description) VALUES
('Quản trị viên', 'admin', 'Người quản lý hệ thống'),
('Khách hàng', 'user', 'Người dùng thông thường');

-- =====================================================
-- USERS - 5 người dùng
-- =====================================================
-- Password: admin123 cho admin, user123 cho users (BCrypt hash)

INSERT INTO users (name, email, password, phone, address, avatar, role_id, status) VALUES
('Nguyễn Văn An', 'admin@akstore.vn', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0901234567', '123 Đường Lê Lợi, Quận 1, TP.HCM', '/images/users/admin-avatar.jpg', 1, 'active'),
('Trần Thị Bình', 'binh.tran@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0912345678', '45 Đường Nguyễn Huệ, Quận 1, TP.HCM', '/images/users/user1-avatar.jpg', 2, 'active'),
('Lê Minh Cường', 'cuong.le@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0923456789', '78 Đường Trần Hưng Đạo, Quận 5, TP.HCM', '/images/users/user2-avatar.jpg', 2, 'active'),
('Phạm Thu Hà', 'ha.pham@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0934567890', '156 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM', '/images/users/user3-avatar.jpg', 2, 'active'),
('Hoàng Đình Dũng', 'dung.hoang@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '0945678901', '234 Đường Cái Khế, Quận Ninh Kiều, Cần Thơ', '/images/users/user4-avatar.jpg', 2, 'active');

-- =====================================================
-- CATEGORIES - 10 danh mục
-- =====================================================

INSERT INTO categories (name, slug, description, image, parent_id, display_order, is_featured, status) VALUES
('Điện thoại', 'dien-thoai', 'Điện thoại smartphone các hãng', '/images/categories/dien-thoai.jpg', NULL, 1, TRUE, 'active'),
('Laptop', 'laptop', 'Laptop, máy tính xách tay', '/images/categories/laptop.jpg', NULL, 2, TRUE, 'active'),
('Máy tính bảng', 'may-tinh-bang', 'iPad, Samsung Tab, máy tính bảng', '/images/categories/may-tinh-bang.jpg', NULL, 3, TRUE, 'active'),
('Đồng hồ thông minh', 'dong-ho-thong-minh', 'Apple Watch, Samsung Watch, Garmin', '/images/categories/dong-ho.jpg', NULL, 4, TRUE, 'active'),
('Tai nghe', 'tai-nghe', 'Tai nghe không dây, có dây', '/images/categories/tai-nghe.jpg', NULL, 5, TRUE, 'active'),
('Chuột & Bàn phím', 'chuot-ban-phim', 'Chuột và bàn phím máy tính', '/images/categories/chuot-banphim.jpg', NULL, 6, TRUE, 'active'),
('Màn hình', 'man-hinh', 'Màn hình máy tính', '/images/categories/man-hinh.jpg', NULL, 7, FALSE, 'active'),
('Ổ cứng & USB', 'o-cung', 'Ổ cứng HDD, SSD, USB', '/images/categories/o-cung.jpg', NULL, 8, FALSE, 'active'),
('Phụ kiện', 'phu-kien', 'Sạc, cáp, case, balo', '/images/categories/phu-kien.jpg', NULL, 9, TRUE, 'active'),
('Camera', 'camera', 'Webcam, action camera, IP camera', '/images/categories/camera.jpg', NULL, 10, FALSE, 'active');

-- =====================================================
-- BRANDS - 15 thương hiệu
-- =====================================================

INSERT INTO brands (name, slug, logo, website, description, country, display_order, is_featured, status) VALUES
('Apple', 'apple', '/images/brands/apple-logo.png', 'https://www.apple.com', 'Thương hiệu công nghệ hàng đầu thế giới', 'Mỹ', 1, TRUE, 'active'),
('Samsung', 'samsung', '/images/brands/samsung-logo.png', 'https://www.samsung.com', 'Tập đoàn điện tử lớn nhất Hàn Quốc', 'Hàn Quốc', 2, TRUE, 'active'),
('Sony', 'sony', '/images/brands/sony-logo.png', 'https://www.sony.com', 'Thương hiệu Nhật Bản nổi tiếng', 'Nhật Bản', 3, TRUE, 'active'),
('Microsoft', 'microsoft', '/images/brands/microsoft-logo.png', 'https://www.microsoft.com', 'Tập đoàn phần mềm hàng đầu', 'Mỹ', 4, FALSE, 'active'),
('Dell', 'dell', '/images/brands/dell-logo.png', 'https://www.dell.com', 'Chuyên gia máy tính và thiết bị IT', 'Mỹ', 5, TRUE, 'active'),
('ASUS', 'asus', '/images/brands/asus-logo.png', 'https://www.asus.com', 'Nhà sản xuất laptop và linh kiện PC', 'Đài Loan', 6, TRUE, 'active'),
('Lenovo', 'lenovo', '/images/brands/lenovo-logo.png', 'https://www.lenovo.com', 'Tập đoàn công nghệ Trung Quốc', 'Trung Quốc', 7, FALSE, 'active'),
('HP', 'hp', '/images/brands/hp-logo.png', 'https://www.hp.com', 'Công ty công nghệ máy in và PC hàng đầu', 'Mỹ', 8, FALSE, 'active'),
('Logitech', 'logitech', '/images/brands/logitech-logo.png', 'https://www.logitech.com', 'Chuyên gia thiết bị ngoại vi', 'Thụy Sĩ', 9, TRUE, 'active'),
('JBL', 'jbl', '/images/brands/jbl-logo.png', 'https://www.jbl.com', 'Thương hiệu âm thanh nổi tiếng', 'Mỹ', 10, FALSE, 'active'),
('Xiaomi', 'xiaomi', '/images/brands/xiaomi-logo.png', 'https://www.xiaomi.com', 'Công ty điện thoại thông minh Trung Quốc', 'Trung Quốc', 11, TRUE, 'active'),
('OPPO', 'oppo', '/images/brands/oppo-logo.png', 'https://www.oppo.com', 'Thương hiệu smartphone Trung Quốc', 'Trung Quốc', 12, FALSE, 'active'),
('Garmin', 'garmin', '/images/brands/garmin-logo.png', 'https://www.garmin.com', 'Chuyên gia GPS và thiết bị thể thao', 'Mỹ', 13, FALSE, 'active'),
('Western Digital', 'western-digital', '/images/brands/wd-logo.png', 'https://www.wd.com', 'Nhà sản xuất ổ cứng hàng đầu', 'Mỹ', 14, FALSE, 'active'),
('SanDisk', 'sandisk', '/images/brands/sandisk-logo.png', 'https://www.sandisk.com', 'Chuyên gia bộ nhớ di động', 'Mỹ', 15, FALSE, 'active');

-- =====================================================
-- PRODUCTS - 50 sản phẩm công nghệ thật
-- =====================================================

-- Điện thoại (Category 1) - 9 sản phẩm
INSERT INTO products (name, slug, sku, price, sale_price, short_description, thumbnail, quantity, sold_count, view_count, category_id, brand_id, is_featured, is_new, warranty_months, status) VALUES
('iPhone 16 Pro Max 256GB', 'iphone-16-pro-max-256gb', 'IP16PM256', 34990000, 32990000, 'iPhone 16 Pro Max với chip A18 Pro, màn hình 6.9 inch Super Retina XDR, camera 48MP', '/images/products/iphone-16-pro-max.jpg', 50, 120, 2500, 1, 1, TRUE, TRUE, 12, 'active'),
('iPhone 16 Pro 128GB', 'iphone-16-pro-128gb', 'IP16P128', 28990000, NULL, 'iPhone 16 Pro - Chip A18 Pro, màn hình 6.3 inch, camera 48MP', '/images/products/iphone-16-pro.jpg', 45, 85, 1800, 1, 1, TRUE, TRUE, 12, 'active'),
('iPhone 15 128GB', 'iphone-15-128gb', 'IP15128', 21990000, 19990000, 'iPhone 15 - Chip A16 Bionic, camera 48MP, Dynamic Island', '/images/products/iphone-15.jpg', 60, 200, 3500, 1, 1, FALSE, FALSE, 12, 'active'),
('Samsung Galaxy S25 Ultra 256GB', 'samsung-galaxy-s25-ultra', 'SGS25U256', 32990000, NULL, 'Samsung Galaxy S25 Ultra - Snapdragon 8 Elite, S Pen, camera 200MP', '/images/products/galaxy-s25-ultra.jpg', 40, 90, 2200, 1, 2, TRUE, TRUE, 12, 'active'),
('Samsung Galaxy Z Fold6 512GB', 'samsung-galaxy-z-fold6', 'SGFOLD6', 41990000, 38990000, 'Samsung Galaxy Z Fold6 - Màn hình gập 7.6 inch, chip Snapdragon 8 Gen 3', '/images/products/galaxy-z-fold6.jpg', 25, 45, 1500, 1, 2, TRUE, TRUE, 12, 'active'),
('Samsung Galaxy A55 5G 128GB', 'samsung-galaxy-a55-5g', 'SGA55', 9990000, 8990000, 'Samsung Galaxy A55 5G - Màn hình Super AMOLED 6.6 inch, pin 5000mAh', '/images/products/galaxy-a55.jpg', 80, 150, 2800, 1, 2, FALSE, FALSE, 12, 'active'),
('OPPO Find X8 Pro 256GB', 'oppo-find-x8-pro', 'OPFX8P256', 24990000, NULL, 'OPPO Find X8 Pro - Hasselblad camera, chip Dimensity 9400', '/images/products/find-x8-pro.jpg', 30, 35, 800, 1, 12, FALSE, TRUE, 12, 'active'),
('Xiaomi 14 Ultra 512GB', 'xiaomi-14-ultra', 'XM14U512', 27990000, 25990000, 'Xiaomi 14 Ultra - Leica camera 1 inch, Snapdragon 8 Gen 3', '/images/products/xiaomi-14-ultra.jpg', 35, 55, 1200, 1, 11, TRUE, FALSE, 12, 'active'),
('Xiaomi Redmi Note 13 Pro 5G', 'xiaomi-redmi-note-13-pro', 'XMRN13P', 7990000, 6990000, 'Xiaomi Redmi Note 13 Pro - Camera 200MP, màn hình AMOLED 120Hz', '/images/products/redmi-note-13-pro.jpg', 100, 250, 4500, 1, 11, FALSE, FALSE, 12, 'active');

-- Laptop (Category 2) - 10 sản phẩm
INSERT INTO products (name, slug, sku, price, sale_price, short_description, thumbnail, quantity, sold_count, view_count, category_id, brand_id, is_featured, is_new, warranty_months, status) VALUES
('MacBook Air M4 13 inch 256GB', 'macbook-air-m4-13', 'MBA-M4-13', 27990000, NULL, 'MacBook Air M4 - Chip M4, 13.6 inch Liquid Retina, 18 giờ pin', '/images/products/macbook-air-m4.jpg', 40, 75, 2000, 2, 1, TRUE, TRUE, 12, 'active'),
('MacBook Pro 14 inch M4 Pro', 'macbook-pro-14-m4-pro', 'MBP14-M4P', 49990000, 47990000, 'MacBook Pro 14 inch - Chip M4 Pro, Liquid Retina XDR, 22 giờ pin', '/images/products/macbook-pro-14.jpg', 25, 40, 1200, 2, 1, TRUE, TRUE, 12, 'active'),
('MacBook Air M3 15 inch', 'macbook-air-m3-15', 'MBA-M3-15', 32990000, 30990000, 'MacBook Air 15 inch - Chip M3, màn hình lớn, thiết kế mỏng nhẹ', '/images/products/macbook-air-m3-15.jpg', 30, 50, 1500, 2, 1, FALSE, FALSE, 12, 'active'),
('Dell XPS 15 9530', 'dell-xps-15-9530', 'DXPS15-9530', 45990000, NULL, 'Dell XPS 15 - Intel Core i9-13900H, RTX 4060, OLED 3.5K', '/images/products/dell-xps-15.jpg', 20, 28, 800, 2, 5, TRUE, FALSE, 12, 'active'),
('Dell XPS 13 Plus 9320', 'dell-xps-13-plus', 'DXPS13P', 32990000, 29990000, 'Dell XPS 13 Plus - Intel Core i7-1360P, OLED 3.5K, bàn phím LED', '/images/products/dell-xps-13-plus.jpg', 25, 35, 900, 2, 5, FALSE, FALSE, 12, 'active'),
('ASUS ROG Zephyrus G16', 'asus-rog-zephyrus-g16', 'ASROGG16', 54990000, NULL, 'ASUS ROG Zephyrus G16 - Intel Core i9-14900HX, RTX 4070, 240Hz', '/images/products/rog-zephyrus-g16.jpg', 15, 20, 600, 2, 6, TRUE, TRUE, 24, 'active'),
('ASUS ZenBook 14 OLED', 'asus-zenbook-14-oled', 'ASZB14O', 26990000, 24990000, 'ASUS ZenBook 14 - Intel Core Ultra 7, OLED 2.8K, 15 giờ pin', '/images/products/zenbook-14.jpg', 35, 45, 1100, 2, 6, FALSE, FALSE, 12, 'active'),
('ASUS VivoBook 15', 'asus-vivobook-15', 'ASVB15', 15990000, 13990000, 'ASUS VivoBook 15 - Intel Core i5, Full HD, nhẹ 1.7kg', '/images/products/vivobook-15.jpg', 50, 80, 2000, 2, 6, FALSE, FALSE, 12, 'active'),
('Lenovo ThinkPad X1 Carbon Gen 11', 'lenovo-thinkpad-x1-carbon', 'LVTPC11', 42990000, NULL, 'Lenovo ThinkPad X1 Carbon - Intel Core i7-1365U, siêu nhẹ 1.12kg', '/images/products/thinkpad-x1-carbon.jpg', 18, 22, 500, 2, 7, FALSE, FALSE, 12, 'active'),
('HP Spectre x360 16', 'hp-spectre-x360-16', 'HPSX36016', 45990000, 42990000, 'HP Spectre x360 - Intel Core i7, OLED 3K, laptop 2-trong-1', '/images/products/spectre-x360.jpg', 20, 25, 700, 2, 8, TRUE, FALSE, 12, 'active');

-- Máy tính bảng (Category 3) - 5 sản phẩm
INSERT INTO products (name, slug, sku, price, sale_price, short_description, thumbnail, quantity, sold_count, view_count, category_id, brand_id, is_featured, is_new, warranty_months, status) VALUES
('iPad Pro 13 inch M4', 'ipad-pro-13-m4', 'IPDP13M4', 37990000, NULL, 'iPad Pro 13 inch - Chip M4, OLED Ultra Retina XDR, 256GB', '/images/products/ipad-pro-13.jpg', 30, 45, 1200, 3, 1, TRUE, TRUE, 12, 'active'),
('iPad Air 11 inch M2', 'ipad-air-11-m4', 'IPDA11M2', 19990000, 18490000, 'iPad Air 11 inch - Chip M2, Liquid Retina, hỗ trợ Apple Pencil Pro', '/images/products/ipad-air-11.jpg', 40, 60, 1500, 3, 1, TRUE, TRUE, 12, 'active'),
('iPad mini 7', 'ipad-mini-7', 'IPDM7', 14990000, NULL, 'iPad mini 7 - Chip A17 Pro, màn hình 8.3 inch, nhỏ gọn', '/images/products/ipad-mini-7.jpg', 35, 40, 1000, 3, 1, FALSE, TRUE, 12, 'active'),
('Samsung Galaxy Tab S10 Ultra', 'samsung-galaxy-tab-s10-ultra', 'SGTS10U', 31990000, 29990000, 'Samsung Galaxy Tab S10 Ultra - Snapdragon 8 Gen 3, S Pen, AMOLED 14.6 inch', '/images/products/galaxy-tab-s10-ultra.jpg', 20, 25, 700, 3, 2, TRUE, TRUE, 12, 'active'),
('Samsung Galaxy Tab S9 FE', 'samsung-galaxy-tab-s9-fe', 'SGTS9FE', 11990000, 9990000, 'Samsung Galaxy Tab S9 FE - Exynos, 10.9 inch, S Pen đi kèm', '/images/products/galaxy-tab-s9-fe.jpg', 45, 65, 1600, 3, 2, FALSE, FALSE, 12, 'active');

-- Đồng hồ thông minh (Category 4) - 6 sản phẩm
INSERT INTO products (name, slug, sku, price, sale_price, short_description, thumbnail, quantity, sold_count, view_count, category_id, brand_id, is_featured, is_new, warranty_months, status) VALUES
('Apple Watch Ultra 2', 'apple-watch-ultra-2', 'AWU2', 21990000, NULL, 'Apple Watch Ultra 2 - Titanium 49mm, GPS + Cellular, 36 giờ pin', '/images/products/apple-watch-ultra-2.jpg', 30, 50, 1500, 4, 1, TRUE, TRUE, 12, 'active'),
('Apple Watch Series 10 46mm', 'apple-watch-series-10', 'AWS10', 11990000, 10990000, 'Apple Watch Series 10 - Màn hình OLED lớn hơn, sạc nhanh', '/images/products/apple-watch-s10.jpg', 50, 80, 2200, 4, 1, TRUE, TRUE, 12, 'active'),
('Samsung Galaxy Watch 7 44mm', 'samsung-galaxy-watch-7', 'SGGW7', 7990000, NULL, 'Samsung Galaxy Watch 7 - BioActive Sensor, Wear OS, 40 giờ pin', '/images/products/galaxy-watch-7.jpg', 40, 55, 1400, 4, 2, TRUE, TRUE, 12, 'active'),
('Samsung Galaxy Watch Ultra', 'samsung-galaxy-watch-ultra', 'SGGWU', 14990000, 13990000, 'Samsung Galaxy Watch Ultra - Titanium 47mm, GPS chính xác, 100 giờ pin', '/images/products/galaxy-watch-ultra.jpg', 25, 30, 900, 4, 2, FALSE, TRUE, 12, 'active'),
('Garmin Fenix 8', 'garmin-fenix-8', 'GMRFNX8', 22990000, NULL, 'Garmin Fenix 8 - Đồng hồ đa thể thao cao cấp, GPS kép', '/images/products/garmin-fenix-8.jpg', 15, 18, 500, 4, 13, FALSE, FALSE, 24, 'active'),
('Xiaomi Watch S3', 'xiaomi-watch-s3', 'XMWTCHS3', 3990000, 3490000, 'Xiaomi Watch S3 - AMOLED 1.43 inch, 15 ngày pin, NFC', '/images/products/xiaomi-watch-s3.jpg', 60, 90, 2500, 4, 11, FALSE, FALSE, 12, 'active');

-- Tai nghe (Category 5) - 8 sản phẩm
INSERT INTO products (name, slug, sku, price, sale_price, short_description, thumbnail, quantity, sold_count, view_count, category_id, brand_id, is_featured, is_new, warranty_months, status) VALUES
('AirPods Pro 2', 'airpods-pro-2', 'APP2', 7990000, NULL, 'AirPods Pro 2 - Chống ồn chủ động, USB-C, Spatial Audio', '/images/products/airpods-pro-2.jpg', 80, 150, 4000, 5, 1, TRUE, TRUE, 12, 'active'),
('AirPods Max', 'airpods-max', 'APM', 17990000, 15990000, 'AirPods Max - Tai nghe over-ear cao cấp, Spatial Audio', '/images/products/airpods-max.jpg', 30, 45, 1200, 5, 1, TRUE, FALSE, 12, 'active'),
('AirPods 4', 'airpods-4', 'AP4', 4990000, 4490000, 'AirPods 4 - Thiết kế mới, Spatial Audio, USB-C', '/images/products/airpods-4.jpg', 70, 100, 2800, 5, 1, FALSE, TRUE, 12, 'active'),
('Samsung Galaxy Buds3 Pro', 'samsung-galaxy-buds3-pro', 'SGBP3P', 5990000, NULL, 'Samsung Galaxy Buds3 Pro - Chống ồn AI, 26 giờ pin', '/images/products/galaxy-buds3-pro.jpg', 50, 65, 1700, 5, 2, TRUE, TRUE, 12, 'active'),
('Sony WH-1000XM5', 'sony-wh-1000xm5', 'SNYWH1000XM5', 9990000, 8990000, 'Sony WH-1000XM5 - Tai nghe chống ồn tốt nhất, 30 giờ pin', '/images/products/sony-wh-1000xm5.jpg', 35, 50, 1500, 5, 3, TRUE, FALSE, 12, 'active'),
('Sony WF-1000XM5', 'sony-wf-1000xm5', 'SNYWF1000XM5', 7990000, NULL, 'Sony WF-1000XM5 - Tai nghe in-ear chống ồn cao cấp', '/images/products/sony-wf-1000xm5.jpg', 40, 55, 1400, 5, 3, FALSE, FALSE, 12, 'active'),
('JBL Tune 770NC', 'jbl-tune-770nc', 'JBLT770NC', 3990000, 3490000, 'JBL Tune 770NC - Tai nghe over-ear, 70 giờ pin, chống ồn', '/images/products/jbl-tune-770nc.jpg', 45, 60, 1600, 5, 10, FALSE, FALSE, 12, 'active'),
('Xiaomi Buds 4 Pro', 'xiaomi-buds-4-pro', 'XMBP4P', 2990000, 2490000, 'Xiaomi Buds 4 Pro - Spatial Audio, 36 giờ pin, LDAC', '/images/products/xiaomi-buds-4-pro.jpg', 55, 75, 2000, 5, 11, FALSE, FALSE, 12, 'active');

-- Chuột & Bàn phím (Category 6) - 7 sản phẩm
INSERT INTO products (name, slug, sku, price, sale_price, short_description, thumbnail, quantity, sold_count, view_count, category_id, brand_id, is_featured, is_new, warranty_months, status) VALUES
('Logitech MX Master 3S', 'logitech-mx-master-3s', 'LGMXM3S', 3290000, NULL, 'Logitech MX Master 3S - Chuột cao cấp, scroll siêu mượt, Quiet Click', '/images/products/mx-master-3s.jpg', 50, 70, 1800, 6, 9, TRUE, TRUE, 24, 'active'),
('Logitech MX Keys S', 'logitech-mx-keys-s', 'LGMXKS', 2290000, 1990000, 'Logitech MX Keys S - Bàn phím không dây, đèn nền thông minh', '/images/products/mx-keys-s.jpg', 45, 60, 1500, 6, 9, TRUE, FALSE, 24, 'active'),
('Logitech G Pro X Superlight 2', 'logitech-g-pro-x-superlight-2', 'LGGPXS2', 4990000, NULL, 'Logitech G Pro X Superlight 2 - Chuột gaming siêu nhẹ 60g', '/images/products/g-pro-x-superlight-2.jpg', 30, 40, 1000, 6, 9, FALSE, TRUE, 24, 'active'),
('Apple Magic Keyboard với Touch ID', 'apple-magic-keyboard-touch-id', 'APMKTI', 4990000, NULL, 'Apple Magic Keyboard - Touch ID, sạc USB-C, layout tiếng Việt', '/images/products/magic-keyboard-tid.jpg', 35, 45, 1100, 6, 1, TRUE, FALSE, 12, 'active'),
('Apple Magic Mouse', 'apple-magic-mouse', 'APMM', 2490000, 2190000, 'Apple Magic Mouse - Thiết kế Multi-Touch, sạc Lightning', '/images/products/magic-mouse.jpg', 40, 55, 1400, 6, 1, FALSE, FALSE, 12, 'active'),
('Logitech G915 TKL', 'logitech-g915-tkl', 'LGG915TKL', 7990000, NULL, 'Logitech G915 TKL - Bàn phím gaming cơ, switches low-profile', '/images/products/g915-tkl.jpg', 20, 25, 700, 6, 9, FALSE, FALSE, 24, 'active'),
('ASUS ROG Strix Scope II 96', 'asus-rog-strix-scope-ii-96', 'ASRS2-96', 4590000, 3990000, 'ASUS ROG Strix Scope II 96 - Bàn phím 96%, ROG NX switches', '/images/products/rog-strix-scope-ii.jpg', 25, 30, 800, 6, 6, FALSE, TRUE, 24, 'active');

-- Màn hình (Category 7) - 3 sản phẩm
INSERT INTO products (name, slug, sku, price, sale_price, short_description, thumbnail, quantity, sold_count, view_count, category_id, brand_id, is_featured, is_new, warranty_months, status) VALUES
('Apple Studio Display', 'apple-studio-display', 'APSTD', 47990000, NULL, 'Apple Studio Display - 27 inch 5K Retina, 6 loa, 3 mic', '/images/products/studio-display.jpg', 10, 12, 400, 7, 1, TRUE, FALSE, 12, 'active'),
('Dell UltraSharp U3223QE', 'dell-ultrasharp-u3223qe', 'DLU3223QE', 22990000, 19990000, 'Dell U3223QE - 32 inch 4K IPS Black, USB-C 90W', '/images/products/dell-u3223qe.jpg', 15, 18, 500, 7, 5, FALSE, FALSE, 12, 'active'),
('ASUS ProArt PA329CRV', 'asus-proart-pa329crv', 'ASPA329CRV', 19990000, NULL, 'ASUS ProArt PA329CRV - 32 inch 4K, 98% DCI-P3, USB-C 96W', '/images/products/proart-pa329crv.jpg', 12, 15, 400, 7, 6, FALSE, FALSE, 12, 'active');

-- Ổ cứng (Category 8) - 5 sản phẩm
INSERT INTO products (name, slug, sku, price, sale_price, short_description, thumbnail, quantity, sold_count, view_count, category_id, brand_id, is_featured, is_new, warranty_months, status) VALUES
('Samsung 990 Pro 2TB NVMe', 'samsung-990-pro-2tb', 'SGS990P2TB', 5990000, NULL, 'Samsung 990 Pro - SSD NVMe PCIe 4.0, 7450MB/s đọc', '/images/products/samsung-990-pro.jpg', 60, 85, 2200, 8, 2, TRUE, FALSE, 60, 'active'),
('Samsung T9 Portable SSD 2TB', 'samsung-t9-portable-2tb', 'SGT9-2TB', 4990000, 4490000, 'Samsung T9 - Ổ SSD di động USB 3.2 Gen 2x2, chống rơi 3m', '/images/products/samsung-t9.jpg', 50, 70, 1800, 8, 2, FALSE, FALSE, 60, 'active'),
('WD Black SN850X 1TB', 'wd-black-sn850x-1tb', 'WDBLKSN850X1', 3290000, 2990000, 'WD Black SN850X - SSD NVMe gaming, 7300MB/s, RGB', '/images/products/wd-black-sn850x.jpg', 45, 60, 1500, 8, 14, FALSE, FALSE, 60, 'active'),
('SanDisk Extreme Pro 1TB', 'sandisk-extreme-pro-1tb', 'SDEXP1TB', 2490000, NULL, 'SanDisk Extreme Pro - Ổ SSD di động, IP55, 2000MB/s', '/images/products/sandisk-extreme-pro.jpg', 40, 55, 1400, 8, 15, FALSE, FALSE, 60, 'active'),
('Seagate Backup Plus 4TB', 'seagate-backup-plus-4tb', 'SEBP4TB', 2990000, 2590000, 'Seagate Backup Plus - Ổ cứng HDD 4TB, USB 3.0, backup cloud', '/images/products/seagate-backup-plus.jpg', 30, 40, 1000, 8, 14, FALSE, FALSE, 36, 'active');

-- Phụ kiện (Category 9) - 5 sản phẩm
INSERT INTO products (name, slug, sku, price, sale_price, short_description, thumbnail, quantity, sold_count, view_count, category_id, brand_id, is_featured, is_new, warranty_months, status) VALUES
('Apple USB-C to Lightning Cable 1m', 'apple-usbc-lightning-1m', 'APUC-L1M', 590000, NULL, 'Cáp sạc Apple USB-C to Lightning, 1 mét', '/images/products/apple-usbc-lightning.jpg', 100, 150, 3500, 9, 1, FALSE, FALSE, 6, 'active'),
('Anker 737 Power Bank 24000mAh', 'anker-737-powerbank', 'ANKP737', 3990000, 3490000, 'Anker 737 - Sạc dự phòng 24000mAh, 140W output, smart display', '/images/products/anker-737.jpg', 40, 55, 1400, 9, 1, TRUE, FALSE, 18, 'active'),
('Belkin BoostCharge 3-in-1', 'belkin-boostcharge-3in1', 'BLKBC3IN1', 1990000, NULL, 'Belkin sạc không dây 3-in-1 cho iPhone, Apple Watch, AirPods', '/images/products/belkin-3in1.jpg', 35, 45, 1100, 9, 9, FALSE, FALSE, 12, 'active'),
('Spigen Ultra Hybrid iPhone 16 Pro Max', 'spigen-ultra-hybrid-iphone-16-pm', 'SPGH-IP16PM', 490000, 390000, 'Case Spigen Ultra Hybrid trong suốt cho iPhone 16 Pro Max', '/images/products/spigen-ultra-hybrid.jpg', 150, 200, 5000, 9, 1, FALSE, FALSE, 3, 'active'),
('Samsung 45W Travel Adapter', 'samsung-45w-travel-adapter', 'SGS45W', 990000, NULL, 'Samsung sạc nhanh 45W USB-C, tương thích nhiều thiết bị', '/images/products/samsung-45w-adapter.jpg', 80, 110, 2800, 9, 2, FALSE, FALSE, 12, 'active');

-- Camera (Category 10) - 4 sản phẩm
INSERT INTO products (name, slug, sku, price, sale_price, short_description, thumbnail, quantity, sold_count, view_count, category_id, brand_id, is_featured, is_new, warranty_months, status) VALUES
('Logitech Brio 4K Pro', 'logitech-brio-4k-pro', 'LGBRIO4K', 5990000, 5490000, 'Logitech Brio 4K Pro - Webcam 4K HDR, RightLight 3', '/images/products/logitech-brio-4k.jpg', 30, 40, 1000, 10, 9, TRUE, FALSE, 24, 'active'),
('Sony ZV-1 II', 'sony-zv-1-ii', 'SNYZV1II', 14990000, NULL, 'Sony ZV-1 II - Camera vlog, ống kính 18-50mm, màn hình xoay', '/images/products/sony-zv-1-ii.jpg', 15, 20, 500, 10, 3, FALSE, TRUE, 12, 'active'),
('GoPro Hero 13 Black', 'gopro-hero-13-black', 'GPH13B', 11990000, 10990000, 'GoPro Hero 13 Black - Action camera 5.3K, GPS, HB-Series lens', '/images/products/gopro-hero-13.jpg', 20, 28, 700, 10, 3, TRUE, TRUE, 12, 'active'),
('Insta360 X4', 'insta360-x4', 'IN360X4', 14990000, NULL, 'Insta360 X4 - Camera 360 8K, ảnh 72MP, pin 2290mAh', '/images/products/insta360-x4.jpg', 12, 15, 400, 10, 11, FALSE, TRUE, 12, 'active');

-- =====================================================
-- PRODUCT_IMAGES - Ảnh gallery cho sản phẩm
-- =====================================================

-- iPhone 16 Pro Max (4 ảnh)
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
(1, '/images/products/iphone-16-pro-max-1.jpg', 'iPhone 16 Pro Max mặt trước', 0, TRUE),
(1, '/images/products/iphone-16-pro-max-2.jpg', 'iPhone 16 Pro Max mặt sau', 1, FALSE),
(1, '/images/products/iphone-16-pro-max-3.jpg', 'iPhone 16 Pro Max camera', 2, FALSE),
(1, '/images/products/iphone-16-pro-max-4.jpg', 'iPhone 16 Pro Max cạnh', 3, FALSE);

-- MacBook Air M4 (3 ảnh)
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
(10, '/images/products/macbook-air-m4-1.jpg', 'MacBook Air M4 Space Gray', 0, TRUE),
(10, '/images/products/macbook-air-m4-2.jpg', 'MacBook Air M4 mở nắp', 1, FALSE),
(10, '/images/products/macbook-air-m4-3.jpg', 'MacBook Air M4 cạnh', 2, FALSE);

-- Samsung Galaxy S25 Ultra (3 ảnh)
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
(4, '/images/products/galaxy-s25-ultra-1.jpg', 'Galaxy S25 Ultra Titanium Black', 0, TRUE),
(4, '/images/products/galaxy-s25-ultra-2.jpg', 'Galaxy S25 Ultra camera', 1, FALSE),
(4, '/images/products/galaxy-s25-ultra-3.jpg', 'Galaxy S25 Ultra S Pen', 2, FALSE);

-- AirPods Pro 2 (3 ảnh)
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
(31, '/images/products/airpods-pro-2-1.jpg', 'AirPods Pro 2 với hộp sạc', 0, TRUE),
(31, '/images/products/airpods-pro-2-2.jpg', 'AirPods Pro 2 bên trong', 1, FALSE),
(31, '/images/products/airpods-pro-2-3.jpg', 'AirPods Pro 2 đeo tai', 2, FALSE);

-- =====================================================
-- PAYMENT_METHODS - 2 phương thức thanh toán
-- =====================================================

INSERT INTO payment_methods (name, code, description, icon, instructions, fee_percentage, is_active, display_order) VALUES
('Thanh toán khi nhận hàng (COD)', 'cod', 'Thanh toán bằng tiền mặt khi nhận được hàng', '/images/payment/cod-icon.png', 'Quý khách vui lòng chuẩn bị sẵn số tiền theo đơn hàng khi nhận hàng. Nhân viên giao hàng sẽ thu tiền và giao hàng cho quý khách.', 0, TRUE, 1),
('Chuyển khoản ngân hàng', 'bank_transfer', 'Thanh toán bằng chuyển khoản qua tài khoản ngân hàng', '/images/payment/bank-icon.png', 'Chuyển khoản đến STK: 1234567890 - Ngân hàng Vietcombank - Chủ tài khoản: Công ty TNHH AKStore. Nội dung: [Mã đơn hàng]', 0, TRUE, 2);

-- =====================================================
-- CARTS & CART_ITEMS - Giỏ hàng mẫu
-- =====================================================
-- Lưu ý: Trigger đã tự động tạo carts cho users

-- Thêm items vào cart của user 2 (Trần Thị Bình)
INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES
(2, 1, 1, 32990000),  -- iPhone 16 Pro Max
(2, 31, 1, 7990000);  -- AirPods Pro 2

-- Thêm items vào cart của user 3 (Lê Minh Cường)
INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES
(3, 10, 1, 27990000),  -- MacBook Air M4
(3, 35, 1, 3290000);   -- Logitech MX Master 3S

-- Thêm items vào cart của user 4 (Phạm Thu Hà)
INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES
(4, 21, 1, 37990000),  -- iPad Pro 13 inch M4
(4, 28, 1, 11990000),  -- Apple Watch Series 10
(4, 4, 1, 32990000);   -- Samsung Galaxy S25 Ultra

-- Thêm items vào cart của user 5 (Hoàng Đình Dũng)
INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES
(5, 16, 1, 54990000),  -- ASUS ROG Zephyrus G16
(5, 41, 1, 9990000);   -- Sony WH-1000XM5

-- =====================================================
-- ORDERS - 25 đơn hàng mẫu (tăng từ 20 lên 25)
-- =====================================================

-- Đơn hàng 1: User 2 - Hoàn thành
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260601-00001', 2, 'Trần Thị Bình', '0912345678', '45 Đường Nguyễn Huệ, Quận 1', 'TP. Hồ Chí Minh', 'Quận 1', 'Giao giờ hành chính', 34990000, 0, 0, 34990000, 1, 'paid', 'delivered', '2026-06-02 14:00:00', '2026-06-01 10:30:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(1, 1, 'iPhone 16 Pro Max 256GB', 'IP16PM256', '/images/products/iphone-16-pro-max.jpg', 32990000, 1, 0, 32990000);

-- Đơn hàng 2: User 2 - Hoàn thành (2 sản phẩm)
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260603-00002', 2, 'Trần Thị Bình', '0912345678', '45 Đường Nguyễn Huệ, Quận 1', 'TP. Hồ Chí Minh', 'Quận 1', '', 16990000, 0, 500000, 16490000, 1, 'paid', 'delivered', '2026-06-04 16:30:00', '2026-06-03 14:20:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(2, 31, 'AirPods Pro 2', 'APP2', '/images/products/airpods-pro-2.jpg', 7990000, 1, 0, 7990000),
(2, 35, 'Logitech MX Master 3S', 'LGMXM3S', '/images/products/mx-master-3s.jpg', 3290000, 1, 0, 3290000),
(2, 43, 'Anker 737 Power Bank 24000mAh', 'ANKP737', '/images/products/anker-737.jpg', 3490000, 1, 500000, 2990000);

-- Đơn hàng 3: User 3 - Hoàn thành
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260605-00003', 3, 'Lê Minh Cường', '0923456789', '78 Đường Trần Hưng Đạo, Quận 5', 'TP. Hồ Chí Minh', 'Quận 5', 'Giao buổi chiều 2-5h', 27990000, 0, 0, 27990000, 1, 'paid', 'delivered', '2026-06-06 15:00:00', '2026-06-05 09:15:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(3, 10, 'MacBook Air M4 13 inch 256GB', 'MBA-M4-13', '/images/products/macbook-air-m4.jpg', 27990000, 1, 0, 27990000);

-- Đơn hàng 4: User 4 - Hoàn thành (2 sản phẩm)
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260610-00004', 4, 'Phạm Thu Hà', '0934567890', '156 Đường Điện Biên Phủ, Quận Bình Thạnh', 'TP. Hồ Chí Minh', 'Bình Thạnh', 'Cẩn thận hàng dễ vỡ', 49990000, 0, 1000000, 48990000, 1, 'paid', 'delivered', '2026-06-11 11:00:00', '2026-06-10 16:45:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(4, 21, 'iPad Pro 13 inch M4', 'IPDP13M4', '/images/products/ipad-pro-13.jpg', 37990000, 1, 0, 37990000),
(4, 27, 'Apple Watch Ultra 2', 'AWU2', '/images/products/apple-watch-ultra-2.jpg', 21990000, 1, 1000000, 20990000);

-- Đơn hàng 5: User 5 - Đang giao
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, created_at) VALUES
('AK-20260615-00005', 5, 'Hoàng Đình Dũng', '0945678901', '234 Đường Cái Khế, Quận Ninh Kiều', 'Cần Thơ', 'Ninh Kiều', 'Gọi điện trước khi giao', 32990000, 30000, 0, 33020000, 1, 'pending', 'shipping', '2026-06-15 11:20:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(5, 4, 'Samsung Galaxy S25 Ultra 256GB', 'SGS25U256', '/images/products/galaxy-s25-ultra.jpg', 32990000, 1, 0, 32990000);

-- Đơn hàng 6: User 2 - Đang xử lý
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, created_at) VALUES
('AK-20260618-00006', 2, 'Trần Thị Bình', '0912345678', '45 Đường Nguyễn Huệ, Quận 1', 'TP. Hồ Chí Minh', 'Quận 1', '', 21990000, 0, 0, 21990000, 1, 'pending', 'processing', '2026-06-18 08:30:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(6, 3, 'iPhone 15 128GB', 'IP15128', '/images/products/iphone-15.jpg', 19990000, 1, 0, 19990000);

-- Đơn hàng 7: Khách lẻ - Hoàn thành
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260620-00007', NULL, 'Nguyễn Văn Minh', '0977888999', '89 Đường 3/2, Quận 10', 'TP. Hồ Chí Minh', 'Quận 10', 'Để cổng chính', 13990000, 25000, 0, 14015000, 1, 'paid', 'delivered', '2026-06-21 10:00:00', '2026-06-20 14:00:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(7, 17, 'ASUS VivoBook 15', 'ASVB15', '/images/products/vivobook-15.jpg', 13990000, 1, 0, 13990000);

-- Đơn hàng 8: User 3 - Đã xác nhận (chuyển khoản)
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, created_at) VALUES
('AK-20260622-00008', 3, 'Lê Minh Cường', '0923456789', '78 Đường Trần Hưng Đạo, Quận 5', 'TP. Hồ Chí Minh', 'Quận 5', '', 49990000, 0, 2000000, 47990000, 2, 'paid', 'confirmed', '2026-06-22 10:15:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(8, 11, 'MacBook Pro 14 inch M4 Pro', 'MBP14-M4P', '/images/products/macbook-pro-14.jpg', 47990000, 1, 2000000, 45990000);

-- Đơn hàng 9: Khách lẻ - Đang chờ
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, created_at) VALUES
('AK-20260625-00009', NULL, 'Trương Thị Lan', '0987654321', '123 Đường Lý Thường Kiệt, Quận Tân Bình', 'TP. Hồ Chí Minh', 'Tân Bình', 'Giao vào buổi sáng', 8990000, 25000, 0, 9015000, 1, 'pending', 'pending', '2026-06-25 16:30:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(9, 6, 'Samsung Galaxy A55 5G 128GB', 'SGA55', '/images/products/galaxy-a55.jpg', 8990000, 1, 0, 8990000);

-- Đơn hàng 10: User 4 - Đang giao (2 sản phẩm)
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, created_at) VALUES
('AK-20260626-00010', 4, 'Phạm Thu Hà', '0934567890', '156 Đường Điện Biên Phủ, Quận Bình Thạnh', 'TP. Hồ Chí Minh', 'Bình Thạnh', '', 44990000, 0, 0, 44990000, 1, 'pending', 'shipping', '2026-06-26 09:45:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(10, 5, 'Samsung Galaxy Z Fold6 512GB', 'SGFOLD6', '/images/products/galaxy-z-fold6.jpg', 38990000, 1, 0, 38990000),
(10, 39, 'Samsung T9 Portable SSD 2TB', 'SGT9-2TB', '/images/products/samsung-t9.jpg', 4490000, 1, 0, 4490000);

-- Đơn hàng 11: User 2 - Hoàn thành
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260627-00011', 2, 'Trần Thị Bình', '0912345678', '45 Đường Nguyễn Huệ, Quận 1', 'TP. Hồ Chí Minh', 'Quận 1', '', 9990000, 0, 0, 9990000, 1, 'paid', 'delivered', '2026-06-28 14:00:00', '2026-06-27 11:00:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(11, 23, 'Samsung Galaxy Tab S10 Ultra', 'SGTS10U', '/images/products/galaxy-tab-s10-ultra.jpg', 29990000, 1, 0, 29990000);

-- Đơn hàng 12: User 3 - Hoàn thành
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260628-00012', 3, 'Lê Minh Cường', '0923456789', '78 Đường Trần Hưng Đạo, Quận 5', 'TP. Hồ Chí Minh', 'Quận 5', '', 11990000, 0, 0, 11990000, 1, 'paid', 'delivered', '2026-06-29 10:30:00', '2026-06-28 14:30:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(12, 9, 'Xiaomi 14 Ultra 512GB', 'XM14U512', '/images/products/xiaomi-14-ultra.jpg', 25990000, 1, 0, 25990000);

-- Đơn hàng 13: User 4 - Hoàn thành
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260629-00013', 4, 'Phạm Thu Hà', '0934567890', '156 Đường Điện Biên Phủ, Quận Bình Thạnh', 'TP. Hồ Chí Minh', 'Bình Thạnh', '', 29990000, 0, 500000, 29490000, 1, 'paid', 'delivered', '2026-06-30 11:00:00', '2026-06-29 10:00:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(13, 16, 'ASUS ROG Zephyrus G16', 'ASROGG16', '/images/products/rog-zephyrus-g16.jpg', 54990000, 1, 500000, 54490000);

-- Đơn hàng 14: User 5 - Hoàn thành
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260630-00014', 5, 'Hoàng Đình Dũng', '0945678901', '234 Đường Cái Khế, Quận Ninh Kiều', 'Cần Thơ', 'Ninh Kiều', '', 19990000, 30000, 0, 20020000, 1, 'paid', 'delivered', '2026-07-01 15:00:00', '2026-06-30 15:45:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(14, 22, 'iPad Air 11 inch M2', 'IPDA11M2', '/images/products/ipad-air-11.jpg', 18490000, 1, 0, 18490000);

-- Đơn hàng 15: User 2 - Hoàn thành
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260701-00015', 2, 'Trần Thị Bình', '0912345678', '45 Đường Nguyễn Huệ, Quận 1', 'TP. Hồ Chí Minh', 'Quận 1', '', 3990000, 0, 0, 3990000, 1, 'paid', 'delivered', '2026-07-02 10:00:00', '2026-07-01 09:30:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(15, 36, 'Sony WH-1000XM5', 'SNYWH1000XM5', '/images/products/sony-wh-1000xm5.jpg', 8990000, 1, 0, 8990000);

-- Đơn hàng 16: User 3 - Hoàn thành
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260701-00016', 3, 'Lê Minh Cường', '0923456789', '78 Đường Trần Hưng Đạo, Quận 5', 'TP. Hồ Chí Minh', 'Quận 5', '', 6990000, 0, 200000, 6790000, 1, 'paid', 'delivered', '2026-07-02 14:00:00', '2026-07-01 13:20:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(16, 8, 'Xiaomi Redmi Note 13 Pro 5G', 'XMRN13P', '/images/products/redmi-note-13-pro.jpg', 6990000, 1, 200000, 6790000);

-- Đơn hàng 17: User 4 - Hoàn thành
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260702-00017', 4, 'Phạm Thu Hà', '0934567890', '156 Đường Điện Biên Phủ, Quận Bình Thạnh', 'TP. Hồ Chí Minh', 'Bình Thạnh', '', 27990000, 0, 0, 27990000, 1, 'paid', 'delivered', '2026-07-03 11:00:00', '2026-07-02 11:15:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(17, 29, 'Samsung Galaxy Watch Ultra', 'SGGWU', '/images/products/galaxy-watch-ultra.jpg', 13990000, 1, 0, 13990000);

-- Đơn hàng 18: User 5 - Hoàn thành
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260702-00018', 5, 'Hoàng Đình Dũng', '0945678901', '234 Đường Cái Khế, Quận Ninh Kiều', 'Cần Thơ', 'Ninh Kiều', '', 10990000, 35000, 0, 11025000, 1, 'paid', 'delivered', '2026-07-03 16:00:00', '2026-07-02 16:00:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(18, 25, 'Apple Watch Series 10 46mm', 'AWS10', '/images/products/apple-watch-s10.jpg', 10990000, 1, 0, 10990000);

-- Đơn hàng 19: User 2 - Đang xử lý
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, created_at) VALUES
('AK-20260703-00019', 2, 'Trần Thị Bình', '0912345678', '45 Đường Nguyễn Huệ, Quận 1', 'TP. Hồ Chí Minh', 'Quận 1', '', 4990000, 0, 0, 4990000, 1, 'pending', 'processing', '2026-07-03 08:45:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(19, 38, 'Logitech G915 TKL', 'LGG915TKL', '/images/products/g915-tkl.jpg', 7990000, 1, 0, 7990000);

-- Đơn hàng 20: User 3 - Đang chờ
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, created_at) VALUES
('AK-20260703-00020', 3, 'Lê Minh Cường', '0923456789', '78 Đường Trần Hưng Đạo, Quận 5', 'TP. Hồ Chí Minh', 'Quận 5', '', 14990000, 0, 0, 14990000, 1, 'pending', 'pending', '2026-07-03 10:30:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(20, 50, 'Sony ZV-1 II', 'SNYZV1II', '/images/products/sony-zv-1-ii.jpg', 14990000, 1, 0, 14990000);

-- Đơn hàng 21: User 4 - Hoàn thành (3 sản phẩm)
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260703-00021', 4, 'Phạm Thu Hà', '0934567890', '156 Đường Điện Biên Phủ, Quận Bình Thạnh', 'TP. Hồ Chí Minh', 'Bình Thạnh', 'Mua kèm deal rẻ', 16990000, 0, 500000, 16490000, 1, 'paid', 'delivered', '2026-07-03 15:00:00', '2026-07-03 11:00:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(21, 34, 'Samsung Galaxy Buds3 Pro', 'SGBP3P', '/images/products/galaxy-buds3-pro.jpg', 5990000, 1, 0, 5990000),
(21, 43, 'Samsung 990 Pro 2TB NVMe', 'SGS990P2TB', '/images/products/samsung-990-pro.jpg', 5990000, 1, 0, 5990000),
(21, 44, 'Spigen Ultra Hybrid iPhone 16 Pro Max', 'SPGH-IP16PM', '/images/products/spigen-ultra-hybrid.jpg', 390000, 1, 0, 390000);

-- Đơn hàng 22: User 5 - Đã xác nhận
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, created_at) VALUES
('AK-20260703-00022', 5, 'Hoàng Đình Dũng', '0945678901', '234 Đường Cái Khế, Quận Ninh Kiều', 'Cần Thơ', 'Ninh Kiều', '', 22990000, 35000, 1000000, 22325000, 1, 'paid', 'confirmed', '2026-07-03 12:00:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(22, 33, 'Dell UltraSharp U3223QE', 'DLU3223QE', '/images/products/dell-u3223qe.jpg', 19990000, 1, 1000000, 18990000);

-- Đơn hàng 23: Khách lẻ - Hoàn thành
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260703-00023', NULL, 'Võ Thị Mai', '0966554433', '567 Đường Nam Kỳ Khởi Nghĩa, Quận 3', 'TP. Hồ Chí Minh', 'Quận 3', '', 5990000, 25000, 0, 6015000, 1, 'paid', 'delivered', '2026-07-03 14:00:00', '2026-07-03 13:30:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(23, 41, 'Logitech Brio 4K Pro', 'LGBRIO4K', '/images/products/logitech-brio-4k.jpg', 5490000, 1, 0, 5490000);

-- Đơn hàng 24: User 2 - Hủy
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, cancelled_reason, created_at) VALUES
('AK-20260703-00024', 2, 'Trần Thị Bình', '0912345678', '45 Đường Nguyễn Huệ, Quận 1', 'TP. Hồ Chí Minh', 'Quận 1', 'Hủy vì đặt nhầm', 34990000, 0, 0, 34990000, 1, 'refunded', 'cancelled', 'Khách đặt nhầm sản phẩm', '2026-07-03 14:00:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(24, 2, 'iPhone 16 Pro 128GB', 'IP16P128', '/images/products/iphone-16-pro.jpg', 28990000, 1, 0, 28990000);

-- Đơn hàng 25: User 3 - Hoàn thành (2 sản phẩm)
INSERT INTO orders (order_code, user_id, receiver_name, receiver_phone, receiver_address, receiver_city, receiver_district, note, subtotal, shipping_fee, discount_amount, total_price, payment_method_id, payment_status, order_status, delivered_at, created_at) VALUES
('AK-20260703-00025', 3, 'Lê Minh Cường', '0923456789', '78 Đường Trần Hưng Đạo, Quận 5', 'TP. Hồ Chí Minh', 'Quận 5', 'Quà tặng', 15990000, 0, 0, 15990000, 1, 'paid', 'delivered', '2026-07-03 17:00:00', '2026-07-03 15:00:00');

INSERT INTO order_details (order_id, product_id, product_name, product_sku, product_image, price, quantity, discount_amount, subtotal) VALUES
(25, 32, 'AirPods Max', 'APM', '/images/products/airpods-max.jpg', 15990000, 1, 0, 15990000);

-- =====================================================
-- BANNERS - 10 banner trang chủ
-- =====================================================

INSERT INTO banners (title, subtitle, image_url, link, link_type, target_id, display_order, status, start_date, end_date) VALUES
('iPhone 16 Series', 'Khám phá thế hệ iPhone mới nhất', '/images/banner/iphone-16-launch.jpg', '/products/iphone-16-pro-max-256gb', 'product', 1, 1, 'active', '2026-06-15 00:00:00', '2026-08-31 23:59:59'),
('MacBook Air M4', 'Siêu nhẹ - Siêu mạnh - Siêu pin', '/images/banner/macbook-air-m4.jpg', '/products/macbook-air-m4-13', 'product', 10, 2, 'active', '2026-06-01 00:00:00', '2026-12-31 23:59:59'),
('Samsung Galaxy S25 Ultra', 'AI tương lai - Trong tầm tay', '/images/banner/galaxy-s25-ultra.jpg', '/products/samsung-galaxy-s25-ultra', 'product', 4, 3, 'active', '2026-06-10 00:00:00', '2026-09-30 23:59:59'),
('AirPods Pro 2', 'Âm thanh đỉnh cao - Chống ồn thông minh', '/images/banner/airpods-pro-2.jpg', '/products/airpods-pro-2', 'product', 31, 4, 'active', '2026-06-01 00:00:00', '2026-12-31 23:59:59'),
('Apple Watch Series 10', 'Màn hình lớn hơn - Sạc nhanh hơn', '/images/banner/apple-watch-s10.jpg', '/products/apple-watch-series-10', 'product', 26, 5, 'active', '2026-06-01 00:00:00', '2026-12-31 23:59:59'),
('iPad Pro M4', 'Chip M4 - Hiệu năng không giới hạn', '/images/banner/ipad-pro-m4.jpg', '/products/ipad-pro-13-m4', 'product', 21, 6, 'active', '2026-06-15 00:00:00', '2026-08-31 23:59:59'),
('Samsung Galaxy Z Fold6', 'Gập mở - Không giới hạn', '/images/banner/galaxy-z-fold6.jpg', '/products/samsung-galaxy-z-fold6', 'product', 5, 7, 'active', '2026-06-20 00:00:00', '2026-09-30 23:59:59'),
('Laptop Gaming', 'Ưu đãi gaming gear - Giảm đến 15%', '/images/banner/laptop-gaming-sale.jpg', '/categories/laptop', 'category', 2, 8, 'active', '2026-07-01 00:00:00', '2026-07-31 23:59:59'),
('Samsung 990 Pro SSD', 'Tốc độ vượt trội - Lưu trữ an toàn', '/images/banner/samsung-ssd.jpg', '/products/samsung-990-pro-2tb', 'product', 43, 9, 'active', '2026-06-01 00:00:00', '2026-12-31 23:59:59'),
('Sony WH-1000XM5', 'Chống ồn tốt nhất thế giới', '/images/banner/sony-wh1000xm5.jpg', '/products/sony-wh-1000xm5', 'product', 35, 10, 'active', '2026-06-01 00:00:00', '2026-12-31 23:59:59');

-- =====================================================
-- Cập nhật thống kê cho sản phẩm đã bán
-- =====================================================

UPDATE products SET sold_count = 120 WHERE id = 1;
UPDATE products SET sold_count = 85 WHERE id = 2;
UPDATE products SET sold_count = 200 WHERE id = 3;
UPDATE products SET sold_count = 90 WHERE id = 4;
UPDATE products SET sold_count = 45 WHERE id = 5;
UPDATE products SET sold_count = 150 WHERE id = 6;
UPDATE products SET sold_count = 75 WHERE id = 10;
UPDATE products SET sold_count = 40 WHERE id = 11;
UPDATE products SET sold_count = 28 WHERE id = 16;
UPDATE products SET sold_count = 50 WHERE id = 21;
UPDATE products SET sold_count = 60 WHERE id = 22;
UPDATE products SET sold_count = 25 WHERE id = 23;
UPDATE products SET sold_count = 50 WHERE id = 26;
UPDATE products SET sold_count = 30 WHERE id = 27;
UPDATE products SET sold_count = 80 WHERE id = 28;
UPDATE products SET sold_count = 150 WHERE id = 31;
UPDATE products SET sold_count = 45 WHERE id = 32;
UPDATE products SET sold_count = 100 WHERE id = 34;
UPDATE products SET sold_count = 65 WHERE id = 35;
UPDATE products SET sold_count = 70 WHERE id = 36;
UPDATE products SET sold_count = 85 WHERE id = 39;
UPDATE products SET sold_count = 55 WHERE id = 41;
UPDATE products SET sold_count = 55 WHERE id = 50;

-- =====================================================
-- KẾT THÚC SEED DATA V2.0
-- =====================================================
