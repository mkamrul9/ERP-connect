'use client';

import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

export default function FinancialAnalytics({ expenses }: { expenses: any[] }) {
  // Aggregate expenses by Head
  const headData = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach(e => {
      const h = e.expense_head || 'Other';
      const a = Number(e.amount) || 0;
      map.set(h, (map.get(h) || 0) + a);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 7); // Top 7 expenses
  }, [expenses]);

  // Aggregate expenses by Month
  const monthData = useMemo(() => {
    const map = new Map<string, number>();
    expenses.forEach(e => {
      if (!e.date && !e.expense_date) return;
      const m = (e.date || e.expense_date).substring(0, 7); // YYYY-MM
      const a = Number(e.amount) || 0;
      map.set(m, (map.get(m) || 0) + a);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [expenses]);

  // Aggregate by Business (Trade vs Digital)
  const bizData = useMemo(() => {
    let trade = 0;
    let digital = 0;
    expenses.forEach(e => {
      const a = Number(e.amount) || 0;
      if (e.company_name === 'Digital') digital += a;
      else trade += a;
    });
    return [
      { name: 'Trade', value: trade },
      { name: 'Digital', value: digital }
    ];
  }, [expenses]);

  const COLORS = ['#2563eb', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

  if (!expenses || expenses.length === 0) {
    return <div style={{ padding: 20, textAlign: 'center', color: 'var(--muted)' }}>No financial data available to analyze.</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', paddingBottom: '20px' }}>
      
      {/* Top Expense Heads - Bar Chart */}
      <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '20px', color: 'var(--text)', fontWeight: 700 }}>Top Expense Categories</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={headData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={true} vertical={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--muted)' }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--muted)' }} width={100} />
              <Tooltip cursor={{ fill: 'var(--bg)' }} contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
              <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Trends - Line Chart */}
      <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '20px', color: 'var(--text)', fontWeight: 700 }}>Monthly Expense Trend</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={monthData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={3} dot={{ r: 4, fill: '#14b8a6', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Business Division - Pie Chart */}
      <div style={{ background: 'var(--card)', padding: '20px', borderRadius: '14px', border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: '0.95rem', marginBottom: '20px', color: 'var(--text)', fontWeight: 700 }}>Cost by Business Division</h3>
        <div style={{ width: '100%', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={bizData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {bizData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length] || '#000'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
              <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
