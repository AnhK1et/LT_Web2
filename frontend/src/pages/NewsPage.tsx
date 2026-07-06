import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, ArrowRight, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui';

const categories = [
  { id: 1, name: 'Apple', slug: 'apple', color: 'bg-gray-800' },
  { id: 2, name: 'Samsung', slug: 'samsung', color: 'bg-blue-600' },
  { id: 3, name: 'Xiaomi', slug: 'xiaomi', color: 'bg-orange-500' },
  { id: 4, name: 'Laptop', slug: 'laptop', color: 'bg-purple-600' },
  { id: 5, name: 'Gaming', slug: 'gaming', color: 'bg-red-600' },
  { id: 6, name: 'AI', slug: 'ai', color: 'bg-green-600' },
];

const mockNews = [
  {
    id: 1,
    title: 'iPhone 16 Pro Max ra mắt với chip A18 Pro và camera 48MP',
    slug: 'iphone-16-pro-max-ra-mat',
    excerpt: 'Apple chính thức ra mắt iPhone 16 Pro Max với nhiều cải tiến về camera, hiệu năng và thời lượng pin.',
    content: 'Apple đã chính thức công bố iPhone 16 Pro Max...',
    thumbnail: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
    category: categories[0],
    author: 'AKStore',
    publishedAt: '2024-01-15',
    views: 15420,
    featured: true,
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24 Ultra: Siêu phẩm với AI Gemini',
    slug: 'samsung-galaxy-s24-ultra',
    excerpt: 'Galaxy S24 Ultra được trang bị AI Gemini, camera 200MP và bút S Pen tích hợp.',
    thumbnail: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
    category: categories[1],
    author: 'AKStore',
    publishedAt: '2024-01-14',
    views: 12350,
    featured: false,
  },
  {
    id: 3,
    title: 'Xiaomi 14 Pro: Snapdragon 8 Gen 3 và Leica Camera',
    slug: 'xiaomi-14-pro',
    excerpt: 'Xiaomi 14 Pro sở hữu Snapdragon 8 Gen 3 mạnh mẽ cùng hệ thống camera Leica cao cấp.',
    thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
    category: categories[2],
    author: 'AKStore',
    publishedAt: '2024-01-13',
    views: 8960,
    featured: false,
  },
  {
    id: 4,
    title: 'MacBook Pro M3 Max: Sức mạnh không giới hạn',
    slug: 'macbook-pro-m3-max',
    excerpt: 'MacBook Pro M3 Max với chip M3 Max, màn hình Liquid Retina XDR và thời lượng pin 22 giờ.',
    thumbnail: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    category: categories[3],
    author: 'AKStore',
    publishedAt: '2024-01-12',
    views: 11230,
    featured: false,
  },
  {
    id: 5,
    title: 'ASUS ROG Phone 8: Điện thoại gaming tốt nhất 2024',
    slug: 'asus-rog-phone-8',
    excerpt: 'ROG Phone 8 với Snapdragon 8 Gen 3, tản nhiệt GameCool 8 và màn hình 165Hz.',
    thumbnail: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80',
    category: categories[4],
    author: 'AKStore',
    publishedAt: '2024-01-11',
    views: 7650,
    featured: false,
  },
  {
    id: 6,
    title: 'ChatGPT-5 và tương lai của AI trong điện thoại',
    slug: 'chatgpt-5-va-ai',
    excerpt: 'OpenAI công bố ChatGPT-5 với khả năng hiểu ngữ cảnh vượt trội và tích hợp vào smartphone.',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    category: categories[5],
    author: 'AKStore',
    publishedAt: '2024-01-10',
    views: 18900,
    featured: false,
  },
  {
    id: 7,
    title: 'iPad Pro 2024: M4 Chip và màn hình OLED',
    slug: 'ipad-pro-2024',
    excerpt: 'iPad Pro thế hệ mới với chip M4, màn hình OLED và hỗ trợ Apple Pencil Pro.',
    thumbnail: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    category: categories[0],
    author: 'AKStore',
    publishedAt: '2024-01-09',
    views: 9870,
    featured: false,
  },
  {
    id: 8,
    title: 'Samsung Galaxy Z Fold 5: Điện thoại gập hoàn hảo',
    slug: 'samsung-galaxy-z-fold-5',
    excerpt: 'Galaxy Z Fold 5 với bản lề mới, màn hình lớn hơn và hiệu năng mạnh mẽ.',
    thumbnail: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80',
    category: categories[1],
    author: 'AKStore',
    publishedAt: '2024-01-08',
    views: 6540,
    featured: false,
  },
  {
    id: 9,
    title: 'Cách chọn laptop phù hợp cho sinh viên 2024',
    slug: 'cach-chon-laptop-cho-sinh-vien',
    excerpt: 'Hướng dẫn chi tiết cách chọn laptop phù hợp với nhu cầu học tập và ngân sách.',
    thumbnail: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    category: categories[3],
    author: 'AKStore',
    publishedAt: '2024-01-07',
    views: 22340,
    featured: false,
  },
  {
    id: 10,
    title: 'Redmi Note 13 Pro+: Camera 200MP trong tầm giá',
    slug: 'redmi-note-13-pro-plus',
    excerpt: 'Redmi Note 13 Pro+ gây ấn tượng với camera 200MP, sạc nhanh 120W và giá hấp dẫn.',
    thumbnail: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
    category: categories[2],
    author: 'AKStore',
    publishedAt: '2024-01-06',
    views: 8120,
    featured: false,
  },
];

