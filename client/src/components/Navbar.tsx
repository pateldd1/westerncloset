import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/userSlice';

const Navbar: React.FC = () => {
  const { token, username } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          Indian Clothes Marketplace
        </Link>

        <div className="flex space-x-6 items-center">
          {token && (
            <>
              <span className="text-gray-300 text-sm">Hello, {username}</span>
              <Link to="/inbox" className="text-white text-lg hover:text-gray-300">Inbox</Link>
              <Link to="/userListings" className="text-white text-lg hover:text-gray-400">
                My Listings
              </Link>
              <Link to="/sell" className="text-white text-lg hover:text-gray-400">
                Sell
              </Link>
              <button
                onClick={handleLogout}
                className="text-white text-lg hover:text-red-400"
              >
                Logout
              </button>
            </>
          )}

          {!token && (
            <>
              <Link to="/login" className="text-white text-lg hover:text-gray-400">
                Login
              </Link>
              <Link to="/register" className="text-white text-lg hover:text-gray-400">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;