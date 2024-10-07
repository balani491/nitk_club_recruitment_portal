import  { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/Card'


interface Club {
  id: number
  name: string
  convenorId: number
  info: string
}

export default function ViewClubs() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const token=localStorage.getItem('token');
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/admin/viewClubs', {
          headers: {
            Authorization: `Bearer ${token}`, // Replace with your actual token
          },
        })
        setClubs(response.data)
        setLoading(false)
      } catch (err) {
        setError('Failed to load clubs. Please try again later.')
        setLoading(false)
      }
    }

    fetchClubs()
  }, [])

  if (loading) {
    return <div className="text-center p-4">Loading clubs...</div>
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">View Clubs</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clubs.map((club) => (
          <Card key={club.id}>
            <CardHeader>
              <CardTitle>{club.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{club.info}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
