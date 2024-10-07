import { useState, useEffect } from 'react';
import axios from 'axios';

interface RoundStatus {
  id: number;
  registrationId: number;
  roundId: number;
  status: string;
}

interface User {
  name: string;
  id: number;
  email: string;
  role: string;
}

interface Registration {
  id: number;
  clubId: number;
  userId: number;
  announcementId: number;
  status: string;
  user: User;
  roundStatuses: RoundStatus[];
}

export default function GetRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/v1/convenor/getRegistrations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegistrations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
      setMessage('Failed to load registrations. Please try again.');
      setLoading(false);
    }
  };

  const updateRoundStatus = async (roundStatusId: number, newStatus: string, registrationId: number, roundId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/v1/convenor/updateRoundStatus',
        { roundStatusId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Round status updated successfully!');

      // Update the local state (optimistic update)
      setRegistrations((prevRegistrations) =>
        prevRegistrations.map((registration) =>
          registration.id === registrationId
            ? {
                ...registration,
                roundStatuses: registration.roundStatuses.map((roundStatus) =>
                  roundStatus.roundId === roundId ? { ...roundStatus, status: newStatus } : roundStatus
                ),
              }
            : registration
        )
      );
    } catch (error) {
      console.error('Failed to update round status:', error);
      setMessage('Failed to update round status. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center">Loading registrations...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registrations</h1>
      {message && (
        <p className={`mb-4 text-center ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
      {registrations.map((registration) => (
        <div key={registration.id} className="mb-8 p-4 border rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Registration #{registration.id}</h2>
          <p>
            <strong>User:</strong> {registration.user.name} ({registration.user.email})
          </p>
          <p>
            <strong>Status:</strong> {registration.status}
          </p>
          <h3 className="text-lg font-semibold mt-4 mb-2">Round Statuses:</h3>
          {registration.roundStatuses.map((roundStatus) => (
            <div key={roundStatus.id} className="mb-2 p-2 border rounded">
              <p>
                <strong>Round {roundStatus.roundId}:</strong>
              </p>
              <div className="flex items-center">
                <select
                  value={roundStatus.status}
                  onChange={(e) =>
                    updateRoundStatus(roundStatus.id, e.target.value, registration.id, roundStatus.roundId)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PASSED">Passed</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
