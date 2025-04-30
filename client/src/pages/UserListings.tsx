import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchUserListings,
  deleteUserListing,
} from '../redux/slices/userListings';
import ListingCard from '../components/ListingCard';
import EditListingModal from '../components/EditListingModal';

const UserListings = () => {
  const dispatch = useAppDispatch();
  const { listings, loading, error } = useAppSelector((state) => state.listings);
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  useEffect(() => {
    dispatch(fetchUserListings());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      dispatch(deleteUserListing(id));
    }
  };
  
  const handleEdit = (listing: any) => {
    setSelectedListing(listing);
  };

  const closeModal = () => {
    setSelectedListing(null);
  };

  if (loading) return <p className="text-center text-lg">Loading your listings...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-6">Your Listings</h2>
      {listings.length === 0 ? (
        <p className="text-gray-600">You haven’t created any listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing}>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(listing.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleEdit(listing)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              </div>
            </ListingCard>
          ))}
        </div>
      )}
      {selectedListing && (
        <EditListingModal listing={selectedListing} onClose={closeModal} />
      )}
    </div>
  );
};

export default UserListings;