const popularNews = [...mockNews].sort((a, b) => b.views - a.views).slice(0, 5);

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const featuredArticle = mockNews.find((news) => news.featured);
  const filteredNews = mockNews.filter((news) => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || news.category.slug === selectedCategory;
    return matchesSearch && matchesCategory && !news.featured;
  });

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
            Tin công nghệ
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center text-white/80 mt-2"
          >
            Cập nhật tin tức công nghệ mới nhất
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Article */}
            {featuredArticle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  to={`/news/${featuredArticle.slug}`}
                  className="block bg-white rounded-2xl shadow-card overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={featuredArticle.thumbnail}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`${featuredArticle.category.color} text-white text-xs font-medium px-3 py-1 rounded-full`}>
                        {featuredArticle.category.name}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h2 className="text-xl md:text-2xl font-bold mb-2">{featuredArticle.title}</h2>
                      <p className="text-white/80 line-clamp-2">{featuredArticle.excerpt}</p>
                      <div className="flex items-center gap-4 mt-4 text-sm text-white/70">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(featuredArticle.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {featuredArticle.views.toLocaleString()} lượt xem
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* News Grid */}
            <div>
              <h2 className="text-xl font-bold text-accent-900 mb-6">Bài viết mới nhất</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {paginatedNews.map((news, index) => (
                  <motion.article
                    key={news.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={`/news/${news.slug}`}
                      className="block bg-white rounded-2xl shadow-card overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={news.thumbnail}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`${news.category.color} text-white text-xs font-medium px-2 py-1 rounded-full`}>
                            {news.category.name}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-accent-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {news.title}
                        </h3>
                        <p className="text-sm text-accent-600 line-clamp-2 mb-3">
                          {news.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-accent-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(news.publishedAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {news.views.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg bg-white shadow-card flex items-center justify-center text-accent-600 hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg shadow-card flex items-center justify-center font-medium transition-colors ${
                      currentPage === i + 1
                        ? 'bg-primary text-white'
                        : 'bg-white text-accent-600 hover:bg-primary hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg bg-white shadow-card flex items-center justify-center text-accent-600 hover:bg-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <h3 className="font-bold text-accent-900 mb-4">Tìm kiếm</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm tin tức..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-3 pl-10 border border-accent-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-400" />
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <h3 className="font-bold text-accent-900 mb-4">Chủ đề</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !selectedCategory
                      ? 'bg-primary text-white'
                      : 'bg-accent-100 text-accent-700 hover:bg-primary hover:text-white'
                  }`}
                >
                  Tất cả
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === cat.slug
                        ? 'bg-primary text-white'
                        : 'bg-accent-100 text-accent-700 hover:bg-primary hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Popular News */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-card p-6"
            >
              <h3 className="font-bold text-accent-900 mb-4">Tin nổi bật</h3>
              <div className="space-y-4">
                {popularNews.map((news, index) => (
                  <Link
                    key={news.id}
                    to={`/news/${news.slug}`}
                    className="flex gap-3 group"
                  >
                    <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-accent-900 line-clamp-2 group-hover:text-primary transition-colors">
                        {news.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-accent-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {news.views.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-primary to-red-700 rounded-2xl p-6 text-white"
            >
              <h3 className="font-bold text-lg mb-2">Khám phá sản phẩm</h3>
              <p className="text-white/80 text-sm mb-4">
                Cập nhật tin tức công nghệ và sở hữu thiết bị mới nhất
              </p>
              <Link to="/products">
                <Button className="w-full bg-white text-primary hover:bg-white/90">
                  Xem sản phẩm
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
