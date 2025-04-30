import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { updateUserListing } from '../redux/slices/userListings';

interface EditListingModalProps {
  listing: {
    id: number;
    title: string;
    description: string;
    price: string;
    category: string;
  };
  onClose: () => void;
}
const categories = ['saree', 'kurti', 'lehenga', 'sherwani'];

const EditListingModal: React.FC<EditListingModalProps> = ({ listing, onClose }) => {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState(listing.title);
  const [description, setDescription] = useState(listing.description);
  const [price, setPrice] = useState(listing.price);
  const [category, setCategory] = useState(listing.category);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(updateUserListing({
      id: listing.id,
      updates: { title, description, price, category },
    }));

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Listing</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border p-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="w-full border p-2 rounded" value={description} onChange={(e) => setDescription(e.target.value)} />
          <input className="w-full border p-2 rounded" value={price} onChange={(e) => setPrice(e.target.value)} />
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
          <div className="flex justify-between mt-4">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListingModal;