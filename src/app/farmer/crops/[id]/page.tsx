'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/lib/toast-context';
import { useModal } from '@/lib/modal-context';

export default function CropBidsPage() {
    const { id } = useParams();
    const { showToast } = useToast();
    const { showModal } = useModal();
    const [crop, setCrop] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchCropDetails();
    }, [id]);

    const fetchCropDetails = async () => {
        try {
            // In a real app, this would be a specific endpoint for the farmer's crop view
            const res = await fetch(`/api/crops/details?id=${id}`);
            const data = await res.json();
            setCrop(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const acceptBid = async (bidId: string) => {
        showModal({
            title: 'Accept this bid?',
            message: 'Once accepted, this bid will be finalized and a transaction record will be created. This action cannot be undone.',
            type: 'confirm',
            confirmText: 'Yes, Accept Bid',
            cancelText: 'No, Go Back',
            onConfirm: async () => {
                setProcessing(true);
                try {
                    const res = await fetch(`/api/bids/${bidId}/accept`, { method: 'POST' });
                    const data = await res.json();
                    if (res.ok) {
                        showToast('Bid accepted successfully!', 'success');
                        fetchCropDetails();
                    } else {
                        showToast(data.error || 'Failed to accept bid', 'error');
                    }
                } catch (err) {
                    showToast('An error occurred', 'error');
                } finally {
                    setProcessing(false);
                }
            }
        });
    };

    if (loading) return <div>Loading crop bids...</div>;
    if (!crop) return <div>Crop not found.</div>;

    return (
        <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ marginBottom: '0.5rem' }}>{crop.name}</h2>
                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
                            <span>Listed: {new Date(crop.biddingStartTime).toLocaleDateString()}</span>
                            <span>Available: <strong>{crop.availableQuantity} / {crop.totalQuantity} kg</strong></span>
                            <span>Status: <strong style={{ color: crop.status === 'ACTIVE' ? 'var(--primary-green)' : 'red' }}>{crop.status}</strong></span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Min Price</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>₹{crop.minPrice}/kg</div>
                    </div>
                </div>
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Active Bids ({crop.bids.length})</h3>

            {crop.bids.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>No bids received yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {crop.bids.map((bid: any) => (
                        <div key={bid.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: bid.status === 'ACCEPTED' ? '4px solid var(--primary-green)' : 'none' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>₹{bid.pricePerKg}/kg</span>
                                    <span className="badge badge-active">{bid.quantity} kg</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total: ₹{bid.pricePerKg * bid.quantity}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    Bidder: <strong>{bid.retailer?.retailerProfile?.businessName || 'Unknown'}</strong> •
                                    Trust Score: <strong style={{ color: 'var(--primary-green)' }}>{bid.retailer.trustScore}%</strong> • {new Date(bid.timestamp).toLocaleString()}
                                </div>
                                {bid.status === 'ACCEPTED' && <div style={{ color: 'var(--primary-green)', fontWeight: 'bold', marginTop: '0.5rem' }}>✅ ACCEPTED</div>}
                            </div>
                            {bid.status === 'PENDING' && crop.status === 'ACTIVE' && (
                                <button
                                    onClick={() => acceptBid(bid.id)}
                                    className="btn-primary"
                                    disabled={processing || crop.availableQuantity < bid.quantity}
                                >
                                    Accept Bid
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
