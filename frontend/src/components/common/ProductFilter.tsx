import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui';
import { useCategories, useBrands } from '@/hooks/useProducts';

interface FilterState {
  categoryIds: number[];
  brandIds: number[];
  minPrice: string;
  maxPrice: string;
  hasDiscount: boolean;
  isFeatured: boolean;
  inStock: boolean;
}

interface ProductFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClear: () => void;
}

export const ProductFilter = ({ filters, onFilterChange, onClear }: ProductFilterProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'brand']);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const { data: categoriesData } = useCategories();
  const { data: brandsData } = useBrands();
  
  // Ensure categories and brands are always arrays
  const categories = Array.isArray(categoriesData) ? categoriesData : [];
  const brands = Array.isArray(brandsData) ? brandsData : [];

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleCategoryToggle = (id: number) => {
    const newCategories = filters.categoryIds.includes(id)
      ? filters.categoryIds.filter((c) => c !== id)
      : [...filters.categoryIds, id];
    onFilterChange({ ...filters, categoryIds: newCategories });
  };

  const handleBrandToggle = (id: number) => {
    const newBrands = filters.brandIds.includes(id)
      ? filters.brandIds.filter((b) => b !== id)
      : [...filters.brandIds, id];
    onFilterChange({ ...filters, brandIds: newBrands });
  };

  const hasActiveFilters =
    filters.categoryIds.length > 0 ||
    filters.brandIds.length > 0 ||
    filters.hasDiscount ||
    filters.isFeatured ||
    filters.inStock ||
    filters.minPrice ||
    filters.maxPrice;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-primary text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2"
      >
        <SlidersHorizontal className="w-5 h-5" />
        <span>Bộ lọc</span>
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Filter Panel */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: isMobileOpen ? 0 : 0, opacity: 1 }}
        className={`
          fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
          w-80 lg:w-64 bg-white lg:bg-transparent
          transform transition-transform duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="h-full overflow-y-auto lg:h-auto bg-white lg:bg-transparent rounded-xl shadow-lg lg:shadow-none p-4 lg:p-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h3 className="font-semibold text-lg">Bộ lọc</h3>
            <button onClick={() => setIsMobileOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="w-full mb-4 text-primary hover:text-primary-700 text-sm font-medium text-left"
            >
              Xóa tất cả bộ lọc
            </button>
          )}

          {/* Categories */}
          <FilterSection
            title="Danh mục"
            isExpanded={expandedSections.includes('category')}
            onToggle={() => toggleSection('category')}
          >
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 cursor-pointer hover:text-primary"
                >
                  <input
                    type="checkbox"
                    checked={filters.categoryIds.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 rounded border-accent-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-accent-700">{category.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Brands */}
          <FilterSection
            title="Thương hiệu"
            isExpanded={expandedSections.includes('brand')}
            onToggle={() => toggleSection('brand')}
          >
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((brand) => (
                <label
                  key={brand.id}
                  className="flex items-center gap-2 cursor-pointer hover:text-primary"
                >
                  <input
                    type="checkbox"
                    checked={filters.brandIds.includes(brand.id)}
                    onChange={() => handleBrandToggle(brand.id)}
                    className="w-4 h-4 rounded border-accent-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-accent-700">{brand.name}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          {/* Price Range */}
          <FilterSection
            title="Khoảng giá"
            isExpanded={expandedSections.includes('price')}
            onToggle={() => toggleSection('price')}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Từ"
                  value={filters.minPrice}
                  onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-primary focus:border-primary"
                />
                <span className="text-accent-400">-</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={filters.maxPrice}
                  onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-accent-200 rounded-lg text-sm focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </FilterSection>

          {/* Special Filters */}
          <FilterSection title="Đặc biệt" isExpanded={true} onToggle={() => toggleSection('special')}>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
                <input
                  type="checkbox"
                  checked={filters.hasDiscount}
                  onChange={(e) => onFilterChange({ ...filters, hasDiscount: e.target.checked })}
                  className="w-4 h-4 rounded border-accent-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-accent-700">Sản phẩm giảm giá</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
                <input
                  type="checkbox"
                  checked={filters.isFeatured}
                  onChange={(e) => onFilterChange({ ...filters, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-accent-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-accent-700">Sản phẩm nổi bật</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:text-primary">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => onFilterChange({ ...filters, inStock: e.target.checked })}
                  className="w-4 h-4 rounded border-accent-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-accent-700">Còn hàng</span>
              </label>
            </div>
          </FilterSection>

          {/* Apply Button (Mobile) */}
          <div className="lg:hidden mt-4">
            <Button className="w-full" onClick={() => setIsMobileOpen(false)}>
              Áp dụng ({categories.length + brands.length} bộ lọc)
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSection = ({ title, isExpanded, onToggle, children }: FilterSectionProps) => (
  <div className="border-b border-accent-100 py-4">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full text-left"
    >
      <span className="font-semibold text-accent-900">{title}</span>
      <ChevronDown
        className={`w-4 h-4 text-accent-400 transition-transform ${
          isExpanded ? 'rotate-180' : ''
        }`}
      />
    </button>
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="mt-3 overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
