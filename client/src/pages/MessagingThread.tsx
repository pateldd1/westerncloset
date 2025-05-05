import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchMessages, sendMessage } from '../redux/slices/messages';

const MessagingThread = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const dispatch = useAppDispatch();
  const { thread, loading } = useAppSelector((state) => state.messages);
  const { userId } = useAppSelector((state) => state.user);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (listingId) {
      dispatch(fetchMessages(Number(listingId)));
    }
  }, [listingId, dispatch]);

  const handleSend = () => {
    if (!newMessage.trim() || !listingId) return;

    dispatch(sendMessage({ listingId: Number(listingId), content: newMessage }));
    setNewMessage('');
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Conversation</h2>
      <div className="border p-4 rounded max-h-96 overflow-y-auto space-y-2 mb-4">
        {loading ? (
          <p>Loading messages...</p>
        ) : thread.length === 0 ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          thread.map((msg) => (
            <div
              key={msg.id}
              className={`p-2 rounded-md ${
                msg.sender_id === userId ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs text-gray-500">
                {msg.sender_id === userId ? 'You' : 'Seller'} - {new Date(msg.created_at).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border px-3 py-2 rounded"
          placeholder="Write a message..."
        />
        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagingThread;