import React, { useState, useEffect } from 'react';
import { apiService, buildLocalStatsFromOrders, hasMeaningfulStats } from '../services/api';
import { useCart } from '../context/CartContext';
import { TrendingUp, IndianRupee, Lock, RefreshCcw, ShoppingCart, PieChart } from 'lucide-react';

const SECRET_PIN = '1928';
const DOT_MARK = '\u2022';
const RUPEE = '\u20B9';
const ELLIPSIS = '\u2026';

const MetricCard = ({ title, value, icon, delay }) => (
    <div style={{
        background: '#FFFFFF',
        padding: '32px',
        borderRadius: '32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
        border: '1px solid rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        animation: `slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay} forwards`,
        opacity: 0,
        transition: 'transform 0.3s ease',
    }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ background: 'rgba(22,51,33,0.05)', padding: '12px', borderRadius: '16px' }}>
                {icon}
            </div>
        </div>
        <div>
            <div style={{ color: '#6A7A6E', fontSize: '13px', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>{title}</div>
            <div style={{ fontSize: '32px', color: '#163321', fontWeight: '900' }}>{value}</div>
        </div>
    </div>
);

export default function Dashboard() {
    const { orders } = useCart();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [pin, setPin] = useState('');
    const [isHistoricalMode, setIsHistoricalMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ dailyTotal: 0, orderCount: 0, bestSellers: [], recentOrders: [] });
    const [error, setError] = useState(null);
    const [lastSync, setLastSync] = useState(null);
    const [dataSource, setDataSource] = useState('cloud');

    const fetchStats = async () => {
        if (isHistoricalMode) return;
        setLoading(true);
        setError(null);
        try {
            const data = await apiService.getDailyStats();
            if (hasMeaningfulStats(data)) {
                setStats(data);
                setDataSource('cloud');
                setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            } else {
                const localStats = buildLocalStatsFromOrders(orders);
                setStats(localStats);
                setDataSource('local');
                setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                setError(
                    localStats.orderCount > 0
                        ? "Cloud sync returned no sales data. Showing this device's local order log."
                        : 'Cloud sync returned no sales data yet.'
                );
            }
        } catch (err) {
            console.error("Dashboard fetch error:", err);
            const localStats = buildLocalStatsFromOrders(orders);
            setStats(localStats);
            setDataSource('local');
            setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            setError(
                localStats.orderCount > 0
                    ? "Cloud sync is unavailable. Showing this device's local order log."
                    : 'Cloud sync is unavailable and no local order log is stored on this device.'
            );
        } finally {
            setLoading(false);
        }
    };

    const toggleHistoricalMode = () => {
        const yesterdayData = {
            dailyTotal: 12450,
            orderCount: 42,
            bestSellers: [
                { name: "Special Masala Dosa", count: 18, total: 1170 },
                { name: "Filter Kaapi", count: 24, total: 720 },
                { name: "Ghee Podi Idli", count: 12, total: 840 }
            ],
            recentOrders: [
                { id: "ORD-9921", customer: "Rahul S.", items: [{name: "Masala Dosa", count: 1}, {name: "Kaapi", count: 1}], total: 115, time: "Yesterday" },
                { id: "ORD-9920", customer: "Anjali M.", items: [{name: "Podi Idli", count: 1}], total: 140, time: "Yesterday" },
                { id: "ORD-9919", customer: "Guest #42", items: [{name: "Kesari Bhath", count: 1}], total: 60, time: "Yesterday" }
            ]
        };

        if (!isHistoricalMode) {
            setStats(yesterdayData);
            setLastSync("Historical Analytics (Yesterday)");
            setDataSource('historical');
            setError(null);
        } else {
            fetchStats();
        }
        setIsHistoricalMode(!isHistoricalMode);
    };

    useEffect(() => {
        if (isAuthorized && !isHistoricalMode) fetchStats();
        const interval = setInterval(() => {
            if (isAuthorized && !isHistoricalMode) fetchStats();
        }, 60000);
        return () => clearInterval(interval);
    }, [isAuthorized, isHistoricalMode, orders]);

    useEffect(() => {
        if (!isAuthorized || isHistoricalMode || dataSource !== 'local') {
            return;
        }

        setStats(buildLocalStatsFromOrders(orders));
    }, [orders, isAuthorized, isHistoricalMode, dataSource]);

    const handlePinSubmit = (e) => {
        e.preventDefault();
        if (pin === SECRET_PIN) {
            setIsAuthorized(true);
        } else {
            alert('Incorrect PIN');
            setPin('');
        }
    };

    if (!isAuthorized) {
        /**
         * DESIGN ANALYSIS: The Inner Sanctum
         * Accessing the owner's dashboard should feel like entering a private, 
         * high-tech lounge. We use a deep emerald backdrop with a high-blur 
         * glassmorphism modal to create a sense of exclusivity and security.
         * The typography is a blend of traditional (Playfair) and technical (Letter-spacing).
         */
        return (
            <div style={{ 
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                background: 'linear-gradient(135deg, #0d1f17 0%, #163321 100%)',
                perspective: '1000px'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(40px)',
                    padding: '80px 48px',
                    borderRadius: '4px',
                    border: '1px solid rgba(226, 167, 63, 0.1)',
                    textAlign: 'center',
                    maxWidth: '450px',
                    width: '90%',
                    animation: 'eliteReveal 1.2s var(--ease-heavy)',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.4)',
                    position: 'relative',
                    overflow: 'hidden'
                }} className="login-modal-elite">
                    {/* Decorative Saffron Accent */}
                    <div style={{ 
                        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                        width: '60px', height: '2px', background: 'var(--saffron)' 
                    }} />

                    <div style={{ color: 'var(--saffron)', marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
                        <Lock size={48} strokeWidth={1} />
                    </div>
                    
                    <h2 style={{ 
                        fontSize: '32px', color: 'var(--ivory)', marginBottom: '12px', 
                        fontStyle: 'italic', fontWeight: '900', letterSpacing: '-0.5px' 
                    }}>
                        Owner's Lounge
                    </h2>
                    <p style={{ 
                        color: 'rgba(250, 249, 246, 0.5)', fontSize: '12px', 
                        letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '48px',
                        fontWeight: '700'
                    }}>
                        Enter Secure Sequence
                    </p>

                    <form onSubmit={handlePinSubmit} style={{ position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '48px' }}>
                            {[...Array(4)].map((_, i) => (
                                <div key={i} style={{
                                    width: '50px', height: '70px',
                                    borderBottom: `2px solid ${pin.length > i ? 'var(--saffron)' : 'rgba(255,255,255,0.1)'}`,
                                    color: 'var(--ivory)', fontSize: '24px', fontWeight: '900',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.4s var(--ease-heavy)',
                                    transform: pin.length > i ? 'translateY(-4px)' : 'none'
                                }}>
                                    {pin.length > i ? DOT_MARK : ''}
                                </div>
                            ))}
                        </div>

                        {/* Hidden input for better mobile experience while maintaining elite custom UI */}
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                autoFocus
                                style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '80px', /* Reduced height to only cover dots */
                                    opacity: 0, cursor: 'default'
                                }}
                            />

                        <button type="submit" style={{
                            width: '100%', padding: '24px', background: 'transparent',
                            color: 'var(--saffron)', border: '1px solid var(--saffron)',
                            fontSize: '11px', fontWeight: '800', letterSpacing: '4px',
                            textTransform: 'uppercase', cursor: 'pointer',
                            transition: 'all 0.6s var(--ease-heavy)'
                        }} className="login-btn-elite">
                            Verify Identity
                        </button>
                    </form>
                </div>

                <style>{`
                    @keyframes eliteReveal {
                        from { opacity: 0; transform: translateY(40px) scale(0.95); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .login-btn-elite:hover {
                        background: var(--saffron);
                        color: var(--emerald);
                        box-shadow: 0 20px 40px rgba(226, 167, 63, 0.2);
                    }
                `}</style>
            </div>
        );
    }

    const aov = stats.orderCount > 0 ? (stats.dailyTotal / stats.orderCount).toFixed(0) : 0;
    const syncIndicatorColor = error ? '#E2A73F' : (loading ? '#E2A73F' : dataSource === 'cloud' ? '#4CAF50' : '#163321');
    const syncIndicatorLabel = error
        ? (dataSource === 'local' ? 'Local fallback active' : 'Neural Link Interrupted')
        : (loading
            ? 'Synchronizing...'
            : (dataSource === 'historical'
                ? lastSync || 'Historical Analytics'
                : (dataSource === 'cloud'
                    ? `Cloud Synced - ${lastSync || 'Now'}`
                    : `Local Ledger - ${lastSync || 'Ready'}`)));
    const dataSourceCopy = dataSource === 'cloud'
        ? 'Cloud-backed sales intelligence'
        : dataSource === 'historical'
            ? 'Historical snapshot loaded'
            : 'Running from local device order history';

    return (
        <div style={{ minHeight: "100vh", background: "#F5F2EB", padding: "60px 20px" }}>
            <div style={{ maxWidth: "1250px", margin: "0 auto" }}>

                {/* Epic Header with Connectivity Intelligence */}
                <div className="dashboard-header-elite" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px", animation: "fadeIn 1s ease-out", gap: '24px' }}>
                    <div>
                        <h1 style={{ fontSize: "42px", color: "#163321", fontStyle: "italic", margin: 0, fontWeight: "900", letterSpacing: "-1px" }} className="dashboard-title">Kaapi Intelligence</h1>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "12px" }}>
                            <div className="pulse-live" style={{ width: "10px", height: "10px", borderRadius: "50%", background: syncIndicatorColor }} />
                            <span style={{ fontSize: "11px", fontWeight: "900", color: "#6A7A6E", textTransform: "uppercase", letterSpacing: "2.5px" }}>
                                {syncIndicatorLabel}
                            </span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'flex-end' }} className="header-actions">
                        {error && (
                            <div style={{ 
                                background: "rgba(244,67,54,0.1)", padding: "12px 24px", borderRadius: "12px", 
                                border: "1px solid rgba(244,67,54,0.2)", color: "#D32F2F", fontSize: "11px", fontWeight: "800"
                            }}>
                                Warning: {error}
                            </div>
                        )}
                        <div style={{ 
                            background: "rgba(22,51,33,0.03)", padding: "12px 24px", borderRadius: "12px", 
                            display: "flex", alignItems: "center", gap: "12px", fontSize: "12px", fontWeight: "700" 
                        }}>
                            <TrendingUp size={16} color="var(--saffron)" />
                            <span style={{ color: "#163321" }}>{dataSourceCopy}</span>
                        </div>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <button 
                                onClick={toggleHistoricalMode}
                                style={{
                                    background: isHistoricalMode ? "var(--saffron)" : "rgba(10, 34, 22, 0.05)",
                                    color: isHistoricalMode ? "var(--emerald)" : "var(--emerald)",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "12px",
                                    fontSize: "11px",
                                    fontWeight: "800",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    transition: "all 0.3s ease",
                                    boxShadow: isHistoricalMode ? "0 4px 15px rgba(220, 168, 45, 0.3)" : "none"
                                }}
                            >
                                {isHistoricalMode ? "BACK TO LIVE" : "YESTERDAY'S PERFORMANCE"}
                            </button>

                            <button 
                                onClick={fetchStats}
                                disabled={loading || isHistoricalMode}
                                style={{
                                    background: "var(--emerald)",
                                    color: "var(--ivory)",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "12px",
                                    fontSize: "11px",
                                    fontWeight: "800",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    opacity: loading ? 0.7 : 1
                                }}
                            >
                                <RefreshCcw size={14} className={loading ? "spin" : ""} />
                                SYNC NEURAL ENGINE
                            </button>
                        </div>
                    </div>
                </div>

                {/* Primary Metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "32px", marginBottom: "48px" }}>
                    <MetricCard title="Gross Revenue" value={`${RUPEE}${stats.dailyTotal}`} icon={<IndianRupee color="#DCA82D" size={24} />} delay="0.1s" />
                    <MetricCard title="Estimated Profit (15%)" value={`${RUPEE}${(stats.dailyTotal * 0.15).toFixed(0)}`} icon={<TrendingUp color="#4CAF50" size={24} />} delay="0.15s" />
                    <MetricCard title="Orders Logged" value={stats.orderCount} icon={<ShoppingCart color="#163321" size={24} />} delay="0.2s" />
                    <MetricCard title="Avg. Order Value" value={`${RUPEE}${aov}`} icon={<PieChart color="#2196F3" size={24} />} delay="0.3s" />
                </div>

                {/* Detailed Analytics */}
                <div className="analytics-grid-elite" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "32px", animation: "slideUp 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards", opacity: 0 }}>

                    {/* Top Selling Items */}
                    <div style={{ background: "#FFF", padding: "40px", borderRadius: "40px", boxShadow: "0 30px 60px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.02)" }}>
                        <h3 style={{ fontSize: "22px", color: "#163321", marginBottom: "32px", fontWeight: "900", fontStyle: 'italic' }}>Best Sellers</h3>
                        {stats.bestSellers.length > 0 ? (
                            stats.bestSellers.map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "28px" }}>
                                    <div style={{ background: "#163321", color: "#DCA82D", width: "40px", height: "40px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: "16px" }}>{i + 1}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                            <span style={{ fontSize: "16px", fontWeight: "800", color: "#2A2A2A" }}>{item.name}</span>
                                            <span style={{ fontSize: "14px", fontWeight: "900", color: "#6A7A6E" }}>{item.count}</span>
                                        </div>
                                        <div style={{ height: "8px", background: "#F5F2EB", borderRadius: "10px", overflow: "hidden" }}>
                                            <div style={{ width: `${(item.count / (stats.bestSellers[0]?.count || 1)) * 100}%`, height: "100%", background: "#DCA82D", borderRadius: "10px", transition: 'width 1.5s ease-out' }} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: "center", padding: "60px 0", color: "#6A7A6E", fontStyle: 'italic' }}>
                                {dataSource === 'local' ? 'No local sales captured today yet.' : 'Waiting for sales data...'}
                            </div>
                        )}
                    </div>

                    {/* Activity Feed */}
                    <div style={{ background: "#FFF", padding: "40px", borderRadius: "40px", boxShadow: "0 30px 60px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.02)" }}>
                        <h3 style={{ fontSize: "22px", color: "#163321", marginBottom: "32px", fontWeight: "900", fontStyle: 'italic' }}>Live Activity Feed</h3>
                        <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
                                <thead>
                                    <tr style={{ textAlign: "left" }}>
                                        <th style={{ padding: "12px 16px", color: "#6A7A6E", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: '1px' }}>Time</th>
                                        <th style={{ padding: "12px 16px", color: "#6A7A6E", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: '1px' }}>Customer Entity</th>
                                        <th style={{ padding: "12px 16px", color: "#6A7A6E", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: '1px' }}>Manifest</th>
                                        <th style={{ padding: "12px 16px", textAlign: "right", color: "#6A7A6E", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: '1px' }}>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.length > 0 ? (
                                        stats.recentOrders.map((order, i) => (
                                            <tr key={order.id || i} style={{ background: "#FDFDFD", borderRadius: '12px' }}>
                                                <td style={{ padding: "20px 16px", fontSize: "14px", color: "#6A7A6E", borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>{order.time}</td>
                                                <td style={{ padding: "20px 16px", fontSize: "15px", fontWeight: "800", color: "#163321" }}>{order.customer}</td>
                                                <td style={{ padding: "20px 16px", fontSize: "13px", color: "#6A7A6E" }}>
                                                    {(() => {
                                                        const manifest = Array.isArray(order.items)
                                                            ? order.items.map(it => `${it.count}x ${it.name}`).join(", ")
                                                            : order.items;
                                                        return manifest.length > 40 ? `${manifest.substring(0, 40)}${ELLIPSIS}` : manifest;
                                                    })()}
                                                </td>
                                                <td style={{ padding: "20px 16px", textAlign: "right", fontSize: "16px", fontWeight: "900", color: "#163321", borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>{RUPEE}{order.total}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: "center", padding: "80px 0", color: "#6A7A6E", fontStyle: 'italic' }}>
                                                {dataSource === 'local' ? 'No local kitchen activity captured today.' : 'Establish connection to view feed'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { 
                    from { opacity: 0; transform: translateY(40px); } 
                    to { opacity: 1; transform: translateY(0); } 
                }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulseLive {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
                    70% { transform: scale(1.3); box-shadow: 0 0 0 15px rgba(76, 175, 80, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
                }
                .spin { animation: spin 0.8s linear infinite; }
                .pulse-live { animation: pulseLive 2.5s infinite; }

                /* Responsive Overrides */
                @media (max-width: 1024px) {
                    .dashboard-header-elite { flex-direction: column; align-items: flex-start !important; }
                    .dashboard-title { fontSize: 32px !important; }
                    .header-actions { justify-content: flex-start !important; width: 100%; }
                    .analytics-grid-elite { grid-template-columns: 1fr !important; }
                    .login-modal-elite { padding: 40px 24px !important; }
                }
                @media (max-width: 640px) {
                    .dashboard-title { fontSize: 28px !important; }
                    .header-actions button { width: 100%; justify-content: center; }
                    td, th { padding: 12px 8px !important; font-size: 12px !important; }
                }
            `}</style>
        </div>
    );
}
