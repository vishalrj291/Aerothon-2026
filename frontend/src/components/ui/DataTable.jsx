import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * DataTable – sortable engineering data table.
 * Props: columns [{ key, label, align, render, width }], rows, maxHeight
 */
export function DataTable({ columns = [], rows = [], maxHeight = 400, emptyMessage = 'No data available' }) {
  const [sortKey, setSortKey]   = useState(null);
  const [sortDir, setSortDir]   = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...rows].sort((a, b) => {
    if (!sortKey) return 0;
    const av = a[sortKey], bv = b[sortKey];
    if (av == null) return 1;
    if (bv == null) return -1;
    const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });

  return (
    <div style={{
      overflowY: 'auto',
      overflowX: 'auto',
      maxHeight,
      borderRadius: 'var(--radius-md)',
    }}>
      <table className="aero-table">
        <thead style={{ position: 'sticky', top: 0, background: 'var(--color-card)', zIndex: 1 }}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: col.align || 'left',
                  width: col.width,
                  cursor: col.sortable !== false ? 'pointer' : 'default',
                  userSelect: 'none',
                }}
                onClick={() => col.sortable !== false && handleSort(col.key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: col.align === 'right' ? 'flex-end' : 'flex-start' }}>
                  {col.label}
                  {sortKey === col.key && (
                    <span style={{ color: '#3B82F6', fontSize: 10 }}>
                      {sortDir === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-dim)', fontFamily: 'var(--font-display)' }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} style={{ textAlign: col.align || 'left' }}>
                    {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
