import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Notices() {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    const { data } = await api.get('/notices');
    setNotices(data);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    await api.post('/notices', { title, message });
    setTitle('');
    setMessage('');
    load();
  };

  const remove = async (id) => {
    await api.delete('/notices/' + id);
    load();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📢 Notices</h2>

      {user.role === 'admin' && (
        <form onSubmit={add} className="bg-white p-4 rounded-xl shadow mb-6">
          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border p-2 rounded mb-2"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Post Notice
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {notices.map((n) => (
          <div key={n._id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">{n.title}</h3>
              {user.role === 'admin' && (
                <button onClick={() => remove(n._id)} className="text-red-500 text-sm">
                  Delete
                </button>
              )}
            </div>
            <p className="text-gray-600 mt-1">{n.message}</p>
            <p className="text-xs text-gray-400 mt-2">
              {n.postedBy?.name} • {new Date(n.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}