import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchFilteredListings } from '../redux/slices/homeListings';
import ListingCard from '../components/ListingCard';

const categories = ['all', 'saree', 'kurti', 'lehenga', 'sherwani'];

const Home = () => {
  const dispatch = useAppDispatch();
  const { listings, loading, error } = useAppSelector((state) => state.homeListings);

  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<'price-asc' | 'price-desc' | 'newest' | 'oldest'>('price-asc');
  const [category, setCategory] = useState<string>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Initial fetch on page load
  useEffect(() => {
    dispatch(fetchFilteredListings({}));
  }, [dispatch]);

  // Submit filters manually
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: Record<string, string> = {};
    if (search) filters.search = search;
    if (category !== 'all') filters.category = category;
    if (sort) filters.sort = sort;
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    dispatch(fetchFilteredListings(filters));
  };

  const handleClear = () => {
    setSearch('');
    setSort('price-asc');
    setCategory('all');
    setMinPrice('');
    setMaxPrice('');
    dispatch(fetchFilteredListings({}));
  };

  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-600">{error}</div>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured Listings</h2>

        {/* Filter Form */}
        <form onSubmit={handleSubmit} className="flex flex-wrap justify-end gap-4 mb-6">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-md px-4 py-2 text-gray-700"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="border rounded-md px-4 py-2 text-gray-700"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50"
          >
            Clear Filters
          </button>
        </form>

        {/* Listings */}
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {listings.length === 0 ? (
            <p className="text-gray-500 text-lg col-span-full">No listings found.</p>
          ) : (
            listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;