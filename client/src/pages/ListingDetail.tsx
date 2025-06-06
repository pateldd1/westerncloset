import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchListingById } from '../redux/slices/userListings';
import { fetchReviewsBySeller } from '../redux/slices/reviews';
import ReviewForm from '../components/ReviewForm';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedListing, loading: loadingListings, error } = useAppSelector((state) => state.listings);
  const { reviews, average } = useAppSelector((state) => state.reviews);
  const { token, userId } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchListingById(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedListing?.seller_id) {
      dispatch(fetchReviewsBySeller(selectedListing.seller_id));
    }
  }, [dispatch, selectedListing]);

  const handleBuyNow = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/payments/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId: id }),
      });

      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert(data.error || 'Failed to initiate checkout');
      }
    } catch (err) {
      console.error('Stripe Checkout error:', err);
      alert('Something went wrong');
    }
  };

  if (loadingListings) return <div className="text-center mt-10 text-lg">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!selectedListing) return null;

  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Image */}
        <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={`https://westerncloset1.s3.amazonaws.com/${selectedListing.image_key}`}
            alt={selectedListing.title}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Info */}
        <div className="mt-6">
          <h1 className="text-3xl font-bold text-gray-900">{selectedListing.title}</h1>
          <p className="mt-2 text-xl text-gray-700">{selectedListing.price}</p>
          <p className="mt-1 text-sm text-gray-500 uppercase">{selectedListing.category}</p>
        </div>

        {/* Seller info */}
        <div className="mt-2 text-sm text-gray-600">
          <p>
            Sold by: <span className="font-medium text-gray-800">{selectedListing.seller_username}</span>
          </p>
          <p>
            Contact: <a href={`mailto:${selectedListing.seller_email}`} className="text-blue-600 hover:underline">
              {selectedListing.seller_email}
            </a>
          </p>
        </div>

        {/* Description */}
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">Description</h2>
          <p className="mt-2 text-gray-700">{selectedListing.description}</p>
        </div>
        {token && (
          <div className="mt-4">
            <button
              onClick={handleBuyNow}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Buy Now
            </button>
          </div>
        )}
        {/* Seller Reviews */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-semibold text-gray-900">Seller Reviews</h2>

          {/* Average Rating */}
          {average && (
            <p className="text-yellow-600 mt-1">Average Rating: {average.toFixed(1)} ⭐</p>
          )}

          {/* List of Reviews */}
          <ul className="mt-4 space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="border p-4 rounded-md shadow-sm">
                <p className="text-sm text-gray-600 font-semibold">{r.reviewer_username}</p>
                <p className="text-yellow-600 text-sm">Rating: {r.rating}⭐</p>
                <p className="text-gray-700">{r.comment}</p>
              </li>
            ))}
          </ul>

          {/* Inline Review Form */}
          {selectedListing?.seller_id && token && <ReviewForm sellerId={selectedListing.seller_id} />}
        </div>

        {/* CTA to message seller */}
        {token && selectedListing?.seller_id && selectedListing.seller_id !== userId && (
          <div className="mt-10">
            <button
              onClick={() =>
                navigate(`/messages/${selectedListing.id}/buyer`)
              }
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Message the Seller
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetail;
