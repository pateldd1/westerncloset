import { useState } from 'react'
import axios from 'axios'

const CreateListing = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('saree')
  const [image, setImage] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('category', category)
    if (image) formData.append('image', image)

    try {
      const res = await axios.post('http://localhost:5000/api/listings', formData, {
        headers: { 'Content-Type': 'multipart/form-data', "Authorization": `Bearer ${localStorage.getItem('token')}` },
      })
      console.log('✅ Listing created:', res.data)
      alert('Listing submitted successfully!')
    } catch (err) {
      console.error('❌ Error submitting listing:', err)
      alert('Something went wrong while submitting your listing.')
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Create a New Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Item Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="saree">Saree</option>
          <option value="kurti">Kurti</option>
          <option value="lehenga">Lehenga</option>
          <option value="other">Other</option>
        </select>
        <input
          type="file"
          onChange={(e) => e.target.files && setImage(e.target.files[0])}
          className="w-full"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Listing
        </button>
      </form>
    </div>
  )
}

export default CreateListing