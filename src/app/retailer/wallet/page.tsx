'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useToast } from '@/lib/toast-context';
import { Wallet, ArrowDownLeft, ArrowUpRight, Landmark, History, AlertCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function WalletPage() {
    const { language, t } = useLanguage();
    const { showToast } = useToast();
    const [wallet, setWallet] = useState<any>(null);
    const [amount, setAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState<'add' | 'withdraw'>('add');

    // Mock bank details for UI
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

    const handleAddFunds = async () => {
        if (!amount || isNaN(Number(amount))) return;
        setProcessing(true);
        try {
            const res = await fetch('/api/wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: Number(amount) })
            });
            if (res.ok) {
                await fetchWallet();
                setAmount('');
                showToast(t('funds_added_success'), 'success');
            }
        } catch (err) {
            console.error(err);
            showToast('Failed to add funds', 'error');
        } finally {
            setProcessing(false);
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
            showToast('Please provide bank details', 'warning');
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
                showToast(t('withdrawal_success'), 'success');
            } else {
                showToast(data.error || 'Withdrawal failed', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('An error occurred', 'error');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
            {/* Breadcrumbs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <Link href="/retailer" style={{ color: 'inherit', textDecoration: 'none' }}>{t('sidebar_dashboard')}</Link>
                <ChevronRight size={14} />
                <span style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>{t('my_wallet')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary-green)', margin: 0 }}>
                    {t('my_wallet')}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdf4', color: '#166534', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                    <ShieldCheck size={18} /> {t('secure_transactions')}
                </div>
            </div>

            {/* Dashboard Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="card" style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)', color: 'white', padding: '2rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', opacity: 0.9 }}>
                            <Wallet size={20} />
                            <span style={{ fontWeight: '600', letterSpacing: '0.02em', fontSize: '0.9rem', textTransform: 'uppercase' }}>{t('available_balance')}</span>
                        </div>
                        <div style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '0.5rem' }}>
                            ₹{wallet?.balance?.toLocaleString() || '0'}
                        </div>
                    </div>
                    {/* Decorative element */}
                    <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', fontSize: '8rem', opacity: 0.1, transform: 'rotate(-15deg)' }}>
                        <Wallet />
                    </div>
                </div>

                <div className="card" style={{ background: 'white', padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ background: '#f0fdf4', color: 'var(--primary-green)', padding: '1rem', borderRadius: '16px' }}>
                            <ArrowUpRight size={28} />
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{t('pending_clearance')}</div>
                            <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1e293b' }}>₹{wallet?.pending_balance?.toLocaleString() || '0'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Tabs */}
            <div className="card" style={{ background: 'white', borderRadius: '24px', padding: '2rem', marginBottom: '3rem', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', background: '#f8fafc', padding: '0.5rem', borderRadius: '16px' }}>
                    <button
                        onClick={() => setActiveTab('add')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: activeTab === 'add' ? 'white' : 'transparent',
                            color: activeTab === 'add' ? 'var(--primary-green)' : '#64748b',
                            fontWeight: '800',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            boxShadow: activeTab === 'add' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.3s'
                        }}
                    >
                        <ArrowUpRight size={20} /> {t('topup_amount')}
                    </button>
                    <button
                        onClick={() => setActiveTab('withdraw')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: activeTab === 'withdraw' ? 'white' : 'transparent',
                            color: activeTab === 'withdraw' ? '#ef4444' : '#64748b',
                            fontWeight: '800',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            boxShadow: activeTab === 'withdraw' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                            transition: 'all 0.3s'
                        }}
                    >
                        <ArrowDownLeft size={20} /> {t('withdraw_amount')}
                    </button>
                </div>

                {activeTab === 'add' ? (
                    <div className="animate-fade">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '500px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', color: '#1e293b' }}>{t('topup_amount')}</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: '#64748b', fontSize: '1.2rem' }}>₹</span>
                                    <input
                                        type="number"
                                        placeholder="5,000"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 2.5rem', borderRadius: '16px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '1.2rem', fontWeight: '800' }}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleAddFunds}
                                disabled={processing || !amount}
                                className="btn-primary"
                                style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '800', boxShadow: '0 10px 20px rgba(34, 197, 94, 0.2)' }}
                            >
                                {processing ? t('processing_btn') : t('deposit_funds_btn')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', color: '#1e293b' }}>{t('withdraw_amount')}</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: '#64748b', fontSize: '1.2rem' }}>₹</span>
                                        <input
                                            type="number"
                                            placeholder="2,000"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                            style={{ width: '100%', padding: '1.25rem 1.25rem 1.25rem 2.5rem', borderRadius: '16px', border: '2px solid #f1f5f9', background: '#f8fafc', fontSize: '1.2rem', fontWeight: '800' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.85rem' }}>
                                        <span style={{ color: '#64748b' }}>{t('min_withdrawal')}</span>
                                        <span style={{ color: 'var(--primary-green)', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => setWithdrawAmount(wallet?.balance?.toString() || '0')}>{t('max_withdrawal')}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handleWithdraw}
                                    disabled={processing || !withdrawAmount}
                                    style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', fontSize: '1.1rem', fontWeight: '800', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(239, 68, 68, 0.2)' }}
                                >
                                    {processing ? t('processing_btn') : t('request_withdrawal_btn')}
                                </button>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '1rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', fontSize: '0.85rem', color: '#991b1b' }}>
                                    <AlertCircle size={18} style={{ flexShrink: 0 }} />
                                    <p>{t('withdrawal_time_hint')}</p>
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '20px', border: '2px solid #f1f5f9' }}>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#475569' }}>
                                    <Landmark size={20} /> {t('settlement_details')}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t('acc_holder_label')}</label>
                                        <input
                                            type="text"
                                            value={bankDetails.accountHolder}
                                            onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                                            placeholder={t('acc_holder_placeholder')}
                                            style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t('acc_number_label')}</label>
                                        <input
                                            type="text"
                                            value={bankDetails.accountNumber}
                                            onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                            placeholder={t('acc_number_placeholder')}
                                            style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t('ifsc_label')}</label>
                                        <input
                                            type="text"
                                            value={bankDetails.ifscCode}
                                            onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                                            placeholder={t('ifsc_placeholder')}
                                            style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: 'white', fontWeight: '600' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Transaction History */}
            <div className="card" style={{ background: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
                        <History color="var(--primary-green)" /> {t('transaction_history_title')}
                    </h2>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>{t('loading_history')}</div>
                ) : !wallet?.transactions?.length ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed #f1f5f9', borderRadius: '20px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📜</div>
                        <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>{t('no_transactions_found')}</h3>
                        <p style={{ color: '#94a3b8' }}>{t('wallet_activity_hint')}</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {wallet.transactions.map((tx: any) => (
                            <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderRadius: '16px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        background: tx.type === 'DEPOSIT' || tx.type === 'CREDIT' ? '#f0fdf4' : '#fef2f2',
                                        color: tx.type === 'DEPOSIT' || tx.type === 'CREDIT' ? 'var(--primary-green)' : '#ef4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {tx.type === 'DEPOSIT' || tx.type === 'CREDIT' ? <ArrowUpRight size={22} /> : <ArrowDownLeft size={22} />}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '800', color: '#1e293b' }}>
                                            {tx.type} {tx.status === 'PENDING' && <span style={{ fontSize: '0.7rem', background: '#fef3c7', color: '#92400e', padding: '0.2rem 0.5rem', borderRadius: '100px', marginLeft: '0.5rem' }}>PENDING</span>}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                            {new Date(tx.createdAt || tx.timestamp).toLocaleDateString(language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    fontSize: '1.25rem',
                                    fontWeight: '900',
                                    color: tx.type === 'DEPOSIT' || tx.type === 'CREDIT' ? 'var(--primary-green)' : '#ef4444'
                                }}>
                                    {tx.type === 'DEPOSIT' || tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
