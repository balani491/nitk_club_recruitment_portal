import React, { useState, useEffect } from 'react'
import axios from 'axios'

type User = {
  id: number
  name: string
  email: string
  role: string
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const token = localStorage.getItem('token') // Get token from localStorage

    try {
      const response = await axios.get('http://localhost:3000/api/v1/admin/getAllUsers', {
        headers: {
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
      })
      setUsers(response.data)
      setLoading(false)
    } catch (err) {
      setError('Error fetching users')
      setLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser({ ...user })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingUser) {
      setEditingUser({ ...editingUser, [e.target.name]: e.target.value })
    }
  }

  const handleSave = async () => {
    if (!editingUser) return

    const token = localStorage.getItem('token') // Get token from localStorage

    try {
      await axios.post(
        'http://localhost:3000/api/v1/admin/manageUsers',
        {
          action: 'update',
          userId: editingUser.id,
          userData: {
            name: editingUser.name,
            email: editingUser.email,
            role: editingUser.role,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        }
      )

      setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)))
      setEditingUser(null)
    } catch (err) {
      setError('Error updating user')
    }
  }

  if (loading) return <div className="text-center mt-8">Loading...</div>
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Role</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="py-2 px-4">
                  {editingUser && editingUser.id === user.id ? (
                    <input
                      type="text"
                      name="name"
                      value={editingUser.name}
                      onChange={handleChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingUser && editingUser.id === user.id ? (
                    <input
                      type="email"
                      name="email"
                      value={editingUser.email}
                      onChange={handleChange}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingUser && editingUser.id === user.id ? (
                    <select
                      name="role"
                      value={editingUser.role}
                      onChange={handleChange}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="CONVENOR">Convenor</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingUser && editingUser.id === user.id ? (
                    <button
                      onClick={handleSave}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded"
                    >
                      Save Changes
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
