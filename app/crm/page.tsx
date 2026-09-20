'use client';

import { useState } from 'react';
import Topbar from '../components/Topbar';
import { Users, Phone, Mail, Building, Plus } from 'lucide-react';

export default function CRMPage() {
  return (
    <>
      <Topbar title="CRM & Client Management" />
      <div style={{ padding: '20px', height: 'calc(100dvh - 56px)', overflowY: 'auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text)', margin: 0 }}>Client Directory</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>Manage customer relationships, sales pipelines, and key contacts.</p>
          </div>
          <button style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <Plus size={16} /> Add Client
          </button>
        </div>

        <div style={{ textAlign: 'center', padding: 80, background: 'var(--card)', borderRadius: 12, border: '1px dashed var(--border)' }}>
          <Users size={48} style={{ color: 'var(--muted)', marginBottom: 16 }} />
          <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: '1.1rem' }}>CRM Module Enabled</p>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: 400, margin: '10px auto' }}>The Customer Relationship Management module has been provisioned in the database. Full integration arriving in the next sprint.</p>
        </div>
      </div>
    </>
  );
}
