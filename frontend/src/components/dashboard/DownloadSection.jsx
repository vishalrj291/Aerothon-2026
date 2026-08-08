import { Download, FileText, FileJson, Printer } from 'lucide-react';
import { getDownloadURL } from '../../api/client';

const ACTIONS = [
  {
    id: 'download-predictions',
    label: 'Download Predictions',
    sub: 'CSV · Health & RUL results',
    icon: Download,
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
    href: null, // use getDownloadURL()
    isDownload: true,
  },
  {
    id: 'download-maintenance',
    label: 'Maintenance Report',
    sub: 'PDF · Full maintenance analysis',
    icon: FileText,
    iconBg: '#F0FDF4',
    iconColor: '#22C55E',
    href: '#',
    isDownload: false,
  },
  {
    id: 'download-json',
    label: 'Download JSON',
    sub: 'JSON · Raw prediction data',
    icon: FileJson,
    iconBg: '#FFFBEB',
    iconColor: '#F59E0B',
    href: '#',
    isDownload: false,
  },
  {
    id: 'print-report',
    label: 'Print Report',
    sub: 'Browser print dialog',
    icon: Printer,
    iconBg: '#FAF5FF',
    iconColor: '#7C3AED',
    href: null,
    print: true,
  },
];

export function DownloadSection() {
  return (
    <div className="ae-card" style={{ padding: '20px 22px' }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1E293B' }}>Downloads & Reports</div>
        <div style={{ fontSize: 11, color: '#94A3B8' }}>Export prediction results and maintenance reports</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          const isADownload = action.isDownload;

          const content = (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: action.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={16} color={action.iconColor} />
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#1E293B' }}>{action.label}</div>
                <div style={{ fontSize: 10, color: '#94A3B8' }}>{action.sub}</div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <Download size={14} color="#94A3B8" />
              </div>
            </div>
          );

          const style = {
            display: 'flex',
            alignItems: 'center',
            padding: '10px 12px',
            border: '1px solid #E2E8F0',
            borderRadius: 8,
            background: '#fff',
            cursor: 'pointer',
            textDecoration: 'none',
            transition: 'all 150ms ease',
            width: '100%',
            textAlign: 'left',
          };

          if (action.print) {
            return (
              <button id={action.id} key={action.id} style={style} onClick={() => window.print()}>
                {content}
              </button>
            );
          }

          return (
            <a
              id={action.id}
              key={action.id}
              href={isADownload ? getDownloadURL() : (action.href || '#')}
              download={isADownload ? 'AeroTwin_Predictions.csv' : undefined}
              style={style}
              onMouseEnter={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
            >
              {content}
            </a>
          );
        })}
      </div>
    </div>
  );
}
