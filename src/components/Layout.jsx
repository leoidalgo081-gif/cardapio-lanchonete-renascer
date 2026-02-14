import React from 'react';
import { useLocation, Link, Outlet, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { requestNotificationPermission, sendNotification } from '../utils/notifications';
import NotificationToast from './NotificationToast';

const Layout = ({ cartCount }) => {
    const location = useLocation();
    const { orders } = useOrder();
    const [notification, setNotification] = React.useState({ show: false, message: '', orderId: null });
    const prevOrdersRef = React.useRef([]);
    const navigate = useNavigate();

    // Check for order status changes
    React.useEffect(() => {
        // Request permission on first interaction (e.g. mounting layout if user has orders)
        const myOrders = JSON.parse(localStorage.getItem('my_orders') || '[]');
        if (myOrders.length > 0) {
            requestNotificationPermission();
        }

        if (myOrders.length === 0) return;

        // On first run, just sync refs
        if (prevOrdersRef.current.length === 0 && orders.length > 0) {
            prevOrdersRef.current = orders;
            return;
        }

        // Check for updates
        orders.forEach(order => {
            if (!myOrders.includes(order.id)) return;

            const prevOrder = prevOrdersRef.current.find(o => o.id === order.id);
            if (prevOrder && prevOrder.status !== 'ready' && order.status === 'ready') {
                // Trigger notification (Toast)
                setNotification({
                    show: true,
                    message: `Seu pedido #${order.id} está pronto para retirada!`,
                    orderId: order.id
                });

                // Trigger System Notification
                sendNotification('Pedido Pronto!', `Seu pedido #${order.id} está pronto para retirada!`);

                // Auto hide after 5 seconds
                setTimeout(() => {
                    setNotification(prev => prev.orderId === order.id ? { ...prev, show: false } : prev);
                }, 5000);
            }
        });

        prevOrdersRef.current = orders;
    }, [orders]);

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/': return 'Kitchen';
            case '/menu': return 'Menu';
            case '/tracking': return 'Tracking';
            case '/admin': return 'Admin';
            default: return 'Kitchen';
        }
    };

    const isActive = (path) => location.pathname === path;

    const isPublicPage = !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/kitchen');

    return (
        <div className="text-slate-900 min-h-screen pb-24 font-['Inter']">
            <NotificationToast
                show={notification.show}
                message={notification.message}
                onClose={() => setNotification(prev => ({ ...prev, show: false }))}
                onClick={() => {
                    setNotification(prev => ({ ...prev, show: false }));
                    navigate(`/tracking/${notification.orderId}`);
                }}
            />

            {/* Header - Conditionally rendered or simplified for specific pages if needed */}
            {isPublicPage && (
                <header className="sticky top-0 z-50 bg-green-900/90 backdrop-blur-md px-6 pt-8 pb-4 border-b border-green-800 shadow-lg">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col items-start">
                            <img src="/src/assets/logo.png" alt="Renascer Event" className="h-20 w-auto object-contain" />
                            <span className="font-['Great_Vibes'] text-5xl text-yellow-400 -mt-4 ml-4 drop-shadow-md tracking-wide">Lanchonete</span>
                        </div>
                        <div className="relative">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <span className="material-symbols-outlined text-primary">notifications</span>
                            </div>
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main className={`${isPublicPage ? 'p-4' : ''} space-y-6`}>
                <Outlet />
            </main>

            {/* Background Decoration */}
            <div className="fixed bottom-24 right-6 pointer-events-none opacity-10 z-0">
                <span className="material-symbols-outlined text-8xl text-primary">church</span>
            </div>

            {/* Bottom Navigation */}
            {isPublicPage && (
                <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-200 px-8 pt-3 pb-8 flex justify-around items-center z-50">
                    <Link to="/menu" className={`flex flex-col items-center gap-1 ${isActive('/menu') || isActive('/') ? 'text-primary' : 'opacity-40 text-slate-900'}`}>
                        <span className={`material-symbols-outlined ${isActive('/menu') || isActive('/') ? 'font-bold' : ''}`}>restaurant_menu</span>
                        <span className="text-[10px] font-bold">Menu</span>
                        {(isActive('/menu') || isActive('/')) && <div className="w-1 h-1 bg-primary rounded-full"></div>}
                    </Link>

                    <Link to="/tracking" className={`flex flex-col items-center gap-1 ${isActive('/tracking') ? 'text-primary' : 'opacity-40 text-slate-900'}`}>
                        <span className={`material-symbols-outlined ${isActive('/tracking') ? 'font-bold' : ''}`}>receipt_long</span>
                        <span className="text-[10px] font-bold">Meus Pedidos</span>
                        {isActive('/tracking') && <div className="w-1 h-1 bg-primary rounded-full"></div>}
                    </Link>
                </nav>
            )}
        </div>
    );
};

export default Layout;
