'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/lib/toast-context';
import { useModal } from '@/lib/modal-context';

export default function MarketplaceAuditPage() {
    const { showToast } = useToast();
    const { showModal } = useModal();
    const [crops, setCrops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCrops();
    }, []);

    const fetchCrops = async () => {
        try {
            const res = await fetch('/api/admin/crops');
            const data = await res.json();
            setCrops(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const removeCrop = async (cropId: string) => {
        showModal({
            title: 'Remove Listing?',
            message: 'Are you sure you want to remove this crop listing? This action is permanent and will notify the farmer.',
            type: 'confirm',
            confirmText: 'Yes, Remove Listing',
            cancelText: 'Cancel',
            onConfirm: async () => {
                try {
                    const res = await fetch(`/api/admin/crops/${cropId}`, { method: 'DELETE' });
                    if (res.ok) {
                        showToast('Listing removed successfully.', 'success');
                        fetchCrops();
                    } else {
                        showToast('Failed to remove listing.', 'error');
                    }
                } catch (err) {
                    console.error(err);
                    showToast('An error occurred while removing the listing.', 'error');
                }
            }
        });
    };

    return (
        <div className="card">
            <style jsx>{`
                .mobile-audit {
                    display: none;
                }
                @media (max-width: 768px) {
                    .desktop-table {
                        display: none;
                    }
                    .mobile-audit {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }
                    .audit-card {
                        background: #f8fafc;
                        padding: 1rem;
                        border-radius: 12px;
                        border: 1px solid #e2e8f0;
                    }
                }
            `}</style>

            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 800 }}>Marketplace Audit</h2>

            {loading ? <p>Loading listings...</p> : (
                <>
                    <div className="desktop-table">
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>Crop / Farmer</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>Type</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>Price/Qty</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>Bids</th>
                                    <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {crops.map(crop => (
                                    <tr key={crop.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 700, color: '#1e293b' }}>{crop.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{crop.farmer.user.email}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '3px 8px',
                                                borderRadius: '5px',
                                                background: crop.biddingType === 'BULK' ? '#eff6ff' : '#f0fdf4',
                                                color: crop.biddingType === 'BULK' ? '#2563eb' : '#16a34a',
                                                fontSize: '0.7rem',
                                                fontWeight: 800
                                            }}>{crop.biddingType}</span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 700, color: '#1e293b' }}>₹{crop.minPrice}/kg</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{crop.availableQuantity}kg available</div>
                                        </td>
                                        <td style={{ padding: '1rem', fontWeight: 600, color: '#64748b' }}>{crop.bids.length} Bids</td>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => removeCrop(crop.id)}
                                                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                                            >
                                                Remove Listing
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mobile-audit">
                        {crops.map(crop => (
                            <div key={crop.id} className="audit-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>{crop.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{crop.farmer.user.email}</div>
                                    </div>
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        background: crop.biddingType === 'BULK' ? '#eff6ff' : '#f0fdf4',
                                        color: crop.biddingType === 'BULK' ? '#2563eb' : '#16a34a',
                                        fontSize: '0.65rem',
                                        fontWeight: 800
                                    }}>{crop.biddingType}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                                    <div style={{ fontSize: '0.85rem' }}>
                                        <div style={{ fontWeight: 700 }}>₹{crop.minPrice}/kg</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{crop.availableQuantity}kg • {crop.bids.length} bids</div>
                                    </div>
                                    <button
                                        onClick={() => removeCrop(crop.id)}
                                        style={{ color: '#ef4444', border: '1px solid #fee2e2', background: '#fef2f2', padding: '6px 10px', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem' }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        {crops.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No active listings.</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
