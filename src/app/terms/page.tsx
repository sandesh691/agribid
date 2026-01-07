'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Header } from '@/components/header';

export default function TermsPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <main className="container" style={{ padding: '4rem 0', flex: 1 }}>
                <h1 style={{ color: 'var(--primary-green)', marginBottom: '2rem', fontSize: '2.5rem' }}>Terms and Conditions</h1>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using AgriBid, you agree to comply with and be bound by these Terms and Conditions.
                        If you do not agree, please do not use our services.
                    </p>
                </section>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>2. User Registration</h2>
                    <p>
                        Users must provide accurate and complete information during registration.
                        Farmers and retailers are responsible for maintaining the confidentiality of their accounts.
                    </p>
                </section>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>3. Bidding and Transactions</h2>
                    <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
                        <li>All bids placed are binding.</li>
                        <li>Payments must be settled through the platform's designated wallet system or as agreed upon within platform guidelines.</li>
                        <li>Platform fees may apply to successful transactions.</li>
                    </ul>
                </section>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>4. Quality Standards</h2>
                    <p>
                        Farmers are expected to provide accurate descriptions and high-quality images of their produce.
                        Retailers have the right to report discrepancies in quality if the delivered produce does not match the description.
                    </p>
                </section>

                <section className="card">
                    <h2 style={{ marginBottom: '1rem' }}>5. Limitation of Liability</h2>
                    <p>
                        AgriBid acts as a facilitator and is not responsible for the quality of produce or any disputes arising outside the platform's oversight.
                        However, we provide a dispute resolution mechanism to support our users.
                    </p>
                </section>
            </main>
        </div>
    );
}
