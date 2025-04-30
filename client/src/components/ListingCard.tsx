import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../types/listings'; // Adjust the import path as necessary

interface ListingCardProps {
  listing: Listing;
  children?: React.ReactNode;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, children }) => {
  return (
    <div className="group relative border p-2 rounded-lg shadow-sm hover:shadow-md transition">
      <Link to={`/listings/${listing.id}`}>
        <img
          alt={listing.title}
          src={`https://westerncloset1.s3.amazonaws.com/${listing.image_key}`}
          className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:h-80"
        />
        <div className="mt-4 flex justify-between items-start">
          <div>
            <h3 className="text-sm text-gray-700 hover:underline">{listing.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{listing.category}</p>
          </div>
          <p className="text-sm font-medium text-gray-900">{listing.price}</p>
        </div>
      </Link>

      {/* Slot for buttons or extra content */}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default ListingCard;