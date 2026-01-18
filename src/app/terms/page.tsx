'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Header } from '@/components/header';

export default function TermsPage() {
    const { t } = useLanguage();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <main className="container" style={{ padding: '4rem 0', flex: 1 }}>
                <h1 style={{ color: 'var(--primary-green)', marginBottom: '2rem', fontSize: '2.5rem' }}>{t('terms_conditions')}</h1>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>{t('terms_1_title')}</h2>
                    <p>
                        {t('terms_1_desc')}
                    </p>
                </section>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>{t('terms_2_title')}</h2>
                    <p>
                        {t('terms_2_desc')}
                    </p>
                </section>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>{t('terms_3_title')}</h2>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li>{t('terms_3_1')}</li>
                        <li>{t('terms_3_2')}</li>
                        <li>{t('terms_3_3')}</li>
                    </ul>
                </section>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>{t('terms_4_title')}</h2>
                    <p>
                        {t('terms_4_desc')}
                    </p>
                </section>

                <section className="card">
                    <h2 style={{ marginBottom: '1rem' }}>{t('terms_5_title')}</h2>
                    <p>
                        {t('terms_5_desc')}
                    </p>
                </section>
            </main>
        </div>
    );
}
