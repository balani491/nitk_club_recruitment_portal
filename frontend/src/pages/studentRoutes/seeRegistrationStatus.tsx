import  { useState, useEffect } from 'react'
import axios from 'axios'

interface Round {
  roundNumber: number
  roundDetails: string
  roundStatus: string
}

interface RegistrationStatus {
  registrationId: number
  status: string
  clubName: string
  announcementContent: string
  rounds: Round[]
}

export default function SeeRegistrationStatus() {
  const [registrations, setRegistrations] = useState<RegistrationStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRegistrationStatus()
  }, [])

  const fetchRegistrationStatus = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('http://localhost:3000/api/v1/student/registrationStatus', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setRegistrations(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load registration status. Please try again later.')
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center p-4">Loading registration status...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registration Status</h1>
      {registrations.length === 0 ? (
        <p className="text-center text-gray-600">No registrations found.</p>
      ) : (
        registrations.map((registration) => (
          <div key={registration.registrationId} className="bg-white shadow-md rounded-lg p-6 mb-4">
            <h2 className="text-xl font-semibold mb-2">{registration.clubName}</h2>
            <p className="text-gray-600 mb-2">{registration.announcementContent}</p>
            <p className="mb-4">
              Status: <span className="font-medium">{registration.status}</span>
            </p>
            <h3 className="text-lg font-semibold mb-2">Rounds:</h3>
            <ul className="space-y-2">
              {registration.rounds.map((round) => (
                <li key={round.roundNumber} className="bg-gray-100 p-3 rounded">
                  <p className="font-medium">Round {round.roundNumber}</p>
                  <p className="text-sm text-gray-600">{round.roundDetails}</p>
                  <p className="text-sm">
                    Status: <span className="font-medium">{round.roundStatus}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  )
}