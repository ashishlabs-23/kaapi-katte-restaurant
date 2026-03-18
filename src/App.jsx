import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// We will build these pages next
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Kitchen from './pages/Kitchen';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu'; // Added Menu page
import { useCart } from './context/CartContext';

// Separate component to safely use useCart 
function AppRoutes() {
    const { isChef } = useCart();

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/kitchen" element={isChef ? <Kitchen /> : <Home />} />
            <Route path="/admin-lounge" element={<Dashboard />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <CartProvider>
                <div className="app-shell">
                    <Navbar />
                    <FloatingCart />

                    <main className="app-main">
                        <AppRoutes />
                    </main>

                    <Footer />
                </div>
            </CartProvider>
        </BrowserRouter>
    );
}
