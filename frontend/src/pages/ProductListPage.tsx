import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { ProductFilter, ProductToolbar, ProductGrid } from '@/components/common';
import { Pagination, Breadcrumb } from '@/components/ui';
import { useProducts } from '@/hooks/useProducts';
import type { ProductQueryParams } from '@/api/endpoints';

interface FilterState {
  categoryIds: number[];
  brandIds: number[];
  minPrice: string;
  maxPrice: string;
  hasDiscount: boolean;
  isFeatured: boolean;
  inStock: boolean;
}

const initialFilters: FilterState = {
  categoryIds: [],
  brandIds: [],
  minPrice: '',
  maxPrice: '',
  hasDiscount: false,
  isFeatured: false,
  inStock: false,
};

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Get query params
  const searchQuery = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sort') || 'createdAt,desc';
  
  // Get category and brand from URL (support both old and new param names)
  const categoryParam = searchParams.get('categoryId') || searchParams.get('category');
  const brandParam = searchParams.get('brandId') || searchParams.get('brand');

  // Sync URL category/brand params into filters
  useEffect(() => {
    setFilters((prev) => {
      const next = { ...prev };
      const nextCategoryIds = categoryParam ? [Number(categoryParam)] : [];
      const nextBrandIds = brandParam ? [Number(brandParam)] : [];
      if (
        JSON.stringify(nextCategoryIds) !== JSON.stringify(prev.categoryIds) ||
        JSON.stringify(nextBrandIds) !== JSON.stringify(prev.brandIds)
      ) {
        next.categoryIds = nextCategoryIds;
        next.brandIds = nextBrandIds;
      }
      return next;
    });
  }, [categoryParam, brandParam]);

  // Build query params
  const queryParams: ProductQueryParams = useMemo(() => {
    const params: ProductQueryParams = {
      page: page - 1, // API uses 0-indexed pages
      size: 12,
      sortBy: sortBy.split(',')[0],
      sortOrder: sortBy.split(',')[1] as 'asc' | 'desc',
    };

    if (searchQuery) {
      params.keyword = searchQuery;
    }

    // Apply filters
    if (filters.categoryIds.length > 0) {
      params.categoryId = filters.categoryIds[0];
    }
    if (filters.brandIds.length > 0) {
      params.brandId = filters.brandIds[0];
    }
    if (filters.minPrice) {
      params.minPrice = parseFloat(filters.minPrice);
    }
    if (filters.maxPrice) {
      params.maxPrice = parseFloat(filters.maxPrice);
    }

    return params;
  }, [page, sortBy, searchQuery, filters]);

  // Fetch products
  const queryClient = useQueryClient();
  const { data, isLoading } = useProducts(queryParams);

  // Clear product cache when filters change to avoid stale data
  useEffect(() => {
    queryClient.removeQueries({ queryKey: ['products'] });
  }, [categoryParam, brandParam, searchQuery, sortBy, page]);
  const products = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 1;
  const totalElements = data?.data?.totalElements || 0;

  // Handle search
  const handleSearchChange = (query: string) => {
    if (query) {
      setSearchParams({ search: query });
    } else {
      searchParams.delete('search');
      setSearchParams(searchParams);
    }
  };

  // Handle sort
  const handleSortChange = (sort: string) => {
    searchParams.set('sort', sort);
    setSearchParams(searchParams);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    searchParams.set('page', newPage.toString());
    setSearchParams(searchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters(initialFilters);
    if (categoryParam) searchParams.delete('category');
    if (brandParam) searchParams.delete('brand');
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-accent-50 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary to-red-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Sản phẩm</h1>
          <Breadcrumb
            items={[{ label: 'Sản phẩm' }]}
            className="text-white/80 [&_a]:text-white/80 [&_span]:text-white"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Toolbar */}
        <ProductToolbar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalResults={totalElements}
        />

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <ProductFilter
            filters={filters}
            onFilterChange={setFilters}
            onClear={handleClearFilters}
          />

          {/* Product Grid */}
          <div className="flex-1">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              viewMode={viewMode}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
