'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Header } from '@/components/header';

export default function PrivacyPage() {
    const { t } = useLanguage();

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <main className="container" style={{ padding: '4rem 0', flex: 1 }}>
                <h1 style={{ color: 'var(--primary-green)', marginBottom: '2rem', fontSize: '2.5rem' }}>{t('privacy_policy')}</h1>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>{t('privacy_collect_title')}</h2>
                    <p>
                        {t('privacy_collect_desc')}
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li>{t('privacy_collect_1')}</li>
                        <li>{t('privacy_collect_2')}</li>
                        <li>{t('privacy_collect_3')}</li>
                    </ul>
                </section>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>{t('privacy_use_title')}</h2>
                    <p>
                        {t('privacy_use_desc')}
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li>{t('privacy_use_1')}</li>
                        <li>{t('privacy_use_2')}</li>
                        <li>{t('privacy_use_3')}</li>
                        <li>{t('privacy_use_4')}</li>
                    </ul>
                </section>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>{t('privacy_sharing_title')}</h2>
                    <p>
                        {t('privacy_sharing_desc')}
                    </p>
                </section>

                <section className="card">
                    <h2 style={{ marginBottom: '1rem' }}>{t('privacy_rights_title')}</h2>
                    <p>
                        {t('privacy_rights_desc')}
                    </p>
                </section>
            </main>
        </div>
    );
}
