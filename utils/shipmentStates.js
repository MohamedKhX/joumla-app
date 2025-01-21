export const ShipmentStateEnum = {
    Pending: 'قيد الانتظار',
    WaitingForShipping: 'في انتظار الشحن',
    WaitingForReceiving: 'في انتظار الاستلام',
    Received: 'تم الاستلام',
    Shipping: 'قيد التوصيل',
    Shipped: 'تم الشحن',
};

export const getStatusColor = (state) => {
    switch (state) {
        case 'Pending':
            return { bg: '#FFF7ED', text: '#EA580C', dot: '#F97316' };
        case 'WaitingForShipping':
            return { bg: '#FEF2F2', text: '#DC2626', dot: '#EF4444' };
        case 'WaitingForReceiving':
            return { bg: '#F0FDF4', text: '#16A34A', dot: '#22C55E' };
        case 'Received':
            return { bg: '#F0FDF4', text: '#16A34A', dot: '#22C55E' };
        case 'Shipping':
            return { bg: '#EFF6FF', text: '#2563EB', dot: '#3B82F6' };
        case 'Shipped':
            return { bg: '#F3F4F6', text: '#4B5563', dot: '#6B7280' };
        default:
            return { bg: '#F3F4F6', text: '#4B5563', dot: '#6B7280' };
    }
}; 