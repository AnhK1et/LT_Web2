import { useState, useEffect, useCallback } from 'react';
import { Search, Grid3X3, LayoutList, X } from 'lucide-react';
import { Select } from '@/components/ui';
import { debounce } from '@/utils';

interface ProductToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalResults: number;
}

const sortOptions = [
  { value: 'createdAt,desc', label: 'Mới nhất' },
  { value: 'price,asc', label: 'Giá: Thấp đến Cao' },
  { value: 'price,desc', label: 'Giá: Cao đến Thấp' },
  { value: 'name,asc', label: 'Tên: A đến Z' },
  { value: 'name,desc', label: 'Tên: Z đến A' },
];

export const ProductToolbar = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults,
}: ProductToolbarProps) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearchChange(value);
    }, 500),
    [onSearchChange]
  );

  useEffect(() => {
    debouncedSearch(localSearch);
  }, [localSearch, debouncedSearch]);

  const handleClearSearch = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-400" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-accent-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {localSearch && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-400 hover:text-accent-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Results Count */}
          <span className="text-sm text-accent-500 hidden md:block">
            {totalResults} sản phẩm
          </span>

          {/* Sort */}
          <div className="w-48">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-white"
            />
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-1 bg-accent-100 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-accent-500 hover:text-accent-700'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-accent-500 hover:text-accent-700'
              }`}
            >
              <LayoutList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
