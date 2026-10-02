import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const colors = {
  open: 'bg-red-100 text-red-600',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  resolved: 'bg-green-100 text-green-700',
};

export default function Complaints() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');

  const load = async () => {
    const { data } = await api.get('/complaints');
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    await api.post('/complaints', { title, description, category });
    setTitle('');
    setDescription('');
    setCategory('general');
    load();
  };

  const changeStatus = async (id, status) => {
    await api.put('/complaints/' + id, { status });
    load();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🛠️ Complaints</h2>

      {user.role === 'resident' && (
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
            placeholder="Describe the problem"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <select
            className="border p-2 rounded mb-2 block"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="general">General</option>
            <option value="maintenance">Maintenance</option>
            <option value="electrical">Electrical</option>
            <option value="water">Water</option>
            <option value="security">Security</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Raise Complaint
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {list.map((c) => (
          <div key={c._id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{c.title}</h3>
              <span className={'text-xs px-3 py-1 rounded-full ' + colors[c.status]}>
                {c.status}
              </span>
            </div>
            <p className="text-gray-600 mt-1">{c.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              {c.category} • {c.raisedBy?.name} • {new Date(c.createdAt).toLocaleDateString()}
            </p>
            {user.role === 'admin' && (
              <select
                className="border p-1 rounded mt-3 text-sm"
                value={c.status}
                onChange={(e) => changeStatus(c._id, e.target.value)}
              >
                <option value="open">open</option>
                <option value="in-progress">in-progress</option>
                <option value="resolved">resolved</option>
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}