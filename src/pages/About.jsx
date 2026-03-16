import React, { useEffect } from 'react';
import { Coffee, Heart, Award } from 'lucide-react';

export default function About() {
    useEffect(() => {
        window.scrollTo(0, 0);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('reveal-elite-active');
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.reveal-elite');
        elements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    /**
     * DESIGN ANALYSIS: The Narrative Flow
     * We avoid flat text. Instead, we use a "Single Column Wisdom" layout 
     * that forces the user to focus on the philosophy of the brand.
     * Glassmorphism cards for 'Values' add a touch of modern luxury.
     */
    return (
        <div style={{ background: 'var(--ivory)', color: 'var(--emerald)', overflowX: 'hidden' }}>
            {/* Header Section */}
            <section style={{ padding: '200px 24px 100px', textAlign: 'center' }} className="reveal-elite">
                <div style={{ letterSpacing: '10px', fontSize: '12px', color: 'var(--saffron)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '24px' }}>
                    The Lineage
                </div>
                <h1 style={{ fontSize: 'clamp(50px, 10vw, 120px)', margin: 0, fontStyle: 'italic', fontWeight: '900', color: 'var(--emerald)' }}>
                    Born from a <br />Single Flame.
                </h1>
                <div style={{ width: '120px', height: '1px', background: 'var(--saffron)', margin: '60px auto' }} />
            </section>

            {/* Story Content */}
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 160px' }}>
                <div className="reveal-elite" style={{ marginBottom: '80px' }}>
                    <p style={{ fontSize: '24px', lineHeight: 1.8, color: '#3A4A3E', fontWeight: '400' }}>
                        In the heart of Bengaluru, where the aroma of roasting coffee beans defines the city's pulse, 
                        <span style={{ color: 'var(--saffron)', fontWeight: '700' }}> Kaapi Katte</span> was envisioned as a sanctum. 
                        It wasn't just about food; it was about the ritual—the precise way the milk falls, 
                        the exact ferment of the batter, the warmth of the hospitality.
                    </p>
                </div>

                <div className="reveal-elite" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginTop: '100px' }}>
                    {[
                        { icon: <Coffee />, title: "The Roast", desc: "Hand-selected Peaberry beans from the slopes of Chikmagalur." },
                        { icon: <Heart />, title: "The Soul", desc: "Recipes passed down through three generations of master chefs." },
                        { icon: <Award />, title: "The Standard", desc: "Strict adherence to traditional fermentation—no shortcuts." }
                    ].map((val, i) => (
                        <div key={i} style={{ 
                            padding: '40px', 
                            background: 'rgba(255,255,255,0.4)', 
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(13, 31, 23, 0.05)',
                            borderRadius: '2px',
                            textAlign: 'center',
                            transition: 'all 0.6s var(--ease-heavy)'
                        }} className="value-card-elite">
                            <div style={{ color: 'var(--saffron)', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
                                {React.cloneElement(val.icon, { size: 32, strokeWidth: 1.5 })}
                            </div>
                            <h3 style={{ fontSize: '20px', fontStyle: 'italic', marginBottom: '16px' }}>{val.title}</h3>
                            <p style={{ fontSize: '14px', opacity: 0.7, lineHeight: 1.6 }}>{val.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats Overlay */}
            <section style={{ background: 'var(--emerald)', padding: '120px 24px', color: 'var(--ivory)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '60px' }} className="reveal-elite">
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '64px', fontWeight: '900', color: 'var(--saffron)' }}>50k+</div>
                        <div style={{ letterSpacing: '4px', textTransform: 'uppercase', fontSize: '11px', opacity: 0.6 }}>Rituals Served</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '64px', fontWeight: '900', color: 'var(--saffron)' }}>3</div>
                        <div style={{ letterSpacing: '4px', textTransform: 'uppercase', fontSize: '11px', opacity: 0.6 }}>Generations</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '64px', fontWeight: '900', color: 'var(--saffron)' }}>100%</div>
                        <div style={{ letterSpacing: '4px', textTransform: 'uppercase', fontSize: '11px', opacity: 0.6 }}>Purity Pledge</div>
                    </div>
                </div>
            </section>

            <style>{`
                .reveal-elite { opacity: 0; transform: translateY(40px); transition: all 1.2s var(--ease-heavy); }
                .reveal-elite-active { opacity: 1; transform: translateY(0); }
                .value-card-elite:hover {
                    transform: translateY(-10px);
                    background: #FFF;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.05);
                }
            `}</style>
        </div>
    );
}
