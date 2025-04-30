import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateListing from './pages/CreateListing'
import ListingDetail from './pages/ListingDetail'
import Navbar from './components/Navbar'
import UserListings from './pages/UserListings'
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 md:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sell" element={<CreateListing />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route
          path="/userListings"
          element={
            <ProtectedRoute>
              <UserListings />
            </ProtectedRoute>
          }
        />
        </Routes>
      </div>
    </Router>
  )
}

export default App
