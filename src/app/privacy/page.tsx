'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Header } from '@/components/header';

export default function PrivacyPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <main className="container" style={{ padding: '4rem 0', flex: 1 }}>
                <h1 style={{ color: 'var(--primary-green)', marginBottom: '2rem', fontSize: '2.5rem' }}>Privacy Policy</h1>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Data We Collect</h2>
                    <p>
                        We collect information necessary to facilitate transactions, including but not limited to:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li>Personal identification (Name, Contact number)</li>
                        <li>Farm details and location</li>
                        <li>Transaction history and bidding data</li>
                    </ul>
                </section>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>How We Use Your Data</h2>
                    <p>
                        Your data is used to:
                    </p>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li>Provide and maintain our services.</li>
                        <li>Verify user identity and prevent fraud.</li>
                        <li>Analyze market trends to provide better insights.</li>
                        <li>Facilitate communication between farmers and retailers.</li>
                    </ul>
                </section>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Data Sharing</h2>
                    <p>
                        We do not sell your personal data. We only share necessary information with other parties to complete a transaction
                        (e.g., sharing a farmer's contact with a winning retailer).
                    </p>
                </section>

                <section className="card">
                    <h2 style={{ marginBottom: '1rem' }}>Your Rights</h2>
                    <p>
                        You have the right to access, update, or delete your personal information at any time through your profile settings.
                        We take data security seriously and implement industry-standard measures to protect your information.
                    </p>
                </section>
            </main>
        </div>
    );
}
