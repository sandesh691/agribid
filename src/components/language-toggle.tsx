'use client';

import { useLanguage } from '@/lib/language-context';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>
            <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--primary-green)',
                display: 'flex',
                alignItems: 'center',
                zIndex: 2
            }}>
                <Globe size={16} />
            </div>
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                style={{
                    padding: '0.45rem 1.8rem 0.45rem 2.4rem',
                    appearance: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    borderRadius: '12px',
                    background: 'white',
                    border: '2px solid var(--primary-green)',
                    color: 'var(--primary-green)',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    minWidth: '85px',
                    boxShadow: '0 2px 4px rgba(21, 128, 61, 0.05)',
                    position: 'relative',
                    zIndex: 1
                }}
                suppressHydrationWarning
            >
                <option value="en">EN</option>
                <option value="hi">HI</option>
                <option value="kn">KN</option>
            </select>
            <div style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--primary-green)',
                fontSize: '0.6rem',
                zIndex: 2
            }}>
                ▼
            </div>
        </div>
    );
}
