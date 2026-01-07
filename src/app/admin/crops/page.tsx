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
            <h2 style={{ marginBottom: '1.5rem' }}>Marketplace Audit</h2>
            {loading ? <p>Loading listings...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee' }}>
                            <th style={{ padding: '1rem' }}>Crop / Farmer</th>
                            <th style={{ padding: '1rem' }}>Type</th>
                            <th style={{ padding: '1rem' }}>Price/Qty</th>
                            <th style={{ padding: '1rem' }}>Bids</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {crops.map(crop => (
                            <tr key={crop.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>{crop.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>ID: {crop.farmer.user.email}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span className={`badge ${crop.biddingType === 'BULK' ? 'badge-sold' : 'badge-active'}`}>{crop.biddingType}</span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div>₹{crop.minPrice}/kg</div>
                                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{crop.availableQuantity}kg available</div>
                                </td>
                                <td style={{ padding: '1rem' }}>{crop.bids.length} Bids</td>
                                <td style={{ padding: '1rem' }}>
                                    <button onClick={() => removeCrop(crop.id)} style={{ color: '#c62828', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Remove Listing</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
