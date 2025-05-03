import { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { submitReview, fetchReviewsBySeller } from '../redux/slices/reviews';

interface Props {
  sellerId: number;
}

const ReviewForm: React.FC<Props> = ({ sellerId }) => {
  const dispatch = useAppDispatch();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await dispatch(submitReview({ sellerId, rating, comment })).unwrap();
      await dispatch(fetchReviewsBySeller(sellerId)); // 💥 Refetch updated reviews list
      setRating(5);
      setComment('');
      setSuccess(true);
    } catch (err) {
        console.error('Error submitting review:', err);
      alert('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <h3 className="text-md font-medium text-gray-900">Leave a Review</h3>

      <div>
        <label className="block text-sm text-gray-700">Rating (1-5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="w-20 mt-1 border rounded px-2 py-1"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full mt-1 border rounded px-3 py-2"
          placeholder="Write something helpful..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>

      {success && <p className="text-green-600">✅ Review submitted!</p>}
    </form>
  );
};

export default ReviewForm;