import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchBuyerInbox, fetchSellerInbox } from "../redux/slices/inbox";
import { Link } from "react-router-dom";

const Inbox = () => {
  const dispatch = useAppDispatch();
  const { buyerThreads, sellerThreads, loading, error } = useAppSelector((state) => state.inbox);

  useEffect(() => {
    dispatch(fetchBuyerInbox());
    dispatch(fetchSellerInbox());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Inbox</h1>

      {loading && <p>Loading messages...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Seller Inbox */}
      {sellerThreads.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Buyers Messaged You</h2>
          <ul className="divide-y divide-gray-200">
            {sellerThreads.map((thread) => (
              <li key={`${thread.listing_id}-${thread.buyer_id}`} className="py-4">
                <Link
                  to={`/messages/${thread.listing_id}/seller`}
                  className="block hover:bg-gray-50 p-4 rounded transition"
                >
                  <p className="text-sm text-gray-600">
                    From <strong>{thread.buyer_username}</strong> about <strong>{thread.listing_title}</strong>
                  </p>
                  <p className="mt-1 text-sm text-gray-800">{thread.last_message}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(thread.last_message_time).toLocaleString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Buyer Inbox */}
      {buyerThreads.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Sellers You Messaged</h2>
          <ul className="divide-y divide-gray-200">
            {buyerThreads.map((thread) => (
              <li key={`${thread.listing_id}-${thread.seller_id}`} className="py-4">
                <Link
                  to={`/messages/${thread.listing_id}/buyer`}
                  className="block hover:bg-gray-50 p-4 rounded transition"
                >
                  <p className="text-sm text-gray-600">
                    With <strong>{thread.seller_username}</strong> about <strong>{thread.listing_title}</strong>
                  </p>
                  <p className="mt-1 text-sm text-gray-800">{thread.last_message}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(thread.last_message_time).toLocaleString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No Messages at All */}
      {buyerThreads.length === 0 && sellerThreads.length === 0 && !loading && (
        <p className="text-gray-500">You have no messages yet.</p>
      )}
    </div>
  );
};

export default Inbox;