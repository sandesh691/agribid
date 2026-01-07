'use client';

import Link from 'next/link';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

export default function DeniedPage() {
    const { t, language } = useLanguage();

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            background: '#fcfcfc'
        }}>
            <div style={{
                width: '120px',
                height: '120px',
                background: '#fee2e2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2rem',
                color: '#ef4444'
            }}>
                <ShieldAlert size={60} />
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: '#111827' }}>
                {language === 'hi' ? 'पहुंच वर्जित (Access Denied)' : (language === 'kn' ? 'ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ' : 'Access Denied')}
            </h1>

            <p style={{ fontSize: '1.2rem', color: '#6b7280', maxWidth: '500px', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                {language === 'hi' ? 'क्षमा करें, आपके पास इस पृष्ठ को देखने की अनुमति नहीं है। यह पृष्ठ केवल विशिष्ट उपयोगकर्ताओं के लिए है।' : (language === 'kn' ? 'ಕ್ಷಮಿಸಿ, ಈ ಪುಟವನ್ನು ನೋಡಲು ನಿಮಗೆ ಅನುಮತಿಯಿಲ್ಲ.' : 'Sorry, you do not have permission to view this page. This area is restricted to specific user roles.')}
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link href="/" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Home size={18} /> {t('home')}
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="btn-outline"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <ArrowLeft size={18} /> {language === 'hi' ? 'पीछे जाएं' : (language === 'kn' ? 'ಹಿಂದಕ್ಕೆ ಹೋಗಿ' : 'Go Back')}
                </button>
            </div>

            <div style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#9ca3af' }}>
                Error Code: 403 Forbidden | AgriBid Security Protocol
            </div>
        </div>
    );
}
