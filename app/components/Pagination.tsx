'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 15, marginTop: 20, paddingBottom: 20 }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, borderRadius: '50%',
          background: currentPage === 1 ? 'var(--bg)' : 'var(--card)',
          border: '1px solid var(--border)',
          color: currentPage === 1 ? 'var(--muted)' : 'var(--text)',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <ChevronLeft size={18} />
      </button>
      
      <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 500 }}>
        Page <strong style={{ color: 'var(--text)' }}>{currentPage}</strong> of {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, borderRadius: '50%',
          background: currentPage === totalPages ? 'var(--bg)' : 'var(--card)',
          border: '1px solid var(--border)',
          color: currentPage === totalPages ? 'var(--muted)' : 'var(--text)',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
