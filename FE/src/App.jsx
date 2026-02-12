import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/navbar/Navbar'
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Products from './pages/products/Products'
import Categories from './pages/categories/categories'
import Cart from './pages/cart/Cart'
import Footer from './components/footer/Footer'
import ProductsDetails from './pages/products/ProductsDetails'
import Orders from './pages/orders/Orders'
import Checkout from './pages/checkout/Checkout'
import Profile from './pages/profile/Profile'
import OrdersAdmin from './pages/ordersAdmin/OrdersAdmin'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'



function App() {
  const [page, setPage] = useState('home')
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'))
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleLogin = () => {
    setIsAuthenticated(true)
  }
  const handleRegister = () => {
  }
  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setIsAuthenticated(false)
    setCart([])
  }
  const handleNavigate = (to) => setPage(to)
  const handleAddToCart = (car) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === car.id);
      if (idx > -1) {
        return prev.map((item, i) => i === idx ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, { ...car, quantity: 1 }];
      }
    });
  };
  const handleRemoveFromCart = (idx) => {
    setCart(prev => prev.filter((_, i) => i !== idx));
  };
  const handleChangeQuantity = (idx, delta) => {
    setCart(prev => prev.map((item, i) =>
      i === idx ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };
  const handleCheckout = () => {
    setCart([]);
  };

  return (
    <>

      <BrowserRouter>
        <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} onNavigate={handleNavigate} cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products onAddToCart={handleAddToCart} onNavigate={handleNavigate} />} />
          <Route path="/categories" element={<Categories/>} />
          <Route path="/details/:productId" element={<ProductsDetails onAddToCart={handleAddToCart} />} />
          <Route path="/cart" element={<Cart cart={cart} onRemove={handleRemoveFromCart} onChangeQuantity={handleChangeQuantity} onCheckout={handleCheckout} />} />
          <Route path="/checkout" element={<Checkout cart={cart} onCheckout={handleCheckout} />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders-admin" element={<OrdersAdmin />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  )
}

export default App
