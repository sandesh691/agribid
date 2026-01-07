'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useToast } from '@/lib/toast-context';
import { Wallet, ArrowDownLeft, ArrowUpRight, Landmark, History, AlertCircle } from 'lucide-react';

export default function FarmerWalletPage() {
    const { language, t } = useLanguage();
    const [wallet, setWallet] = useState<any>(null);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const { showToast } = useToast();

    // Bank details for withdrawal
    const [bankDetails, setBankDetails] = useState({
        accountHolder: '',
        accountNumber: '',
        ifscCode: ''
    });

    useEffect(() => {
        fetchWallet();
    }, []);

    const fetchWallet = async () => {
        try {
            const res = await fetch('/api/wallet');
            const data = await res.json();
            setWallet(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        const val = Number(withdrawAmount);
        if (!val || isNaN(val)) return;
        if (val > (wallet?.balance || 0)) {
            showToast(t('insufficient_balance_msg'), 'error');
            return;
        }
        if (!bankDetails.accountNumber || !bankDetails.ifscCode) {
            const msg = language === 'hi' ? 'कृपया भुगतान के लिए बैंक विवरण प्रदान करें' : (language === 'kn' ? 'ದಯವಿಟ್ಟು ಪಾವತಿಗಾಗಿ ಬ್ಯಾಂಕ್ ವಿವರಗಳನ್ನು ಒದಗಿಸಿ' : 'Please provide bank details for payout');
            showToast(msg, 'warning');
            return;
        }

        setProcessing(true);
        try {
            const res = await fetch('/api/wallet/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: val,
                    bankDetails
                })
            });
            const data = await res.json();
            if (res.ok) {
                await fetchWallet();
                setWithdrawAmount('');
                showToast(t('payout_processed_msg'), 'success');
            } else {
                showToast(data.error || 'Withdrawal failed', 'error');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
            <style jsx>{`
                .wallet-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.3fr;
                    gap: 2.5rem;
                }
                @media (max-width: 900px) {
                    .wallet-grid {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                }
                @media (max-width: 600px) {
                    .balance-title { font-size: 2.5rem !important; }
                    .header-section { flex-direction: column; align-items: flex-start !important; gap: 0.5rem; }
                }
            `}</style>

            <div className="header-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.75rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                    <Wallet size={28} color="var(--primary-green)" strokeWidth={2.5} /> {t('wallet_payout_title')}
                </h2>
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>
                    {language === 'hi' ? 'फसल की बिक्री से आपकी कमाई' : (language === 'kn' ? 'ಬೆಳೆ ಮಾರಾಟದಿಂದ ನಿಮ್ಮ ಗಳಿಕೆ' : 'Your earnings from crop sales')}
                </div>
            </div>

            <div className="wallet-grid">
                {/* Left Column: Balance and Payout */}
                <div>
                    <div className="card" style={{
                        background: 'linear-gradient(135deg, var(--primary-green) 0%, #166534 100%)',
                        color: 'white',
                        marginBottom: '1.5rem',
                        padding: '2rem',
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '24px',
                        boxShadow: '0 10px 25px -5px rgba(21, 128, 61, 0.3)'
                    }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, pointerEvents: 'none' }}>
                            <Wallet size={120} />
                        </div>
                        <span style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('available_earnings')}</span>
                        <h1 className="balance-title" style={{ fontSize: '3.5rem', margin: '0.5rem 0', fontWeight: '900', letterSpacing: '-1px' }}>₹{loading ? '...' : wallet?.balance?.toLocaleString()}</h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', background: 'rgba(255,255,255,0.15)', padding: '0.5rem 1rem', borderRadius: '12px', width: 'fit-content', fontWeight: '600' }}>
                            <div style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 8px #4ade80' }}></div>
                            {t('funds_ready_desc')}
                        </div>
                    </div>

                    <div className="card" style={{ borderRadius: '24px', padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800', fontSize: '1.25rem' }}>
                            <ArrowDownLeft size={22} color="#ef4444" /> {t('withdraw_to_bank')}
                        </h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '700', color: '#1e293b' }}>{t('payout_amount')}</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', fontWeight: '700', color: '#64748b' }}>₹</span>
                                <input
                                    type="number"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder="0.00"
                                    style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.25rem', borderRadius: '12px', border: '2px solid #f1f5f9', outline: 'none', fontSize: '1.15rem', fontWeight: '800', transition: 'border-color 0.2s', background: '#f8fafc' }}
                                />
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: '600' }}>
                                <span>{t('min_amount')}</span>
                                <span>{t('max_available')}: ₹{wallet?.balance || 0}</span>
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '16px', marginBottom: '1.5rem', border: '1px solid #f1f5f9' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#1e293b' }}>
                                <Landmark size={18} color="var(--primary-green)" /> {t('bank_account_title')}
                            </div>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                <input
                                    placeholder={t('acc_holder_placeholder')}
                                    value={bankDetails.accountHolder}
                                    onChange={e => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: '600' }}
                                />
                                <input
                                    placeholder={t('acc_number_placeholder')}
                                    value={bankDetails.accountNumber}
                                    onChange={e => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: '600' }}
                                />
                                <input
                                    placeholder={t('ifsc_placeholder')}
                                    value={bankDetails.ifscCode}
                                    onChange={e => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: '600' }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleWithdraw}
                            className="btn-primary"
                            style={{ width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1rem', fontWeight: '800', boxShadow: '0 4px 12px rgba(22, 101, 52, 0.2)' }}
                            disabled={processing || !withdrawAmount}
                        >
                            {processing ? (language === 'hi' ? 'प्रक्रिया जारी है...' : (language === 'kn' ? 'ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲಾಗುತ್ತಿದೆ...' : 'Processing...')) : t('transfer_to_bank_btn')}
                        </button>
                    </div>
                </div>

                {/* Right Column: history */}
                <div>
                    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '24px', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800', fontSize: '1.25rem' }}>
                                <History size={22} color="#64748b" /> {t('earning_history')}
                            </h3>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
                                {language === 'hi' ? 'इतिहास लोड हो रहा है...' : (language === 'kn' ? 'ಇತಿಹಾಸವನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Loading history...')}
                            </div>
                        ) : !wallet?.transactions || wallet.transactions.length === 0 ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', textAlign: 'center' }}>
                                <div style={{ width: '60px', height: '60px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#cbd5e1' }}>
                                    <AlertCircle size={32} />
                                </div>
                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '800' }}>{t('no_history_yet')}</h4>
                                <p style={{ fontSize: '0.9rem', color: '#94a3b8', margin: 0, lineHeight: '1.5' }}>{language === 'hi' ? 'आपकी कमाई और निकासी यहाँ दिखाई देगी।' : (language === 'kn' ? 'ನಿಮ್ಮ ಗಳಿಕೆ ಮತ್ತು ಪಾವತಿಗಳು ಇಲ್ಲಿ ಕಾಣಿಸಿಕೊಳ್ಳುತ್ತವೆ.' : 'Your earnings and payouts will appear here.')}</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {wallet.transactions.map((tx: any) => (
                                    <div key={tx.id} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        borderRadius: '16px',
                                        background: 'white',
                                        border: '1px solid #f1f5f9',
                                        transition: 'all 0.2s',
                                    }}>
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '12px',
                                                background: tx.type === 'CREDIT' ? '#f0fdf4' : '#fff1f2',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: tx.type === 'CREDIT' ? '#16a34a' : '#e11d48',
                                                flexShrink: 0
                                            }}>
                                                {tx.type === 'CREDIT' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#1e293b', marginBottom: '0.1rem' }}>{tx.description}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '600' }}>{new Date(tx.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</div>
                                            </div>
                                        </div>
                                        <div style={{
                                            fontWeight: '900',
                                            fontSize: '1.1rem',
                                            color: tx.type === 'CREDIT' ? '#16a34a' : '#e11d48',
                                            letterSpacing: '-0.5px',
                                            whiteSpace: 'nowrap',
                                            marginLeft: '0.5rem'
                                        }}>
                                            {tx.type === 'CREDIT' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
