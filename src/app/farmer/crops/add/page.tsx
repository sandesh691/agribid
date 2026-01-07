'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { useToast } from '@/lib/toast-context';
import { Plus, Info, LayoutPanelTop, LayoutPanelLeft, Clock, ShieldCheck, Sparkles, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddCropPage() {
    const { language, t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        biddingType: 'BULK',
        totalQuantity: 100,
        qualityGrade: 'A',
        minPrice: '',
        scheduledStartTime: '09:00',
        scheduledDuration: 8,
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/crops', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                showToast(language === 'hi' ? 'फसल सफलतापूर्वक सूचीबद्ध की गई!' : (language === 'kn' ? 'ಬೆಳೆಯನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪಟ್ಟಿ ಮಾಡಲಾಗಿದೆ!' : 'Crop listed successfully!'), 'success');
                router.push('/farmer/crops');
            } else {
                const data = await res.json();
                showToast(data.error || t('failed_add_crop'), 'error');
            }
        } catch (err) {
            showToast('An unexpected error occurred', 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem', paddingBottom: '4rem' }}>
            <Link href="/farmer/crops" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', marginBottom: '1.5rem', fontWeight: '600', fontSize: '0.95rem' }}>
                <ChevronLeft size={18} /> {t('sidebar_back_home')}
            </Link>

            <div className="card" style={{ padding: 'clamp(1.5rem, 5vw, 3rem)', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ width: '48px', height: '48px', background: '#f0fdf4', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', color: 'var(--primary-green)' }}>
                        <Plus size={24} />
                    </div>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 6vw, 2.25rem)', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem' }}>{t('list_new_crop_title')}</h2>
                    <p style={{ color: '#64748b', fontSize: '1rem' }}>{language === 'hi' ? 'अपनी फसल के विवरण भरें और नीलामी शुरू करें।' : (language === 'kn' ? 'ನಿಮ್ಮ ಬೆಳೆ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ ಮತ್ತು ಹರಾಜನ್ನು ಪ್ರಾರಂಭಿಸಿ.' : 'Fill in your crop details and start your auction.')}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>{t('crop_name_label')}</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: '100%', padding: '1.1rem', borderRadius: '16px', border: '2px solid #f1f5f9', fontSize: '1.1rem', background: '#f8fafc', fontWeight: '600', outline: 'none', transition: 'border-color 0.2s' }}
                            placeholder={t('basmati_rice_placeholder')}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>{t('bidding_type_label')}</label>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div
                                onClick={() => setFormData({ ...formData, biddingType: 'BULK', totalQuantity: 100 })}
                                style={{
                                    flex: '1 1 280px',
                                    padding: '1.5rem',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: '2px solid',
                                    borderColor: formData.biddingType === 'BULK' ? 'var(--primary-green)' : '#f1f5f9',
                                    background: formData.biddingType === 'BULK' ? '#f0fdf4' : 'white',
                                    boxShadow: formData.biddingType === 'BULK' ? '0 10px 15px -3px rgba(21, 128, 61, 0.1)' : 'none'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <LayoutPanelTop size={20} color={formData.biddingType === 'BULK' ? 'var(--primary-green)' : '#94a3b8'} />
                                    <strong style={{ fontSize: '1.1rem', fontWeight: '800', color: formData.biddingType === 'BULK' ? '#166534' : '#64748b' }}>BULK</strong>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: formData.biddingType === 'BULK' ? '#15803d' : '#94a3b8', lineHeight: '1.4', fontWeight: '500' }}>{t('bulk_desc')}</p>
                            </div>
                            <div
                                onClick={() => setFormData({ ...formData, biddingType: 'MINI', totalQuantity: 1 })}
                                style={{
                                    flex: '1 1 280px',
                                    padding: '1.5rem',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: '2px solid',
                                    borderColor: formData.biddingType === 'MINI' ? 'var(--primary-green)' : '#f1f5f9',
                                    background: formData.biddingType === 'MINI' ? '#f0fdf4' : 'white',
                                    boxShadow: formData.biddingType === 'MINI' ? '0 10px 15px -3px rgba(21, 128, 61, 0.1)' : 'none'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <LayoutPanelLeft size={20} color={formData.biddingType === 'MINI' ? 'var(--primary-green)' : '#94a3b8'} />
                                    <strong style={{ fontSize: '1.1rem', fontWeight: '800', color: formData.biddingType === 'MINI' ? '#166534' : '#64748b' }}>MINI</strong>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: formData.biddingType === 'MINI' ? '#15803d' : '#94a3b8', lineHeight: '1.4', fontWeight: '500' }}>{t('mini_desc')}</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>{t('total_quantity_label')}</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                min={formData.biddingType === 'BULK' ? "21" : "1"}
                                max={formData.biddingType === 'BULK' ? "10000" : "20"}
                                required
                                value={formData.totalQuantity}
                                onChange={(e) => setFormData({ ...formData, totalQuantity: Number(e.target.value) })}
                                style={{ width: '100%', padding: '1.1rem', borderRadius: '16px', border: '2px solid #f1f5f9', fontSize: '1.1rem', background: '#f8fafc', fontWeight: '700', outline: 'none' }}
                            />
                            <span style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: '#94a3b8' }}>kg</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>
                            <Info size={14} />
                            {formData.biddingType === 'BULK' ? t('bulk_quantity_rule') : t('mini_quantity_rule')}
                        </div>
                    </div>

                    {formData.biddingType === 'BULK' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>{t('start_time_label')}</label>
                                <div style={{ position: 'relative' }}>
                                    <Clock size={20} style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input
                                        type="time"
                                        required
                                        value={formData.scheduledStartTime}
                                        onChange={(e) => setFormData({ ...formData, scheduledStartTime: e.target.value })}
                                        style={{ width: '100%', padding: '1.1rem 1.1rem 1.1rem 3rem', borderRadius: '16px', border: '2px solid #f1f5f9', fontSize: '1.1rem', background: '#f8fafc', fontWeight: '600', outline: 'none' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>{t('duration_label')}</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        required
                                        value={formData.scheduledDuration}
                                        onChange={(e) => setFormData({ ...formData, scheduledDuration: Number(e.target.value) })}
                                        style={{ width: '100%', padding: '1.1rem', borderRadius: '16px', border: '2px solid #f1f5f9', fontSize: '1.1rem', background: '#f8fafc', fontWeight: '700', outline: 'none' }}
                                    />
                                    <span style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: '#94a3b8' }}>hrs</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>{t('quality_grade_label')}</label>
                            <select
                                value={formData.qualityGrade}
                                onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value })}
                                style={{ width: '100%', padding: '1.1rem', borderRadius: '16px', border: '2px solid #f1f5f9', fontSize: '1.1rem', background: '#f8fafc', fontWeight: '600', outline: 'none', cursor: 'pointer' }}
                            >
                                <option value="A">{t('grade_a_label')}</option>
                                <option value="B">{t('grade_b_label')}</option>
                                <option value="C">{t('grade_c_label')}</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '800', color: '#1e293b', fontSize: '1rem' }}>{t('min_price_label')}</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1.1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem', fontWeight: '800', color: '#94a3b8' }}>₹</span>
                                <input
                                    type="number"
                                    required
                                    value={formData.minPrice}
                                    onChange={(e) => setFormData({ ...formData, minPrice: e.target.value })}
                                    style={{ width: '100%', padding: '1.1rem 1.1rem 1.1rem 2.25rem', borderRadius: '16px', border: '2px solid #f1f5f9', fontSize: '1.1rem', background: '#f8fafc', fontWeight: '800', outline: 'none' }}
                                    placeholder="0"
                                />
                                <span style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: '#94a3b8', fontSize: '0.9rem' }}>/kg</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#f0fdf4', padding: '2rem', borderRadius: '24px', marginBottom: '3rem', border: '2px dashed #bbf7d0', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.1, color: 'var(--primary-green)' }}>
                            <Sparkles size={100} />
                        </div>
                        <h4 style={{ color: '#166534', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '1.1rem', fontWeight: '900' }}>
                            <Sparkles size={20} /> {t('ai_fair_price')}
                        </h4>
                        <p style={{ fontSize: '1rem', color: '#15803d', fontWeight: '500', lineHeight: '1.5' }}>
                            {t('ai_price_desc_template')
                                .replace('{crop}', formData.name || (language === 'hi' ? 'इस फसल' : (language === 'kn' ? 'ಈ ಬೆಳೆ' : 'this crop')))
                                .replace('{grade}', formData.qualityGrade)}
                        </p>
                        <div style={{ fontWeight: '900', marginTop: '1rem', fontSize: '1.75rem', color: '#166534', letterSpacing: '-0.5px' }}>
                            ₹{formData.minPrice ? Math.floor(Number(formData.minPrice) * 0.9) : '--'} - ₹{formData.minPrice ? Math.floor(Number(formData.minPrice) * 1.15) : '--'}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: '100%', padding: '1.25rem', fontSize: '1.25rem', fontWeight: '900', borderRadius: '20px', boxShadow: '0 10px 15px -3px rgba(21, 128, 61, 0.3)' }}
                        disabled={loading}
                    >
                        {loading ? t('creating_listing_btn') : t('list_crop_btn')}
                    </button>
                </form>
            </div>
        </div>
    );
}
