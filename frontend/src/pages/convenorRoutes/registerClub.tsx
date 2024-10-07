import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function RegisterClub() {
  const [name, setName] = useState('')
  const [info, setInfo] = useState('')
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [hasExistingClub, setHasExistingClub] = useState(false)

  useEffect(() => {
    fetchClubInfo()
  }, [])

  const fetchClubInfo = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/api/v1/convenor/getClubInfo', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data) {
        setName(response.data.name)
        setInfo(response.data.info)
        setHasExistingClub(true)
      }
    } catch (error) {
      console.error('Failed to fetch club info:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const endpoint = hasExistingClub
        ? 'http://localhost:3000/api/v1/convenor/updateClubInfo'
        : 'http://localhost:3000/api/v1/convenor/register'
      //@ts-ignore
      const response = await axios.post(endpoint, 
        { name, info },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessage(hasExistingClub ? 'Club information updated successfully!' : 'Club registered successfully!')
      setIsEditing(false)
    } catch (error) {
      setMessage(hasExistingClub ? 'Failed to update club information. Please try again.' : 'Failed to register club. Please try again.')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{hasExistingClub ? 'Club Information' : 'Register Club'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Club Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={hasExistingClub && !isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-100"
          />
        </div>
        <div>
          <label htmlFor="info" className="block text-sm font-medium text-gray-700">Club Information</label>
          <textarea
            id="info"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
            required
            disabled={hasExistingClub && !isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-100"
            rows={4}
          />
        </div>
        {hasExistingClub && !isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Edit Club Information
          </button>
        ) : (
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {hasExistingClub ? 'Update Club Information' : 'Register Club'}
          </button>
        )}
      </form>
      {message && (
        <p className={`mt-4 text-center ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  )
}