'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Header } from '@/components/header';
import {
    ShoppingBasket,
    TrendingUp,
    Package,
    Phone,
    IndianRupee,
    ArrowRight,
    Camera,
    Check,
    X,
    Volume2,
    VolumeX,
    ArrowDown,
    User,
    CheckCircle2,
    ShieldCheck,
    Zap,
    Users,
    Play,
    Video,
    Search,
    Activity,
    X as CloseIcon
} from 'lucide-react';

export default function FarmerFriendlyLanding() {
    const { language, t, toggleLanguage } = useLanguage();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);
    const [mode, setMode] = useState<'FARMER' | 'RETAILER'>('FARMER');

    // Voice Assist Function
    const speak = (text: string) => {
        if (!window.speechSynthesis || isMuted) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();

        // Humanizing parameters
        utterance.pitch = 1.1; // Slightly higher pitch for more energy
        utterance.rate = 0.85; // Slightly slower for clarity
        utterance.volume = 1;

        if (language === 'hi') {
            utterance.lang = 'hi-IN';
            const hiVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('hi')) ||
                voices.find(v => v.lang.includes('hi'));
            if (hiVoice) utterance.voice = hiVoice;
        } else if (language === 'kn') {
            utterance.lang = 'kn-IN';
            // Try to find natural sounding Kannada voices
            const knVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Natural')) && v.lang.includes('kn')) ||
                voices.find(v => v.lang.includes('kn'));

            if (knVoice) {
                utterance.voice = knVoice;
            } else {
                // Fallback to Hindi if no Kannada voice found as it shares phonetic roots
                const hiVoice = voices.find(v => v.lang.includes('hi'));
                if (hiVoice) utterance.voice = hiVoice;
            }
        } else {
            utterance.lang = 'en-IN';
            const enVoice = voices.find(v => v.name.includes('Natural') && v.lang.includes('en')) ||
                voices.find(v => v.lang.includes('en-IN')) ||
                voices.find(v => v.lang.includes('en-GB'));
            if (enVoice) utterance.voice = enVoice;
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    // Pre-load voices for browser compatibility
    useEffect(() => {
        if (window.speechSynthesis) {
            window.speechSynthesis.getVoices();
            // Some browsers need this event to populate voices
            window.speechSynthesis.onvoiceschanged = () => {
                window.speechSynthesis.getVoices();
            };
        }
    }, []);

    const toggleMute = () => {
        if (!isMuted) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
        setIsMuted(!isMuted);
    };

    const actionCards = [
        {
            id: 'sell',
            label: language === 'hi' ? 'फसल बेचें' : (language === 'kn' ? 'ಬೆಳೆ ಮಾರಿ' : 'Sell Crop'),
            desc_hi: 'सबसे सही दाम पाएं',
            desc_kn: 'ಉತ್ತಮ ಬೆಲೆ ಪಡೆಯಿರಿ',
            desc_en: 'Get Best Prices',
            icon: <ShoppingBasket size={60} />,
            color: '#22c55e',
            bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            link: '/farmer/crops/add',
            voice: language === 'hi' ? 'अपनी फसल बेचने के लिए यहाँ दबाएँ' : (language === 'kn' ? 'ನಿಮ್ಮ ಬೆಳೆಗಳನ್ನು ಮಾರಾಟ ಮಾಡಲು, ಇಲ್ಲಿ ಇರಿ.' : 'Click here to sell your crop')
        },
        {
            id: 'price',
            label: language === 'hi' ? 'बाज़ार भाव' : (language === 'kn' ? 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ' : 'Market Price'),
            desc_hi: 'आज की ताज़ा मंडी',
            desc_kn: 'ಇಂದಿನ ತಾಜಾ ಮಂಡಿ ಬೆಲೆ',
            desc_en: 'Today\'s Mandi Price',
            icon: <TrendingUp size={60} />,
            color: '#f59e0b',
            bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            link: '/farmer/market',
            voice: language === 'hi' ? 'बाज़ार का ताज़ा भाव देखने के लिए यहाँ दबाएँ' : (language === 'kn' ? 'ಇಂದಿನ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳನ್ನು, ಇಲ್ಲಿ ನೋಡಿರಿ.' : 'Click here to check current market prices')
        },
        {
            id: 'sales',
            label: language === 'hi' ? 'मेरी बिक्री' : (language === 'kn' ? 'ನನ್ನ ಮಾರಾಟ' : 'My Sales'),
            desc_hi: 'पिछली सारी बेच',
            desc_kn: 'ಎಲ್ಲಾ ಮಾರಾಟದ ವಿವರಗಳು',
            desc_en: 'All your history',
            icon: <Package size={60} />,
            color: '#0ea5e9',
            bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            link: '/farmer/crops',
            voice: language === 'hi' ? 'अपनी बेची हुई फसलों की जानकारी के लिए यहाँ दबाएँ' : (language === 'kn' ? 'ನೀವು ಮಾರಾಟ ಮಾಡಿದ ಬೆಳೆಗಳ ವಿವರಗಳು, ಇಲ್ಲಿವೆ.' : 'Click here to see your sales history')
        },
        {
            id: 'support',
            label: language === 'hi' ? 'मदद चाहिए' : (language === 'kn' ? 'ಸಹಾಯ ಬೇಕೆ' : 'Need Help'),
            desc_hi: 'हमसे बात करें',
            desc_kn: 'ನಮ್ಮೊಂದಿಗೆ ಮಾತನಾಡಿ',
            desc_en: 'Talk to us',
            icon: <Phone size={60} />,
            color: '#ef4444',
            bg: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
            link: 'tel:+918197679591',
            voice: language === 'hi' ? 'हमसे बात करने के लिए यहाँ दबाएँ' : (language === 'kn' ? 'ಸಹಾಯಕ್ಕಾಗಿ, ನಮ್ಮನ್ನು ಇಲ್ಲಿ ಸಂಪರ್ಕಿಸಿ.' : 'Click here to talk to our support team')
        }
    ];

    const retailerActionCards = [
        {
            id: 'marketplace',
            label: language === 'hi' ? 'मार्केटप्लेस' : (language === 'kn' ? 'ಮಾರುಕಟ್ಟೆ' : 'Browse Market'),
            desc_hi: 'ताज़ा फसलें देखें',
            desc_kn: 'ಹೊಸ ಬೆಳೆಗಳನ್ನು ನೋಡಿ',
            desc_en: 'Explore live listings',
            icon: <ShoppingBasket size={60} />,
            color: '#15803d',
            bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            link: '/retailer/marketplace',
            voice: language === 'hi' ? 'ताज़ा फसलें देखने के लिए यहाँ दबाएँ' : (language === 'kn' ? 'ಹೊಸ ಬೆಳೆಗಳನ್ನು ನೋಡಲು ಇಲ್ಲಿ ನೋಡಿ' : 'Click here to browse fresh listings')
        },
        {
            id: 'my-bids',
            label: language === 'hi' ? 'मेरी बोलियां' : (language === 'kn' ? 'ನನ್ನ ಬಿಡ್‌ಗಳು' : 'My Active Bids'),
            desc_hi: 'बोलियों पर नज़र रखें',
            desc_kn: 'ನಿಮ್ಮ ಬಿಡ್‌ಗಳನ್ನು ಗಮನಿಸಿ',
            desc_en: 'Track your bidding',
            icon: <TrendingUp size={60} />,
            color: '#0ea5e9',
            bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            link: '/retailer/active-bids',
            voice: language === 'hi' ? 'अपनी बोलियों की जानकारी के लिए यहाँ दबाएँ' : (language === 'kn' ? 'ನಿಮ್ಮ ಬಿಡ್‌ಗಳನ್ನು ಇಲ್ಲಿ ನೋಡಿ' : 'Click here to track your bids')
        },
        {
            id: 'history',
            label: language === 'hi' ? 'खरीद इतिहास' : (language === 'kn' ? 'ಖರೀದಿ ಇತಿಹಾಸ' : 'Order History'),
            desc_hi: 'पिछले सारे ऑर्डर',
            desc_kn: 'ಎಲ್ಲಾ ಖರೀದಿ ವಿವರಗಳು',
            desc_en: 'Previous purchases',
            icon: <Package size={60} />,
            color: '#f59e0b',
            bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            link: '/retailer/history',
            voice: language === 'hi' ? 'अपने पिछले ऑर्डर्स के लिए यहाँ दबाएँ' : (language === 'kn' ? 'ನಿಮ್ಮ ಹಿಂದಿನ ಖರೀದಿಗಳನ್ನು ಇಲ್ಲಿ ನೋಡಿ' : 'Click here to see order history')
        },
        {
            id: 'wallet',
            label: language === 'hi' ? 'वॉलेट' : (language === 'kn' ? 'ವ್ಯಾಲೆಟ್' : 'Wallet'),
            desc_hi: 'पैसे और बैलेंस',
            desc_kn: 'ಹಣ ಮತ್ತು ಬಾಕಿ',
            desc_en: 'Balance & Recharge',
            icon: <IndianRupee size={60} />,
            color: '#22c55e',
            bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            link: '/retailer/wallet',
            voice: language === 'hi' ? 'वॉलेट के लिए यहाँ दबाएँ' : (language === 'kn' ? 'ನಿಮ್ಮ ವ್ಯಾಲೆಟ್ ನೋಡಲು ಇಲ್ಲಿ ನೋಡಿ' : 'Click here to manage your wallet')
        }
    ];

    const currentActionCards = mode === 'FARMER' ? actionCards : retailerActionCards;

    const steps = [
        {
            icon: <Package size={40} />,
            title_hi: 'जानकारी भरें',
            title_kn: 'ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ',
            title_en: 'List Details',
            desc_hi: 'फसल की मात्रा और दाम भरें',
            desc_kn: 'ಬೆಳೆಯ ಪ್ರಮಾಣ ಮತ್ತು ಬೆಲೆಯನ್ನು ನಮೂದಿಸಿ',
            desc_en: 'Enter crop quantity and price',
            color: '#15803d',
            voice: language === 'hi' ? 'पहले अपनी फसल की जानकारी भरें' : (language === 'kn' ? 'ಮೊದಲು ನಿಮ್ಮ ಬೆಳೆಯ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ' : 'First, enter your crop details')
        },
        {
            icon: <IndianRupee size={40} />,
            title_hi: 'बोली लगवाएं',
            title_kn: 'ಬಿಡ್ ಪಡೆಯಿರಿ',
            title_en: 'Get Bids',
            desc_hi: 'खरीदार खुद दाम लगाएंगे',
            desc_kn: 'ಖರೀದಿದಾರರು ನಿಮ್ಮ ಬೆಳೆಗೆ ಬಿಡ್ ಮಾಡಲಿ',
            desc_en: 'Let buyers bid for your crop',
            color: '#f59e0b',
            voice: language === 'hi' ? 'अब व्यापारियों को बोली लगाने दें' : (language === 'kn' ? 'ಈಗ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಬಿಡ್ ಮಾಡಲು ಅವಕಾಶ ಕೊಡಿ' : 'Now, let retailers place their bids')
        },
        {
            icon: <CheckCircle2 size={40} />,
            title_hi: 'पैसे पाएं',
            title_kn: 'ಹಣ ಪಡೆಯಿರಿ',
            title_en: 'Get Paid',
            desc_hi: 'सीधा बैंक में पैसा आएगा',
            desc_kn: 'ಹಣವು ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಬರುತ್ತದೆ',
            desc_en: 'Receive money directly in bank',
            color: '#3b82f6',
            voice: language === 'hi' ? 'अंत में सीधा पैसा अपने बैंक में पाएं' : (language === 'kn' ? 'ಕೊನೆಯಲ್ಲಿ ಹಣ ನೇರವಾಗಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಬರುತ್ತದೆ' : 'Finally, receive payment directly in your bank')
        }
    ];

    const retailerSteps = [
        {
            icon: <Search size={40} />,
            title_hi: 'फसल खोजें',
            title_kn: 'ಬೆಳೆ ಹುಡುಕಿ',
            title_en: 'Browse Market',
            desc_hi: 'सत्यापित किसानों से खरीदें',
            desc_kn: 'ಪರಿಶೀಲಿಸಿದ ರೈತರಿಂದ ಖರೀದಿಸಿ',
            desc_en: 'Choose from verified listings',
            color: '#3b82f6',
            voice: language === 'hi' ? 'ताज़ा फसलों के लिए बाज़ार देखें' : (language === 'kn' ? 'ತಾಜಾ ಬೆಳೆಗಳಿಗಾಗಿ ಮಾರುಕಟ್ಟೆಯನ್ನು ನೋಡಿ' : 'Browse the market for fresh crops')
        },
        {
            icon: <TrendingUp size={40} />,
            title_hi: 'बोली लगाएं',
            title_kn: 'ಬಿಡ್ ಮಾಡಿ',
            title_en: 'Place Bid',
            desc_hi: 'अपना दाम और मात्रा भरें',
            desc_kn: 'ನಿಮ್ಮ ಬೆಲೆ ಮತ್ತು ಪ್ರಮಾಣ ನಮೂದಿಸಿ',
            desc_en: 'Enter your price and quantity',
            color: '#f59e0b',
            voice: language === 'hi' ? 'अपनी पसंद की फसल पर बोली लगाएं' : (language === 'kn' ? 'ನಿಮಗೆ ಇಷ್ಟವಾದ ಬೆಳೆಯ ಮೇಲೆ ಬಿಡ್ ಮಾಡಿ' : 'Place a bid on your preferred crop')
        },
        {
            icon: <ShieldCheck size={40} />,
            title_hi: 'सीधी डिलीवरी',
            title_kn: 'ನೇರ ವಿತರಣೆ',
            title_en: 'Direct Delivery',
            desc_hi: 'खेत से सीधा आप तक',
            desc_kn: 'ನೇರವಾಗಿ ನಿಮ್ಮ ಮನೆ ಬಾಗಿಲಿಗೆ',
            desc_en: 'Crops delivered from the farm',
            color: '#15803d',
            voice: language === 'hi' ? 'खेत से सीधा माल अपने पास मंगवाएं' : (language === 'kn' ? 'ನೇರವಾಗಿ ಫಾರ್ಮ್‌ನಿಂದ ಉತ್ಪನ್ನಗಳನ್ನು ಪಡೆಯಿರಿ' : 'Get products delivered directly from the farm')
        }
    ];

    const currentSteps = mode === 'FARMER' ? steps : retailerSteps;
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % currentSteps.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [currentSteps.length]);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#fff',
            fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>
            <Header />

            {/* Voice Assist Float */}
            <button
                onClick={toggleMute}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: isMuted ? '#64748b' : (isSpeaking ? '#ef4444' : '#15803d'),
                    color: 'white',
                    border: '4px solid white',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                    zIndex: 1000,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
            </button>

            {/* Premium Hero Section */}
            <section className="hero-section">
                <div className="hero-bg" />
                <div className="hero-overlay" />

                <div className="container" style={{ position: 'relative', zIndex: 1, color: 'white' }}>
                    <div style={{ maxWidth: '700px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '100px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', marginBottom: '1.5rem', fontWeight: 800, fontSize: '0.8rem', color: '#4ade80' }}>
                            <ShieldCheck size={14} /> {language === 'hi' ? '100% सुरक्षित और भरोसेमंद' : (language === 'kn' ? '100% ಸುಭದ್ರ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹ' : '100% Safe & Trusted')}
                        </div>
                        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                            {mode === 'FARMER' ? (
                                <>
                                    {language === 'hi' ? 'अपनी फसल का ' : (language === 'kn' ? 'ನಿಮ್ಮ ಬೆಳೆಯ ' : 'Get the ')}
                                    <span className="text-gradient" style={{ borderBottom: '6px solid var(--primary-green)' }}>
                                        {language === 'hi' ? 'सही दाम ' : (language === 'kn' ? 'ಸರಿಯಾದ ಬೆಲೆ ' : 'Best Price ')}
                                    </span>
                                    {language === 'hi' ? 'पाएं!' : (language === 'kn' ? 'ಪಡೆಯಿರಿ' : 'for your Crop!')}
                                </>
                            ) : (
                                <>
                                    {language === 'hi' ? 'खेतों से ' : (language === 'kn' ? 'ನೇರವಾಗಿ ' : 'Source ')}
                                    <span className="text-gradient" style={{ borderBottom: '6px solid var(--secondary)' }}>
                                        {language === 'hi' ? 'सीधा ' : (language === 'kn' ? 'ಫಾರ್ಮ್‌ನಿಂದ ' : 'Directly ')}
                                    </span>
                                    {language === 'hi' ? 'खरीदें!' : (language === 'kn' ? 'ಖರೀದಿಸಿ' : 'from Farmers!')}
                                </>
                            )}
                        </h1>
                        <p style={{ fontSize: '1.5rem', opacity: 0.9, marginBottom: '2.5rem', fontWeight: 500 }}>
                            {mode === 'FARMER'
                                ? (language === 'hi' ? 'बीच के दलालों को हटाएं, सीधा व्यापारियों को बेचें।' : (language === 'kn' ? 'ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಮಾರಿ.' : 'Remove middlemen. Sell directly to retailers.'))
                                : (language === 'hi' ? 'बिना बिचौलियों के, किसानों से सीधा ताज़ा माल मंगवाएं।' : (language === 'kn' ? 'ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರವಾಗಿ ರೈತರಿಂದ ತಾಜಾ ಉತ್ಪನ್ನಗಳನ್ನು ಪಡೆಯಿರಿ.' : 'Verified quality. Competitive bidding. No middlemen markup.'))
                            }
                        </p>
                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                            <Link
                                href={mode === 'FARMER' ? "/farmer/crops/add" : "/retailer/marketplace"}
                                className="btn-primary full-width-mobile"
                                style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', background: mode === 'RETAILER' ? 'var(--secondary)' : 'var(--primary-green)' }}
                                onMouseEnter={() => speak(mode === 'FARMER'
                                    ? (language === 'hi' ? 'बेचना शुरू करें' : (language === 'kn' ? 'ಈಗ ಬೆಳೆ ಮಾರಾಟ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿ' : 'Start Selling'))
                                    : (language === 'hi' ? 'खरीदना शुरू करें' : (language === 'kn' ? 'ಬೆಳೆಗಳನ್ನು ಖರೀದಿಸಲು ಇಲ್ಲಿ ನೋಡಿ' : 'Start Buying'))
                                )}
                            >
                                {mode === 'FARMER'
                                    ? (language === 'hi' ? 'अभी बेचना शुरू करें' : (language === 'kn' ? 'ಈಗಲೇ ಮಾರಾಟ ಪ್ರಾರಂಭಿಸಿ' : 'Start Selling Now'))
                                    : (language === 'hi' ? 'खरीदारी शुरू करें' : (language === 'kn' ? 'ಖರೀದಿ ಪ್ರಾರಂಭಿಸಿ' : 'Start Buying Now'))
                                } <ArrowRight />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Ticker for Market Activity */}
            <div className="ticker-wrap" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="ticker-move">
                    {[
                        { n: language === 'hi' ? 'गेहूँ' : (language === 'kn' ? 'ಗೋಧಿ' : 'Wheat'), p: '₹2,450', l: 'Punjab' },
                        { n: language === 'hi' ? 'टमाटर' : (language === 'kn' ? 'ಟೊಮೆಟೊ' : 'Tomato'), p: '₹3,200', l: 'Karnataka' },
                        { n: language === 'hi' ? 'प्याज़' : (language === 'kn' ? 'ಈರುಳ್ಳಿ' : 'Onion'), p: '₹1,800', l: 'Maharashtra' },
                        { n: language === 'hi' ? 'चावल' : (language === 'kn' ? 'ಅಕ್ಕಿ' : 'Rice'), p: '₹4,100', l: 'Haryana' },
                    ].concat([
                        { n: language === 'hi' ? 'गेहूँ' : (language === 'kn' ? 'ಗೋಧಿ' : 'Wheat'), p: '₹2,450', l: 'Punjab' },
                        { n: language === 'hi' ? 'टमाटर' : (language === 'kn' ? 'ಟೊಮೆಟೊ' : 'Tomato'), p: '₹3,200', l: 'Karnataka' },
                        { n: language === 'hi' ? 'प्याज़' : (language === 'kn' ? 'ಈರುಳ್ಳಿ' : 'Onion'), p: '₹1,800', l: 'Maharashtra' },
                        { n: language === 'hi' ? 'चावल' : (language === 'kn' ? 'ಅಕ್ಕಿ' : 'Rice'), p: '₹4,100', l: 'Haryana' },
                    ]).map((item, i) => (
                        <div key={i} className="ticker-item" style={{ gap: '1.5rem' }}>
                            <span style={{ fontWeight: 800, color: 'var(--primary-light)' }}>● LIVE</span>
                            <span style={{ fontWeight: 700 }}>{item.n} Sold in {item.l}</span>
                            <span style={{ fontWeight: 900, color: '#4ade80' }}>{item.p}/qtl</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Action Grid - Elevated Design */}
            <section style={{ padding: '6rem 0', background: 'var(--bg-alt)', position: 'relative', zIndex: 2 }}>
                <div className="container">
                    {/* Role Switcher */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                        <div style={{ background: '#e2e8f0', padding: '0.4rem', borderRadius: '100px', display: 'flex', gap: '0.2rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                            <button
                                onClick={() => setMode('FARMER')}
                                onMouseEnter={() => speak(language === 'hi' ? 'किसान मोड' : (language === 'kn' ? 'ರೈತರ ವಿಭಾಗ.' : 'Farmer Mode'))}
                                style={{
                                    padding: '0.8rem 2rem',
                                    borderRadius: '100px',
                                    border: 'none',
                                    background: mode === 'FARMER' ? 'white' : 'transparent',
                                    color: mode === 'FARMER' ? 'var(--primary-green)' : '#64748b',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    boxShadow: mode === 'FARMER' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                {language === 'hi' ? 'किसान' : (language === 'kn' ? 'ರೈತ' : 'Farmer')}
                            </button>
                            <button
                                onClick={() => setMode('RETAILER')}
                                onMouseEnter={() => speak(language === 'hi' ? 'व्यापारी मोड' : (language === 'kn' ? 'ವ್ಯಾಪಾರಿಗಳ ವಿಭಾಗ.' : 'Retailer Mode'))}
                                style={{
                                    padding: '0.8rem 2rem',
                                    borderRadius: '100px',
                                    border: 'none',
                                    background: mode === 'RETAILER' ? 'white' : 'transparent',
                                    color: mode === 'RETAILER' ? 'var(--secondary)' : '#64748b',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    boxShadow: mode === 'RETAILER' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                {language === 'hi' ? 'व्यापारी' : (language === 'kn' ? 'ವ್ಯಾಪಾರಿ' : 'Retailer')}
                            </button>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--text-main)' }}>
                            {language === 'hi' ? 'आप क्या करना चाहते हैं?' : (language === 'kn' ? 'ನೀವು ಏನು ಮಾಡಲು ಬಯಸುತ್ತೀರಿ?' : 'What would you like to do?')}
                        </h2>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 100%, 350px), 1fr))',
                        gap: '1.5rem',
                        position: 'relative',
                        zIndex: 3
                    }}>
                        {currentActionCards.map((card) => (
                            <Link
                                key={card.id}
                                href={card.link}
                                onMouseEnter={() => speak(card.voice)}
                                className="card"
                                style={{
                                    background: card.bg,
                                    padding: '2rem 1.5rem',
                                    textAlign: 'center',
                                    border: 'none',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    zIndex: 5
                                }}
                            >
                                <div style={{
                                    color: card.color,
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    transform: 'scale(0.8)'
                                }}>
                                    {card.icon}
                                </div>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                                    {card.label}
                                </h3>
                                <p style={{ fontSize: '1.1rem', color: '#64748b', fontWeight: 700 }}>
                                    {language === 'hi' ? card.desc_hi : (language === 'kn' ? card.desc_kn : card.desc_en)}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Market Intelligence Hub for Farmers */}
            {mode === 'FARMER' && (
                <section style={{ padding: '4rem 0', background: 'white' }}>
                    <div className="container">
                        <div className="card" style={{ border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)', padding: '3rem', borderRadius: '40px', background: 'linear-gradient(to bottom right, #ffffff, #f0fdf4)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--primary-green)', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <TrendingUp size={40} /> {t('market_intelligence')}
                                    </h2>
                                    <p style={{ color: '#64748b', fontSize: '1.2rem', fontWeight: 600 }}>{t('market_insight_desc')}</p>
                                </div>
                                <Link href="/register?role=farmer" className="btn-primary" style={{ background: 'var(--primary-green)', padding: '1rem 2rem' }}>
                                    {t('get_started')} <ArrowRight />
                                </Link>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                                {/* Onion Intelligence */}
                                <div className="hover-shadow" style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', transition: 'all 0.3s ease' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div style={{ fontSize: '3.5rem' }}>🧅</div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: '900', color: 'var(--primary-green)', fontSize: '1.5rem' }}>+24%</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>{t('last_3m_trend')}</div>
                                        </div>
                                    </div>
                                    <h4 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>{language === 'hi' ? 'प्याज (ए-ग्रेड)' : (language === 'kn' ? 'ಈರುಳ್ಳಿ (ಎ-ದರ್ಜೆ)' : 'Onion (A-Grade)')}</h4>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                        <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>{t('high_profit_potential')}</span>
                                    </div>
                                    <div style={{ padding: '1rem', background: '#ecfdf5', borderRadius: '16px', borderLeft: '6px solid #10b981', marginBottom: '1.5rem' }}>
                                        <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#065f46', marginBottom: '0.2rem' }}>{t('smart_advice')}:</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 600 }}>{t('harvest_now')}</div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{t('current_mandi')}</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e293b' }}>₹1,800</div>
                                        </div>
                                        <div style={{ padding: '0.75rem', background: '#f0fdf4', borderRadius: '12px', textAlign: 'center', border: '1px dashed #22c55e' }}>
                                            <div style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>{t('predicted_price')}</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#166534' }}>₹2,250</div>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
                                        <strong>{t('future_demand_proj')}:</strong> {t('onion_trend')}
                                    </div>
                                </div>

                                {/* Wheat Intelligence */}
                                <div className="hover-shadow" style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', transition: 'all 0.3s ease' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div style={{ fontSize: '3.5rem' }}>🌾</div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: '900', color: '#0ea5e9', fontSize: '1.5rem' }}>+8%</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>{t('last_3m_trend')}</div>
                                        </div>
                                    </div>
                                    <h4 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>{language === 'hi' ? 'गेहूं' : (language === 'kn' ? 'ಗೋಧಿ' : 'Wheat')}</h4>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                        <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>{t('wait_and_sell')}</span>
                                    </div>
                                    <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: '16px', borderLeft: '6px solid #0ea5e9', marginBottom: '1.5rem' }}>
                                        <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#075985', marginBottom: '0.2rem' }}>{t('smart_advice')}:</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 600 }}>{t('wheat_advice')}</div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{t('current_mandi')}</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e293b' }}>₹2,450</div>
                                        </div>
                                        <div style={{ padding: '0.75rem', background: '#f0f9ff', borderRadius: '12px', textAlign: 'center', border: '1px dashed #0284c7' }}>
                                            <div style={{ fontSize: '0.7rem', color: '#0369a1', fontWeight: 700, textTransform: 'uppercase' }}>{t('predicted_price')}</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0369a1' }}>₹2,700</div>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
                                        <strong>{t('future_demand_proj')}:</strong> {language === 'hi' ? 'ठंड में मांग बढ़ने की उम्मीद' : (language === 'kn' ? 'ಚಳಿಗಾಲದಲ್ಲಿ ಬೇಡಿಕೆ ಹೆಚ್ಚಾಗುವ ಸಾಧ್ಯತೆ' : 'Winter demand spike expected')}
                                    </div>
                                </div>

                                {/* Sugarcane Intelligence */}
                                <div className="hover-shadow" style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0', transition: 'all 0.3s ease' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                        <div style={{ fontSize: '3.5rem' }}>🌱</div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: '900', color: '#f59e0b', fontSize: '1.5rem' }}>NEW</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>DEMAND SPIKE</div>
                                        </div>
                                    </div>
                                    <h4 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>{language === 'hi' ? 'गन्ना' : (language === 'kn' ? 'ಕಬ್ಬು' : 'Sugarcane')}</h4>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                        <span style={{ background: '#fef3c7', color: '#92400e', padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800 }}>{t('growth_recommendation')}</span>
                                    </div>
                                    <div style={{ padding: '1rem', background: '#fffbeb', borderRadius: '16px', borderLeft: '6px solid #f59e0b', marginBottom: '1.5rem' }}>
                                        <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#92400e', marginBottom: '0.2rem' }}>AI Insight:</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 600 }}>{t('sugarcane_demand')}</div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div style={{ padding: '0.75rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{t('current_mandi')}</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#1e293b' }}>₹3,150</div>
                                        </div>
                                        <div style={{ padding: '0.75rem', background: '#fffbeb', borderRadius: '12px', textAlign: 'center', border: '1px dashed #d97706' }}>
                                            <div style={{ fontSize: '0.7rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>{t('predicted_price')}</div>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#92400e' }}>₹3,500</div>
                                        </div>
                                    </div>

                                    <div style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
                                        <strong>{t('future_demand_proj')}:</strong> {language === 'hi' ? 'सरकारी नीतियों का लाभ' : (language === 'kn' ? 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಲಾಭ' : 'Policy-driven growth')}
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '3rem', padding: '2rem', background: 'var(--primary-green)', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                                <div style={{ fontSize: '3rem' }}>🤖</div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                                        {language === 'hi' ? 'एआई के साथ स्मार्ट खेती करें' : (language === 'kn' ? 'AI ಮೂಲಕ ಚತುರ ಕೃಷಿ ಮಾಡಿ' : 'Farm Smarter with AI')}
                                    </h3>
                                    <p style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                                        {language === 'hi'
                                            ? 'हमारा एआई आपको खेती और बिक्री के लिए बाजार के डेटा पर आधारित सही सलाह देता है।'
                                            : (language === 'kn'
                                                ? 'ನಮ್ಮ AI ನಿಮ್ಮ ಕೃಷಿ ಮತ್ತು ಮಾರಾಟದ ಕುರಿತು ಮಾರುಕಟ್ಟೆ ಡೇಟಾ ಆಧಾರಿತ ಸರಿಯಾದ ಸಲಹೆ ನೀಡುತ್ತದೆ.'
                                                : 'Our AI analyzes Indian Mandi data to guide your planting and selling schedule.')
                                        }
                                    </p>
                                </div>
                                <Link href="/farmer/market" style={{ background: 'white', color: 'var(--primary-green)', padding: '1rem 2rem', borderRadius: '100px', fontWeight: 900, textDecoration: 'none' }}>
                                    {t('explore_full_market')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* How It Works - Visual Step Section */}
            <section style={{ padding: '6rem 0', background: '#fff' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, color: mode === 'FARMER' ? 'var(--primary-green)' : 'var(--secondary)', marginBottom: '1rem' }}>
                            {mode === 'FARMER'
                                ? (language === 'hi' ? 'एग्रीबिड कैसे काम करता है?' : (language === 'kn' ? 'AgriBid ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?' : 'How AgriBid Works?'))
                                : (language === 'hi' ? 'व्यापारियों के लिए प्रक्रिया' : (language === 'kn' ? 'ವ್ಯಾಪಾರಿಗಳಿಗೆ ಪ್ರಕ್ರಿಯೆ' : 'Simple 3-Step Buying'))
                            }
                        </h2>
                    </div>
                    <div className="bento-grid" style={{ gridTemplateColumns: '1fr', gap: '3rem', gridAutoRows: 'auto' }}>
                        <div className="reveal active" style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
                                {currentSteps.map((step, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            gap: '1.5rem',
                                            alignItems: 'center',
                                            padding: '1.25rem 2rem',
                                            borderRadius: '24px',
                                            background: activeStep === idx ? (mode === 'FARMER' ? '#f0fdf4' : '#f0f9ff') : 'var(--bg-alt)',
                                            border: '2px solid',
                                            borderColor: activeStep === idx ? (mode === 'FARMER' ? 'var(--primary-green)' : 'var(--secondary)') : 'transparent',
                                            transition: 'all 0.5s ease',
                                            textAlign: 'left'
                                        }}
                                        onMouseEnter={() => {
                                            setActiveStep(idx);
                                            speak(step.voice);
                                        }}
                                    >
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '16px',
                                            background: step.color,
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}>
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{language === 'hi' ? step.title_hi : (language === 'kn' ? step.title_kn : step.title_en)}</h4>
                                            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1rem' }}>{language === 'hi' ? step.desc_hi : (language === 'kn' ? step.desc_kn : step.desc_en)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Help Center */}
            <section style={{ padding: '8rem 0', background: 'var(--bg-alt)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-green)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>
                            <Video size={20} /> {language === 'hi' ? 'सीखें' : (language === 'kn' ? 'ಕಲಿಯಿರಿ' : 'Video Guides')}
                        </div>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 900 }}>
                            {language === 'hi' ? 'AgriBid का उपयोग कैसे करें?' : (language === 'kn' ? 'AgriBid ಅನ್ನು ಹೇಗೆ ಬಳಸುವುದು?' : 'How to use AgriBid?')}
                        </h2>
                    </div>

                    <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '2rem', gridAutoRows: 'auto' }}>
                        {/* Farmer Video Card */}
                        <div
                            className="card"
                            onClick={() => setPlayingVideo('/sell-guide.mp4')}
                            onMouseEnter={() => speak(language === 'hi' ? 'किसान वीडियो गाइड देखें' : (language === 'kn' ? 'ರೈತ ವಿಡಿಯೋ ಮಾರ್ಗದರ್ಶಿ ನೋಡಿ' : 'Watch Farmer Video Guide'))}
                            style={{ padding: 0, overflow: 'hidden', border: 'none', background: '#000', cursor: 'pointer' }}
                        >
                            <div style={{ position: 'relative', height: '350px', background: 'linear-gradient(135deg, #15803d 0%, #064e3b 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ position: 'absolute', inset: 0, opacity: 0.3, background: 'url("https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80") center/cover' }} />
                                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 1, transition: 'transform 0.3s' }}>
                                    <Play size={48} fill="white" />
                                </div>
                                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: 'white' }}>
                                    <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800 }}>
                                        {language === 'hi' ? 'किसान गाइड' : (language === 'kn' ? 'ರೈತ ಮಾರ್ಗದರ್ಶಿ' : 'FARMER GUIDE')}
                                    </span>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '0.5rem' }}>
                                        {language === 'hi' ? 'अपनी फसल कैसे बेचें?' : (language === 'kn' ? 'ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಮಾರುವುದು ಹೇಗೆ?' : 'How to sell your crop?')}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Retailer Video Card */}
                        <div
                            className="card"
                            onClick={() => setPlayingVideo('/buy-guide.mp4')}
                            onMouseEnter={() => speak(language === 'hi' ? 'व्यापारी वीडियो गाइड देखें' : (language === 'kn' ? 'ವ್ಯಾಪಾರಿ ವಿಡಿಯೋ ಮಾರ್ಗದರ್ಶಿ ನೋಡಿ' : 'Watch Retailer Video Guide'))}
                            style={{ padding: 0, overflow: 'hidden', border: 'none', background: '#000', cursor: 'pointer' }}
                        >
                            <div style={{ position: 'relative', height: '350px', background: 'linear-gradient(135deg, #0ea5e9 0%, #0c4a6e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ position: 'absolute', inset: 0, opacity: 0.3, background: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80") center/cover' }} />
                                <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 1, transition: 'transform 0.3s' }}>
                                    <Play size={48} fill="white" />
                                </div>
                                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: 'white' }}>
                                    <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 800 }}>
                                        {language === 'hi' ? 'व्यापारी गाइड' : (language === 'kn' ? 'ವ್ಯಾಪಾರಿ ಮಾರ್ಗದರ್ಶಿ' : 'RETAILER GUIDE')}
                                    </span>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '0.5rem' }}>
                                        {language === 'hi' ? 'फसलें कैसे खरीदें?' : (language === 'kn' ? 'ಬೆಳೆಗಳನ್ನು ಖರೀದಿಸುವುದು ಹೇಗೆ?' : 'How to buy crops?')}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section style={{ padding: '4rem 0', background: 'var(--primary-dark)', color: 'white' }}>
                <div className="container">
                    <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '2.5rem', textAlign: 'center', gridAutoRows: 'auto' }}>
                        <div>
                            <Users size={40} style={{ margin: '0 auto 1rem', color: 'var(--primary-light)' }} />
                            <h3 style={{ fontSize: '2.5rem', fontWeight: 900 }}>5,000+</h3>
                            <p style={{ fontSize: '1rem', opacity: 0.8 }}>{language === 'hi' ? 'खुश किसान' : (language === 'kn' ? 'ಸಂತೋಷದ ರೈತರು' : 'Happy Farmers')}</p>
                        </div>
                        <div>
                            <Zap size={40} style={{ margin: '0 auto 1rem', color: 'var(--accent)' }} />
                            <h3 style={{ fontSize: '2.5rem', fontWeight: 900 }}>₹2 Cr+</h3>
                            <p style={{ fontSize: '1rem', opacity: 0.8 }}>{language === 'hi' ? 'कुल बिक्री' : (language === 'kn' ? 'ಒಟ್ಟು ಆದಾಯ' : 'Total Revenue Generated')}</p>
                        </div>
                        <div>
                            <ShieldCheck size={40} style={{ margin: '0 auto 1rem', color: '#3b82f6' }} />
                            <h3 style={{ fontSize: '2.5rem', fontWeight: 900 }}>100%</h3>
                            <p style={{ fontSize: '1rem', opacity: 0.8 }}>{language === 'hi' ? 'सुरक्षित भुगतान' : (language === 'kn' ? 'ಸುರಕ್ಷಿತ ಪಾವತಿಗಳು' : 'Secure Payments')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section style={{ padding: '4rem 0', background: '#fff' }}>
                <div className="container">
                    <div style={{
                        background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                        padding: '4rem 2rem',
                        borderRadius: '32px',
                        textAlign: 'center',
                        color: 'white',
                        boxShadow: '0 40px 80px -20px rgba(21,128,61,0.4)'
                    }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: 900, marginBottom: '1.5rem' }}>
                            {language === 'hi' ? 'क्या आप तैयार हैं?' : (language === 'kn' ? 'ನೀವು ಸಿದ್ಧರಿದ್ದೀರಾ?' : 'Are you ready?')}
                        </h2>
                        <p style={{ fontSize: 'clamp(1rem, 3vw, 1.5rem)', opacity: 0.9, marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
                            {language === 'hi' ? 'आज ही एग्रीबिड से जुड़ें और अपनी मेहनत का फल पाएं।' : (language === 'kn' ? 'ಇಂದೇ AgriBid ಸೇರಿ ಮತ್ತು ನಿಮ್ಮ ಕಠಿಣ ಪರಿಶ್ರಮಕ್ಕೆ ಪ್ರತಿಫಲ ಪಡೆಯಿರಿ.' : 'Join AgriBid today and get the rewards for your hard work.')}
                        </p>
                        <Link href="/register" className="btn-primary full-width-mobile" style={{ background: 'white', color: 'var(--primary-green)', padding: '1.25rem 3.5rem', fontSize: '1.25rem' }}>
                            {language === 'hi' ? 'फ्री में रजिस्टर करें' : (language === 'kn' ? 'ಉಚಿತವಾಗಿ ನೋಂದಾಯಿಸಿ' : 'Register for Free')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer style={{ padding: '4rem 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <div className="container">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                        {/* Government Approval Badge */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1.5rem',
                            background: 'white',
                            borderRadius: '100px',
                            border: '1px solid #cbd5e1',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ width: '24px', height: '16px', background: 'linear-gradient(#FF9933 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #128807 66.6%)', borderRadius: '2px', border: '1px solid #e2e8f0' }} />
                            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#475569' }}>
                                {language === 'hi' ? 'भारत सरकार द्वारा अनुमोदित' : (language === 'kn' ? 'ಭಾರತ ಸರ್ಕಾರದಿಂದ ಅನುಮೋದಿಸಲಾಗಿದೆ' : 'Approved by Indian Government')}
                            </span>
                        </div>

                        <div style={{ width: '100%', height: '1px', background: '#e2e8f0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <div style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
                                © 2026 AgriBid. {language === 'hi' ? 'सर्वाधिकार सुरक्षित' : (language === 'kn' ? 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ' : 'All Rights Reserved.')}
                            </div>

                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <Link
                                    href="/login?role=admin"
                                    style={{
                                        opacity: 0.4,
                                        fontSize: '0.8rem',
                                        fontWeight: '700',
                                        color: '#64748b',
                                        textDecoration: 'none',
                                        transition: 'opacity 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.4'}
                                >
                                    {language === 'hi' ? 'कर्मचारी लॉगिन' : (language === 'kn' ? 'ಸಿಬ್ಬಂದಿ ಲಾಗಿನ್' : 'STAFF ACCESS')}
                                </Link>
                                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#64748b', fontWeight: '600' }}>
                                    <Link href="/terms">{language === 'hi' ? 'नियम' : (language === 'kn' ? 'ನಿಯಮಗಳು' : 'Terms')}</Link>
                                    <Link href="/privacy">{language === 'hi' ? 'गोपनीयता' : (language === 'kn' ? 'ಗೌಪ್ಯತೆ' : 'Privacy')}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
                .bounce {
                    animation: bounce 2s infinite;
                }
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                    40% {transform: translateY(-10px);}
                    60% {transform: translateY(-5px);}
                }
                .text-gradient {
                    background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
            {/* Video Modal Player */}
            {playingVideo && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 2000,
                    background: 'rgba(0,0,0,0.9)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem'
                }}>
                    <button
                        onClick={() => setPlayingVideo(null)}
                        style={{
                            position: 'absolute',
                            top: '2rem',
                            right: '2rem',
                            background: 'white',
                            border: 'none',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            zIndex: 10
                        }}
                    >
                        <CloseIcon size={24} color="black" />
                    </button>
                    <div style={{ width: '100%', maxWidth: '1000px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <video
                            src={playingVideo}
                            controls
                            autoPlay
                            style={{ width: '100%', display: 'block' }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
