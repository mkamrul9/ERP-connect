'use client';

import Topbar from '../components/Topbar';
import { Package, Plus, Laptop, Server, Monitor, HardDrive, Edit2, Trash2 } from 'lucide-react';

const DUMMY_INVENTORY = [
  { id: 'INV-101', item: 'MacBook Pro 16" M3 Max', category: 'Laptop', assignedTo: 'John Doe', status: 'In Use', condition: 'Excellent' },
  { id: 'INV-102', item: 'Dell UltraSharp 32" 4K', category: 'Monitor', assignedTo: 'Jane Smith', status: 'In Use', condition: 'Good' },
  { id: 'INV-103', item: 'ThinkPad X1 Carbon Gen 11', category: 'Laptop', assignedTo: 'Unassigned', status: 'In Storage', condition: 'New' },
  { id: 'INV-104', item: 'AWS Outpost Server Unit', category: 'Server', assignedTo: 'IT Dept', status: 'In Use', condition: 'Excellent' },
  { id: 'INV-105', item: 'Seagate 16TB NAS HDD', category: 'Storage', assignedTo: 'Data Center', status: 'In Use', condition: 'Good' },
  { id: 'INV-106', item: 'iPad Pro 12.9"', category: 'Tablet', assignedTo: 'Sales Team', status: 'Repair', condition: 'Fair' },
];

export default function InventoryPage() {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Laptop': return <Laptop size={16} />;
      case 'Server': return <Server size={16} />;
      case 'Monitor': return <Monitor size={16} />;
      case 'Storage': return <HardDrive size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Use': return '#22c55e'; // Green
      case 'In Storage': return '#3b82f6'; // Blue
      case 'Repair': return '#ef4444'; // Red
      default: return '#64748b'; // Gray
    }
  };

  return (
    <>
      <Topbar title="Inventory & Asset Management" />
      <div className="scroll" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--text)', margin: '0 0 4px 0' }}>Asset Tracking</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>Track hardware, software licenses, and physical inventory across the company.</p>
          </div>
          <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: '8px' }}>
            <Plus size={16} /> Add Asset
          </button>
        </div>

        <div style={{ background: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          <div className="table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asset ID</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Item</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned To</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Condition</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {DUMMY_INVENTORY.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: idx === DUMMY_INVENTORY.length - 1 ? 'none' : '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: '0.85rem' }}>{item.id}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text)', fontWeight: 500, fontSize: '0.9rem' }}>{item.item}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)' }}>
                        {getCategoryIcon(item.category)} {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text)', fontSize: '0.85rem' }}>{item.assignedTo}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--muted)', fontSize: '0.85rem' }}>{item.condition}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: getStatusColor(item.status) }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: getStatusColor(item.status) }} />
                        {item.status}
                      </span>
                    </td>
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
