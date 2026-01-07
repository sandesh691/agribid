'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Header } from '@/components/header';

export default function AboutPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <main className="container" style={{ padding: '4rem 0', flex: 1 }}>
                <h1 style={{ color: 'var(--primary-green)', marginBottom: '2rem', fontSize: '2.5rem' }}>About AgriBid</h1>

                <section className="card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Our Mission</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
                        AgriBid is dedicated to revolutionizing the agricultural supply chain by connecting farmers directly with retailers.
                        Our primary goal is to eliminate unnecessary middlemen, ensuring that farmers receive better prices for their hard work
                        while retailers get access to fresher produce at competitive rates.
                    </p>
                </section>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <section className="card">
                        <h2 style={{ marginBottom: '1rem' }}>Transparent Marketplace</h2>
                        <p>
                            We provide a transparent, bidding-based platform where every transaction is recorded and visible to the parties involved.
                            Our real-time bidding system ensures fair market pricing based on supply and demand.
                        </p>
                    </section>
                    <section className="card">
                        <h2 style={{ marginBottom: '1rem' }}>Empowering Farmers</h2>
                        <p>
                            Through AgriBid, farmers gain access to a larger pool of buyers beyond their local markets.
                            We provide them with the tools and data they need to make informed decisions about their crops and pricing.
                        </p>
                    </section>
                </div>

                <section className="card" style={{ marginTop: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Our Vision</h2>
                    <p>
                        Our vision is to become the leading digital infrastructure for agriculture in India,
                        fostering a sustainable ecosystem where technology and tradition work hand-in-hand to ensure food security
                        and economic prosperity for the farming community.
                    </p>
                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <Link href="/register" className="btn-primary">Join our community today</Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
