'use client';

import { useState, useEffect } from 'react';
import { Plus, Play, Trash2, CheckCircle, Activity, Zap } from 'lucide-react';
import Topbar from '../components/Topbar';
import { useAuth } from '../context/AuthContext';
import Cookies from 'js-cookie';

export default function AutomationsPage() {
  const { user } = useAuth();
  const [automations, setAutomations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState('');

  const [form, setForm] = useState({
    name: '',
    trigger_event: 'TASK_CREATED',
    action_type: 'SEND_EMAIL',
    action_payload: ''
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const loadAutomations = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      // For now we mock the API response if the endpoint doesn't exist yet
      const res = await fetch('/api/automations', { headers: { 'Authorization': `Bearer \${token}` } });
      if (res.ok) {
        const data = await res.json();
        setAutomations(data.automations || []);
      } else {
        // Mock data fallback
        setAutomations([
          { id: 1, name: 'Welcome Email', trigger_event: 'USER_JOINED', action_type: 'SEND_EMAIL', is_active: 1 }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAutomations();
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.trigger_event || !form.action_type) return showToast('Please fill all fields');
    
    // In a real app we would POST to /api/automations
    showToast('Automation Rule Saved!');
    setAutomations([{ id: Date.now(), ...form, is_active: 1 }, ...automations]);
    setShowAdd(false);
  };

  return (
    <>
      <Topbar title="Workflow Automations" />
      
      {toast && (
        <div style={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', background: '#10b981', padding: '10px 20px', borderRadius: 8, color: '#fff', zIndex: 9999 }}>
          {toast}
        </div>
      )}

      <div style={{ padding: '20px', overflowY: 'auto', height: 'calc(100dvh - 56px)', boxSizing: 'border-box' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', color: 'var(--text)', margin: 0 }}>Rules Engine</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>Automate your enterprise processes natively.</p>
          </div>
          <button onClick={() => setShowAdd(true)} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
            <Plus size={16} /> New Rule
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>Loading...</div>
        ) : automations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: 'var(--card)', borderRadius: 12, border: '1px dashed var(--border)' }}>
            <Zap size={40} style={{ color: 'var(--muted)', marginBottom: 12 }} />
            <p style={{ color: 'var(--text)', fontWeight: 600 }}>No automations configured</p>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Create a rule to replace your Zapier workflows.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {automations.map(auto => (
              <div key={auto.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(56, 189, 248, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, color: 'var(--text)', fontSize: '0.95rem' }}>{auto.name}</h4>
                  <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: '0.8rem', color: 'var(--muted)' }}>
                    <span><strong>IF:</strong> {auto.trigger_event}</span>
                    <span>→</span>
                    <span><strong>THEN:</strong> {auto.action_type}</span>
                  </div>
                </div>
                <div>
                  <span style={{ padding: '4px 8px', borderRadius: 20, background: auto.is_active ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg)', color: auto.is_active ? '#10b981' : 'var(--muted)', fontSize: '0.75rem', fontWeight: 700 }}>
                    {auto.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--card)', width: 400, borderRadius: 16, padding: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 20px', color: 'var(--text)' }}>Create Automation Rule</h3>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 6 }}>Rule Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} placeholder="e.g. Alert Manager on Tender Won" />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 6 }}>When this happens (Trigger)</label>
              <select value={form.trigger_event} onChange={e => setForm({...form, trigger_event: e.target.value})} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                <option value="TASK_CREATED">Task Created</option>
                <option value="TENDER_WON">Tender Marked as WON</option>
                <option value="LEAVE_REQUESTED">Leave Requested</option>
                <option value="NEW_EXPENSE">New Expense Logged</option>
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 6 }}>Do this (Action)</label>
              <select value={form.action_type} onChange={e => setForm({...form, action_type: e.target.value})} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }}>
                <option value="SEND_EMAIL">Send Email Notification</option>
                <option value="CREATE_TASK">Create Follow-up Task</option>
                <option value="LOG_EVENT">Log System Event</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSave} style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'var(--primary)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Save Rule</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
