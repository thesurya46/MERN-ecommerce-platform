import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order } from '../types';
import { orderAPI } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import { Button } from '../app/components/ui/button';
import { Separator } from '../app/components/ui/separator';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { formatINR } from '../utils/currency';
import { getProductImage } from '../utils/productImage';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const data = await orderAPI.getOrder(id);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-slate-900';
      case 'processing':
        return 'bg-amber-500 text-slate-900';
      case 'shipped':
        return 'bg-yellow-600 text-white';
      case 'delivered':
        return 'bg-slate-900 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { name: 'Pending', icon: Package, status: 'pending' },
      { name: 'Processing', icon: Package, status: 'processing' },
      { name: 'Shipped', icon: Truck, status: 'shipped' },
      { name: 'Delivered', icon: CheckCircle, status: 'delivered' }
    ];

    if (order?.status === 'cancelled') {
      return [
        { name: 'Cancelled', icon: XCircle, status: 'cancelled' }
      ];
    }

    return steps;
  };

  const getActiveStep = () => {
    if (!order) return 0;
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    return statusOrder.indexOf(order.status);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <Card>
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-1/2 mb-4" />
              <div className="h-3 bg-muted rounded w-3/4" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Order not found</p>
          <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
        </Card>
      </div>
    );
  }

  const activeStep = getActiveStep();
  const steps = getStatusSteps();

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-white via-amber-50 to-yellow-50 rounded-3xl shadow-sm">
      <Button variant="ghost" onClick={() => navigate('/orders')} className="mb-6 rounded-full border border-yellow-200 bg-white/90 text-slate-900 shadow-sm hover:bg-amber-100 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Order #{order.id}</h1>
        <Badge className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-yellow-200 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-8">
                {steps.map((step, idx) => (
                  <div key={step.status} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          order.status === 'cancelled'
                            ? idx === 0
                              ? 'bg-red-500 text-white'
                              : 'bg-muted text-muted-foreground'
                            : idx <= activeStep
                            ? 'bg-yellow-500 text-slate-900 shadow-sm'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <step.icon className="h-6 w-6" />
                      </div>
                      <span className="mt-2 text-xs text-center">{step.name}</span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          idx < activeStep ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Order placed: {new Date(order.createdAt).toLocaleString()}</p>
                <p>Last updated: {new Date(order.updatedAt).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-yellow-200 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={getProductImage(item.product.images)}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="mb-1">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      <p className="text-sm">
                        {formatINR(item.product.price)} x {item.quantity} ={' '}
                        {formatINR(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-yellow-200 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>{formatINR(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatINR(order.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>FREE</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg">
                <span>Total</span>
                <span>{formatINR(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-yellow-200 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2">{order.shippingAddress.phone}</p>
            </CardContent>
          </Card>

          <Card className="border border-yellow-200 bg-white/90 shadow-sm">
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                {order.paymentMethod.type === 'card' && `Card ending in ${order.paymentMethod.cardNumber?.slice(-4)}`}
                {order.paymentMethod.type === 'upi' && 'UPI'}
                {order.paymentMethod.type === 'netbanking' && 'Net Banking'}
                {order.paymentMethod.type === 'cod' && 'Cash on Delivery'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
