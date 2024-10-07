import { useState, useEffect } from 'react'
import axios from 'axios'

interface Round {
  roundNumber: number
  details: string
}

interface Announcement {
  id: number
  content: string
  number: number
  createdAt: string
  club: string
  rounds: Round[]
  isRegistered: boolean
}

export default function GetAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  const fetchAnnouncements = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('http://localhost:3000/api/v1/student/getAnnouncements', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setAnnouncements(response.data)
    } catch (err) {
      setError('Failed to load announcements. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (announcementId: number) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/student/registerForRecruitment',
        { announcementId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      alert(response.data.message)
      await fetchAnnouncements() // Refresh announcements after registration
    } catch (err) {
      alert('Failed to register for recruitment. Please try again later.')
    }
  }

  const handleDeRegister = async (announcementId: number) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/student/handleDeRegister',
        { announcementId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      alert(response.data.message)
      await fetchAnnouncements() // Refresh announcements after deregistration
    } catch (err) {
      alert('Failed to deregister from recruitment. Please try again later.')
    }
  }

  if (loading) {
    return <div className="text-center p-4">Loading announcements...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Announcements</h1>
      {announcements.map((announcement) => (
        <div key={announcement.id} className="bg-white shadow-md rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold mb-2">{announcement.club}</h2>
          <p className="text-gray-600 mb-4">{announcement.content}</p>
          <h3 className="text-lg font-semibold mb-2">Recruitment Rounds:</h3>
          <ul className="list-disc pl-5 mb-4">
            {announcement.rounds.map((round) => (
              <li key={round.roundNumber} className="mb-2">
                <span className="font-medium">Round {round.roundNumber}:</span> {round.details}
              </li>
            ))}
          </ul>
          {announcement.isRegistered ? (
            <button
              onClick={() => handleDeRegister(announcement.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Deregister from Recruitment
            </button>
          ) : (
            <button
              onClick={() => handleRegister(announcement.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Register for Recruitment
            </button>
          )}
        </div>
      ))}
    </div>
  )
}