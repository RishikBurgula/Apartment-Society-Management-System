import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Visitors() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [flats, setFlats] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [flat, setFlat] = useState('');

  const canLog = user.role === 'guard' || user.role === 'admin';

  const load = async () => {
    const { data } = await api.get('/visitors');
    setList(data);
  };

  useEffect(() => {
    load();
    if (canLog) {
      api.get('/flats').then((res) => {
        setFlats(res.data);
        if (res.data.length) setFlat(res.data[0]._id);
      });
    }
  }, []);

  const add = async (e) => {
    e.preventDefault();
    await api.post('/visitors', { name, phone, purpose, flat });
    setName('');
    setPhone('');
    setPurpose('');
    load();
  };

  const markExit = async (id) => {
    await api.put('/visitors/' + id + '/exit');
    load();
  };

  const fmt = (d) => new Date(d).toLocaleString();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🚪 Visitors</h2>

      {canLog && (
        <form onSubmit={add} className="bg-white p-4 rounded-xl shadow mb-6">
          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Visitor name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
          <select
            className="border p-2 rounded mb-2 block"
            value={flat}
            onChange={(e) => setFlat(e.target.value)}
          >
            {flats.map((f) => (
              <option key={f._id} value={f._id}>
                {f.block}-{f.flatNumber}
              </option>
            ))}
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Log Entry
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Purpose</th>
              <th className="p-3">Flat</th>
              <th className="p-3">Entry</th>
              <th className="p-3">Exit</th>
            </tr>
          </thead>
          <tbody>
            {list.map((v) => (
              <tr key={v._id} className="border-t">
                <td className="p-3">{v.name}</td>
                <td className="p-3">{v.purpose}</td>
                <td className="p-3">{v.flat?.block}-{v.flat?.flatNumber}</td>
                <td className="p-3">{fmt(v.entryTime)}</td>
                <td className="p-3">
                  {v.exitTime ? (
                    fmt(v.exitTime)
                  ) : canLog ? (
                    <button
                      onClick={() => markExit(v._id)}
                      className="bg-orange-500 text-white px-2 py-1 rounded"
                    >
                      Mark Exit
                    </button>
                  ) : (
                    <span className="text-green-600">Inside</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}