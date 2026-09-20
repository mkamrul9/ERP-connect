'use client';

import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

export default function ProductivityAnalytics({ tasks }: { tasks: any[] }) {
  
  // Status breakdown
  const statusData = useMemo(() => {
    let pending = 0, wip = 0, done = 0;
    tasks.forEach(t => {
      if (t.status === 'DONE') done++;
      else if (t.status === 'WIP') wip++;
      else pending++;
    });
    return [
      { name: 'Pending', value: pending },
      { name: 'WIP', value: wip },
      { name: 'Done', value: done }
    ];
  }, [tasks]);

  // Action type breakdown
  const actionData = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach(t => {
      const a = t.action_type || 'OTHER';
      map.set(a, (map.get(a) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [tasks]);

  // Trend over time (created vs deadline logic, we'll just group by deadline month)
  const trendData = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach(t => {
      if (!t.deadline) return;
      const m = t.deadline.substring(0, 7);
      map.set(m, (map.get(m) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [tasks]);

  const STATUS_COLORS = ['#ef4444', '#f59e0b', '#22c55e'];
  const COLORS = ['#2563eb', '#14b8a6', '#8b5cf6', '#ec4899', '#64748b', '#f59e0b'];

  if (!tasks || tasks.length === 0) {
    return <div style={{ padding: 20, textAlign: 'center', color: 'var(--muted)' }}>No tasks available for analytics.</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', paddingBottom: '20px' }}>
      
      {/* Status Breakdown - Pie Chart */}
      <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '20px', color: 'var(--text)', fontWeight: 700 }}>Task Completion Status</h3>
        <div style={{ width: '100%', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length] || '#000'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Types - Bar Chart */}
      <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '20px', color: 'var(--text)', fontWeight: 700 }}>Workload by Activity Type</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={actionData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} />
              <Tooltip cursor={{ fill: 'var(--bg)' }} contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={35}>
                {actionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] || '#000'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Task Deadlines - Line Chart */}
      <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '20px', color: 'var(--text)', fontWeight: 700 }}>Task Deadline Trends</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
