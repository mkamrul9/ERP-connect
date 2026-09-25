'use client';

import Topbar from '../components/Topbar';
import { Users, Plus, Phone, Mail, Building, Edit2, Trash2 } from 'lucide-react';

const DUMMY_CRM = [
  { id: 'CRM-001', company: 'Acme Corp', contact: 'Alice Johnson', email: 'alice@acme.com', phone: '+1 555-0100', status: 'Active', value: '$12,500' },
  { id: 'CRM-002', company: 'Globex Inc', contact: 'Bob Smith', email: 'bob@globex.com', phone: '+1 555-0101', status: 'Lead', value: '$5,000' },
  { id: 'CRM-003', company: 'Soylent Corp', contact: 'Charlie Davis', email: 'charlie@soylent.com', phone: '+1 555-0102', status: 'Negotiation', value: '$8,200' },
  { id: 'CRM-004', company: 'Initech', contact: 'Diana Prince', email: 'diana@initech.com', phone: '+1 555-0103', status: 'Active', value: '$25,000' },
  { id: 'CRM-005', company: 'Umbrella Corp', contact: 'Evan Wright', email: 'evan@umbrella.com', phone: '+1 555-0104', status: 'Lost', value: '$0' },
];

export default function CRMPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#22c55e'; // Green
      case 'Lead': return '#3b82f6'; // Blue
      case 'Negotiation': return '#f59e0b'; // Yellow
      case 'Lost': return '#ef4444'; // Red
      default: return '#64748b'; // Gray
    }
  };

  return (
    <>
      <Topbar title="CRM & Client Management" />
      <div className="scroll" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text)', margin: '0 0 4px 0' }}>Client Directory</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>Manage customer relationships, sales pipelines, and key contacts.</p>
          </div>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: '8px' }}>
            <Plus size={16} /> Add Client
          </button>
        </div>

        <div style={{ background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div className="table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Person</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Info</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Value</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_CRM.map((client, idx) => (
                  <tr key={client.id} style={{ borderBottom: idx === DUMMY_CRM.length - 1 ? 'none' : '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: '0.85rem' }}>{client.id}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text)', fontWeight: 500, fontSize: '0.9rem' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--primary-dim)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Building size={14} />
                        </div>
                        {client.company}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text)', fontSize: '0.85rem' }}>{client.contact}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--muted)' }}><Mail size={12} /> {client.email}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--muted)' }}><Phone size={12} /> {client.phone}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', color: getStatusColor(client.status) }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(client.status) }} />
                        {client.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text)', fontWeight: 600, fontSize: '0.85rem' }}>{client.value}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}><Edit2 size={16} /></button>
                        <button style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
