'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { useToast } from '@/lib/toast-context';
import { HelpCircle, Plus, X, MessageSquare, AlertTriangle, CreditCard, ChevronRight, Clock, CheckCircle } from 'lucide-react';

export default function ReportDashboard() {
    const { language, t } = useLanguage();
    const { showToast } = useToast();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        type: 'WEBSITE_ISSUE',
        subject: '',
        description: ''
    });

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res = await fetch('/api/reports');
            const data = await res.json();
            setReports(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/reports', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                showToast(t('report_success_msg'), 'success');
                setShowForm(false);
                setFormData({ type: 'WEBSITE_ISSUE', subject: '', description: '' });
                fetchReports();
            } else {
                const errorData = await res.json();
                showToast(errorData.error || 'Failed to submit report', 'error');
            }
        } catch (err) {
            console.error(err);
            const netMsg = language === 'hi' ? 'नेटवर्क त्रुटಿ हुई। कृपया पुन: प्रयास करें।' : (language === 'kn' ? 'ನೆಟ್‌ವರ್ಕ್ ದೋಷ ಸಂಭವಿಸಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.' : 'A network error occurred. Please try again.');
            showToast(netMsg, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1e293b' }}>
                    <HelpCircle size={32} color="var(--primary-green)" /> {t('support_reports_title')}
                </h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        background: showForm ? '#fee2e2' : 'var(--primary-green)',
                        border: 'none',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '12px',
                        color: showForm ? '#ef4444' : 'white',
                        cursor: 'pointer',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease',
                        boxShadow: showForm ? 'none' : '0 4px 12px rgba(21, 128, 61, 0.2)'
                    }}
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? t('cancel_btn') : t('submit_new_report')}
                </button>
            </div>

            {showForm && (
                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', marginBottom: '3rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{t('report_issue_title')}</h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', color: '#475569', fontSize: '0.95rem' }}>{t('category_label')}</label>
                            <select
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '2px solid #f1f5f9', fontSize: '1rem', background: '#f8fafc', fontWeight: '500', outline: 'none' }}
                            >
                                <option value="WEBSITE_ISSUE">{t('website_issue')}</option>
                                <option value="USER_COMPLAINT_FARMER">{t('complaint_farmer')}</option>
                                <option value="USER_COMPLAINT_RETAILER">{t('complaint_retailer')}</option>
                                <option value="PAYMENT_ISSUE">{t('payment_wallet_issue')}</option>
                                <option value="OTHER">{t('other_issue')}</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', color: '#475569', fontSize: '0.95rem' }}>{t('subject_label')}</label>
                            <input
                                type="text"
                                required
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                placeholder={t('subject_placeholder')}
                                style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '2px solid #f1f5f9', fontSize: '1rem', background: '#f8fafc', fontWeight: '500', outline: 'none' }}
                            />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', color: '#475569', fontSize: '0.95rem' }}>{t('description_label')}</label>
                            <textarea
                                required
                                rows={5}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder={t('description_placeholder')}
                                style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '2px solid #f1f5f9', fontSize: '1rem', background: '#f8fafc', fontWeight: '500', outline: 'none', resize: 'vertical' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting}
                            style={{ width: '100%', padding: '1.1rem', borderRadius: '14px', border: 'none', background: 'var(--primary-green)', color: 'white', fontWeight: '800', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(21, 128, 61, 0.2)' }}
                        >
                            {submitting ? t('submitting_btn') : t('send_report_btn')}
                        </button>
                    </form>
                </div>
            )}

            <div style={{ marginTop: '3rem' }}>
                <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{t('previous_reports_title')}</h3>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
                        <p style={{ color: '#94a3b8', fontWeight: '500' }}>{t('loading_reports')}</p>
                    </div>
                ) : reports.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '24px', color: '#94a3b8', border: '1px solid #f1f5f9' }}>
                        <MessageSquare size={48} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                        <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{t('no_reports_found_msg')}</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {reports.map((report: any) => (
                            <div key={report.id} style={{ border: '1px solid #f1f5f9', padding: '2rem', borderRadius: '20px', background: 'white', transition: 'all 0.2s ease' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '0.75rem', padding: '5px 12px', borderRadius: '100px', background: '#f1f5f9', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                {t(report.type.toLowerCase()) || report.type.replace('_', ' ')}
                                            </span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '600' }}>
                                                <Clock size={14} /> {new Date(report.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#1e293b' }}>{report.subject}</h4>
                                    </div>
                                    <span style={{
                                        fontSize: '0.85rem',
                                        padding: '6px 14px',
                                        borderRadius: '12px',
                                        fontWeight: '800',
                                        background: report.status === 'RESOLVED' ? '#dcfce7' : (report.status === 'IN_PROGRESS' ? '#fef9c3' : '#fee2e2'),
                                        color: report.status === 'RESOLVED' ? '#15803d' : (report.status === 'IN_PROGRESS' ? '#854d0e' : '#b91c1c'),
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem'
                                    }}>
                                        {report.status === 'RESOLVED' ? <CheckCircle size={16} /> : <Clock size={16} />}
                                        {report.status}
                                    </span>
                                </div>
                                <p style={{ fontSize: '1rem', color: '#475569', marginBottom: '1.5rem', lineHeight: '1.6' }}>{report.description}</p>

                                {report.adminNote && (
                                    <div style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '16px', borderLeft: '5px solid #3b82f6', marginTop: '1rem' }}>
                                        <h5 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <MessageSquare size={16} /> {t('admin_response')}
                                        </h5>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: '#1e3a8a', lineHeight: '1.5' }}>{report.adminNote}</p>
                                    </div>
                                )}
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '1rem', fontWeight: '600' }}>
                                    {t('submitted_on')} {new Date(report.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
