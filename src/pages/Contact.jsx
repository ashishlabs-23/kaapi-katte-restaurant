import React, { useEffect } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
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
     * DESIGN ANALYSIS: The Human Connection
     * Contacting a brand should feel like stepping into their home.
     * Large, spacious inputs invite the user to share their thoughts without friction.
     * The minimalist aesthetic ensures that the 'Human' element remains the focus.
     */
    return (
        <div style={{ background: 'var(--ivory)', color: 'var(--emerald)', overflowX: 'hidden' }}>
            {/* Header Section */}
            <section style={{ padding: '200px 24px 80px', textAlign: 'center' }} className="reveal-elite">
                <div style={{ letterSpacing: '10px', fontSize: '11px', color: 'var(--saffron)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '24px' }}>
                    Open the Door
                </div>
                <h1 style={{ fontSize: 'clamp(50px, 8vw, 100px)', margin: 0, fontStyle: 'italic', fontWeight: '900', lineHeight: 1 }}>
                    Let's Converse.
                </h1>
                <div style={{ width: '80px', height: '1px', background: 'var(--saffron)', margin: '40px auto' }} />
            </section>

            <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 160px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px' }}>
                {/* Contact Form */}
                <div className="reveal-elite">
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div style={{ position: 'relative' }}>
                            <input type="text" placeholder="Your Name" style={inputStyleElite} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <input type="email" placeholder="Email Address" style={inputStyleElite} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <textarea placeholder="Tell us your story..." rows="5" style={{ ...inputStyleElite, resize: 'none' }} />
                        </div>
                        <button style={{ 
                            padding: '24px', background: 'var(--emerald)', color: 'var(--ivory)', border: 'none',
                            fontSize: '12px', fontWeight: '800', letterSpacing: '4px', textTransform: 'uppercase',
                            cursor: 'pointer', transition: 'all 0.6s var(--ease-heavy)', position: 'relative', overflow: 'hidden',
                            borderRadius: '1px'
                        }} className="submit-btn-elite">
                            Send Message
                        </button>
                    </form>
                </div>

                {/* Contact Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }} className="reveal-elite">
                    <div style={{ padding: '48px', background: '#FFF', border: '1px solid rgba(13,31,23,0.05)', borderRadius: '2px' }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                            <MapPin color="var(--saffron)" size={32} strokeWidth={1} />
                            <div>
                                <h3 style={{ fontSize: '20px', marginBottom: '12px', fontStyle: 'italic' }}>Visit our Shrine</h3>
                                <p style={{ opacity: 0.7, lineHeight: 1.8 }}>
                                    123 Heritage Lane, Jayanagar,<br />
                                    Bengaluru, Karnataka 560041
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '48px', background: '#FFF', border: '1px solid rgba(13,31,23,0.05)', borderRadius: '2px' }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                            <Phone color="var(--saffron)" size={32} strokeWidth={1} />
                            <div>
                                <h3 style={{ fontSize: '20px', marginBottom: '12px', fontStyle: 'italic' }}>Voice Ritual</h3>
                                <p style={{ opacity: 0.7, lineHeight: 1.8 }}>+91 98765 43210</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '48px', background: '#FFF', border: '1px solid rgba(13,31,23,0.05)', borderRadius: '2px' }}>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                            <Mail color="var(--saffron)" size={32} strokeWidth={1} />
                            <div>
                                <h3 style={{ fontSize: '20px', marginBottom: '12px', fontStyle: 'italic' }}>Ink & Paper</h3>
                                <p style={{ opacity: 0.7, lineHeight: 1.8 }}>namaste@kaapikatte.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .reveal-elite { opacity: 0; transform: translateY(40px); transition: all 1.2s var(--ease-heavy); }
                .reveal-elite-active { opacity: 1; transform: translateY(0); }
                .submit-btn-elite:hover { background: var(--saffron); color: var(--emerald); transform: translateY(-4px); box-shadow: 0 20px 40px rgba(226,167,63,0.3); }
            `}</style>
        </div>
    );
}

const inputStyleElite = {
    width: '100%',
    padding: '24px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(13, 31, 23, 0.1)',
    fontSize: '18px',
    color: 'var(--emerald)',
    outline: 'none',
    transition: 'all 0.6s var(--ease-heavy)'
};
