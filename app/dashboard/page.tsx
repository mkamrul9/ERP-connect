/**
 * Dashboard / Daily Tasks Module — v5.0 (Mobile Responsive)
 *
 * Mobile-first redesign:
 *  - Desktop: Full table view (unchanged behaviour)
 *  - Mobile (<768px): Beautiful card-based list view
 *    • Each task shown as a rich card with all fields tap-to-edit
 *    • Floating "+" bottom sheet for adding tasks on mobile
 *    • Board view becomes vertical stacked cards on mobile
 *    • Summary bar adapts to compact pill layout
 *
 * All functionality preserved exactly as before.
/**
 * Dashboard / Daily Tasks Module — v5.0 (Mobile Responsive)
 *
 * Mobile-first redesign:
 *  - Desktop: Full table view (unchanged behaviour)
 *  - Mobile (<768px): Beautiful card-based list view
 *    • Each task shown as a rich card with all fields tap-to-edit
 *    • Floating "+" bottom sheet for adding tasks on mobile
 *    • Board view becomes vertical stacked cards on mobile
 *    • Summary bar adapts to compact pill layout
 *
 * All functionality preserved exactly as before.
 *
 * API: /api/tasks, /api/members
 */
'use client';
import Pagination from '../components/Pagination';
import ProductivityAnalytics from '../components/ProductivityAnalytics';
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>Archived Tasks</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '2px 0 0' }}>Tasks archived on {currentDate}</p>
                </div>
              </div>
              <button onClick={() => setShowArchived(false)} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 4 }}><X size={18} /></button>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 4, margin: '8px 0 16px' }}>
              {loadingArchived ? (
                <div style={{ textAlign: 'center', padding: 30, color: 'var(--muted)' }}>Loading archived tasks...</div>
              ) : archivedTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 36, color: 'var(--muted)', fontSize: '0.88rem' }}>
                  No archived tasks found for {currentDate}.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {archivedTasks.map(t => {
                    const am = getActionMeta(t.action_type);
                    return (
                      <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '9px', padding: '12px 16px', gap: 12, flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text)', background: 'var(--card-hover)', border: '1px solid var(--border)', fontWeight: 600, fontSize: '0.72rem', padding: '2px 7px', borderRadius: '4px' }}>
                              <span style={{ color: 'var(--muted)' }}>{am.icon}</span>
                              <span>{am.label}</span>
                            </span>
                            <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>{t.title}</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            {t.recipient && <span>Recipient: {t.recipient}</span>}
                            {t.assignee_name && <span>Assignee: {t.assignee_name}</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                          <button onClick={() => handleRestoreTask(t)}
                            style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid #22c55e', color: '#22c55e', borderRadius: '7px', padding: '6px 12px', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                            title="Restore back to active list">
                            <RotateCcw size={13} />
                            <span>Restore</span>
                          </button>
                          <button onClick={() => handlePermanentDelete(t)}
                            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '7px', padding: '6px 10px', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                            title="Delete permanently">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #2a3050', paddingTop: 14 }}>
              <button onClick={() => setShowArchived(false)}
                style={{ background: 'var(--primary)', border: 'none', color: '#fff', padding: '8px 18px', borderRadius: '7px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toastMsg && <div className="toast on" style={{ background: '#1e2438', border: '1px solid var(--primary)', color: 'var(--text)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>{toastMsg}</div>}
    </>
  );
}
