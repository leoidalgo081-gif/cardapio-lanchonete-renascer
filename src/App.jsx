import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import Layout from './components/Layout';
import MenuPage from './pages/MenuPage';
import OrderTracking from './pages/OrderTracking';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [cartCount, setCartCount] = React.useState(0);

  return (
    <BrowserRouter>
      <OrderProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<Layout cartCount={cartCount} />}>
            <Route index element={<MenuPage setCartCount={setCartCount} />} />
            <Route path="menu" element={<MenuPage setCartCount={setCartCount} />} />
            <Route path="tracking" element={<OrderTracking />} />
            <Route path="tracking/:orderId" element={<OrderTracking />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </OrderProvider>
    </BrowserRouter>
  );
}

export default App;
