import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchAllListings } from '../redux/slices/homeListings';
import ListingCard from '../components/ListingCard';

const categories = ['all', 'saree', 'kurti', 'lehenga', 'sherwani'];

const Home = () => {
  const dispatch = useAppDispatch();
  const { listings, loading, error } = useAppSelector((state) => state.homeListings);

  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest' | 'oldest'>('price-asc');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchAllListings());
  }, [dispatch]);

  const filtered = listings
    .filter((listing) => categoryFilter === 'all' || listing.category === categoryFilter)
    .sort((a, b) => {
      const priceA = parseFloat(a.price.replace(/[^0-9.]/g, ''));
      const priceB = parseFloat(b.price.replace(/[^0-9.]/g, ''));
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'oldest') return a.id - b.id;
      return 0;
    });

  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-600">{error}</div>;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured Listings</h2>
        <div className="flex justify-end mb-6 gap-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border rounded-md px-4 py-2 text-gray-700"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border rounded-md px-4 py-2 text-gray-700"
          >
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;