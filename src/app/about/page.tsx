'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Header } from '@/components/header';

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <main className="container" style={{ padding: '4rem 0', flex: 1 }}>
                <h1 style={{ color: 'var(--primary-green)', marginBottom: '2rem', fontSize: '2.5rem' }}>{t('about_title')}</h1>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>{t('about_mission_title')}</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                        {t('about_mission_desc')}
                    </p>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <section className="card">
                        <h2 style={{ marginBottom: '1rem' }}>{t('about_transparent_title')}</h2>
                        <p>
                            {t('about_transparent_desc')}
                        </p>
                    </section>
                    <section className="card">
                        <h2 style={{ marginBottom: '1rem' }}>{t('about_empowering_title')}</h2>
                        <p>
                            {t('about_empowering_desc')}
                        </p>
                    </section>
                </div>

                <section className="card" style={{ marginTop: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>{t('about_vision_title')}</h2>
                    <p>
                        {t('about_vision_desc')}
                    </p>
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <Link href="/register" className="btn-primary">{t('about_join_btn')}</Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
