import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ notices: [], complaints: [], visitors: [], bills: [] });

  useEffect(() => {
    const load = async () => {
      const [n, c, v, b] = await Promise.all([
        api.get('/notices'),
        api.get('/complaints'),
        api.get('/visitors'),
        api.get('/bills'),
      ]);
      setData({ notices: n.data, complaints: c.data, visitors: v.data, bills: b.data });
    };
    load();
  }, []);

  const openComplaints = data.complaints.filter((c) => c.status !== 'resolved').length;
  const unpaidBills = data.bills.filter((b) => b.status === 'unpaid').length;
  const insideVisitors = data.visitors.filter((v) => !v.exitTime).length;

  const cards = [
    { label: 'Notices', value: data.notices.length, color: 'bg-blue-500', to: '/notices' },
    { label: 'Open Complaints', value: openComplaints, color: 'bg-red-500', to: '/complaints' },
    { label: 'Visitors Inside', value: insideVisitors, color: 'bg-green-500', to: '/visitors' },
    { label: 'Unpaid Bills', value: unpaidBills, color: 'bg-yellow-500', to: '/bills' },
  ];

  const chartData = [
    { name: 'Open', value: data.complaints.filter((c) => c.status === 'open').length, color: '#ef4444' },
    { name: 'In Progress', value: data.complaints.filter((c) => c.status === 'in-progress').length, color: '#eab308' },
    { name: 'Resolved', value: data.complaints.filter((c) => c.status === 'resolved').length, color: '#22c55e' },
  ].filter((d) => d.value > 0);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-1">Welcome, {user?.name} 👋</h2>
      <p className="text-gray-500 mb-6">Here is what is happening in your society.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className={c.color + ' text-white p-6 rounded-xl shadow hover:scale-105 transition'}
          >
            <p className="text-sm">{c.label}</p>
            <p className="text-4xl font-bold">{c.value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white p-4 rounded-xl shadow max-w-md">
        <h3 className="font-semibold mb-2">Complaints by status</h3>
        {chartData.length === 0 ? (
          <p className="text-gray-400 text-sm">No complaints yet.</p>
        ) : (
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {chartData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}