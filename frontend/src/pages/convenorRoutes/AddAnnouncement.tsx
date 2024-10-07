'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Round {
  roundNumber: number;
  details: string;
}

interface Announcement {
  id: string;
  content: string;
  number: number;
  rounds: Round[];
}

export default function AddAnnouncement() {
  const [content, setContent] = useState('')
  const [number, setNumber] = useState('')
  const [rounds, setRounds] = useState<Round[]>([{ roundNumber: 1, details: '' }])
  const [message, setMessage] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [existingAnnouncement, setExistingAnnouncement] = useState<Announcement | null>(null)

  useEffect(() => {
    fetchAnnouncement()
  }, [])

  const fetchAnnouncement = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:3000/api/v1/convenor/getAnnouncement', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data) {
        setExistingAnnouncement(response.data)
        setContent(response.data.content)
        setNumber(response.data.number.toString())
        setRounds(response.data.rounds)
      }
    } catch (error) {
      console.error('Failed to fetch announcement:', error)
    }
  }

  const handleAddRound = () => {
    setRounds([...rounds, { roundNumber: rounds.length + 1, details: '' }])
  }

  const handleRoundChange = (index: number, field: keyof Round, value: string) => {
    const newRounds = [...rounds]
    if (field === 'roundNumber') {
      newRounds[index][field] = parseInt(value)
    } else {
      newRounds[index][field] = value
    }
    setRounds(newRounds)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const endpoint = existingAnnouncement
        ? 'http://localhost:3000/api/v1/convenor/updateAnnouncement'
        : 'http://localhost:3000/api/v1/convenor/addAnnouncement'
      
      const payload = {
        content,
        number: parseInt(number),
        rounds,
        ...(existingAnnouncement && { id: existingAnnouncement.id })
      }
      //@ts-ignore
      const response = await axios.post(endpoint, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setMessage(existingAnnouncement ? 'Announcement updated successfully!' : 'Announcement added successfully!')
      if (!existingAnnouncement) {
        setContent('')
        setNumber('')
        setRounds([{ roundNumber: 1, details: '' }])
      }
      setIsEditing(false)
      fetchAnnouncement()
    } catch (error) {
      setMessage('Failed to process announcement. Please try again.')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        {existingAnnouncement ? (isEditing ? 'Edit Announcement' : 'Existing Announcement') : 'Add Announcement'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Announcement Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            //@ts-ignore
            disabled={existingAnnouncement && !isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-100"
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="number" className="block text-sm font-medium text-gray-700">Announcement Number</label>
          <input
            id="number"
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            //@ts-ignore
            disabled={existingAnnouncement && !isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-100"
          />
        </div>
        {rounds.map((round, index) => (
          <div key={index} className="space-y-2">
            <h3 className="text-lg font-semibold">Round {round.roundNumber}</h3>
            <div>
              <label htmlFor={`round-${index}`} className="block text-sm font-medium text-gray-700">Round Details</label>
              <textarea
                id={`round-${index}`}
                value={round.details}
                onChange={(e) => handleRoundChange(index, 'details', e.target.value)}
                required
                //@ts-ignore
                disabled={existingAnnouncement && !isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 disabled:bg-gray-100"
                rows={3}
              />
            </div>
          </div>
        ))}
        {(!existingAnnouncement || isEditing) && (
          <button
            type="button"
            onClick={handleAddRound}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Another Round
          </button>
        )}
        {existingAnnouncement && !isEditing ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Edit Announcement
          </button>
        ) : (
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {existingAnnouncement ? 'Update Announcement' : 'Add Announcement'}
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