import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Bills() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [flats, setFlats] = useState([]);
  const [flat, setFlat] = useState('');
  const [month, setMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const isAdmin = user.role === 'admin';

  const load = async () => {
    const { data } = await api.get('/bills');
    setList(data);
  };

  useEffect(() => {
    load();
    if (isAdmin) {
      api.get('/flats').then((res) => {
        setFlats(res.data);
        if (res.data.length) setFlat(res.data[0]._id);
      });
    }
  }, []);

  const add = async (e) => {
    e.preventDefault();
    await api.post('/bills', { flat, month, amount: Number(amount), dueDate });
    setMonth('');
    setAmount('');
    setDueDate('');
    load();
  };

  const toggle = async (b) => {
    await api.put('/bills/' + b._id, { status: b.status === 'paid' ? 'unpaid' : 'paid' });
    load();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🧾 Bills</h2>

      {isAdmin && (
        <form onSubmit={add} className="bg-white p-4 rounded-xl shadow mb-6">
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
          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Month (e.g. November 2026)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />
          <input
            className="w-full border p-2 rounded mb-2"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <input
            className="border p-2 rounded mb-2 block"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Add Bill
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3">Flat</th>
              <th className="p-3">Month</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Due</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b._id} className="border-t">
                <td className="p-3">{b.flat?.block}-{b.flat?.flatNumber}</td>
                <td className="p-3">{b.month}</td>
                <td className="p-3">₹{b.amount}</td>
                <td className="p-3">{b.dueDate ? new Date(b.dueDate).toLocaleDateString() : '-'}</td>
                <td className="p-3">
                  {isAdmin ? (
                    <button
                      onClick={() => toggle(b)}
                      className={
                        'px-3 py-1 rounded-full text-xs ' +
                        (b.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600')
                      }
                    >
                      {b.status} (click to change)
                    </button>
                  ) : (
                    <span
                      className={
                        'px-3 py-1 rounded-full text-xs ' +
                        (b.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600')
                      }
                    >
                      {b.status}
                    </span>
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