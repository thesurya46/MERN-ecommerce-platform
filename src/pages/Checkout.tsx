import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShippingAddress, PaymentMethod } from '../types';
import { orderAPI, paymentAPI } from '../services/api';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../app/components/ui/card';
import { Separator } from '../app/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '../app/components/ui/radio-group';
import { toast } from 'sonner';
import { Check, CreditCard } from 'lucide-react';

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    address: user?.address || '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: user?.phone || ''
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'card',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const [promoInput, setPromoInput] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'SAVE10') {
      setAppliedCode(code);
      setDiscountPercent(10);
      toast.success('10% discount applied successfully!');
    } else if (code === 'WELCOME20') {
      setAppliedCode(code);
      setDiscountPercent(20);
      toast.success('20% discount applied successfully!');
    } else {
      toast.error('Invalid promo code. Try SAVE10 or WELCOME20.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedCode('');
    setDiscountPercent(0);
    setPromoInput('');
    toast.success('Promo code removed');
  };

  const getSubtotal = () => getCartTotal();
  const getDiscountAmount = () => (getSubtotal() * discountPercent) / 100;
  const getFinalTotal = () => getSubtotal() - getDiscountAmount();

  const handlePlaceOrder = async () => {
    if (!user) return;

    setIsProcessing(true);
    try {
      const finalTotal = getFinalTotal();
      await paymentAPI.processPayment(finalTotal, paymentMethod);

      const order = await orderAPI.createOrder({
        userId: user.id,
        items: cart,
        total: finalTotal,
        status: 'pending',
        shippingAddress,
        paymentMethod
      });

      toast.success('Order placed successfully!');
      navigate(`/orders/${order.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const steps = [
    { number: 1, title: 'Shipping' },
    { number: 2, title: 'Payment' },
    { number: 3, title: 'Review' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, idx) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= s.number
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step > s.number ? <Check className="h-5 w-5" /> : s.number}
                  </div>
                  <span className="ml-2 hidden sm:inline">{s.title}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${step > s.number ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={shippingAddress.address}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, address: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, city: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, state: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={shippingAddress.country}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, country: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({ ...shippingAddress, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Continue to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <RadioGroup
                    value={paymentMethod.type}
                    onValueChange={(value: any) =>
                      setPaymentMethod({ ...paymentMethod, type: value })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit/Debit Card</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi">UPI</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking">Net Banking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod">Cash on Delivery</Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod.type === 'card' && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="cardHolder">Cardholder Name</Label>
                        <Input
                          id="cardHolder"
                          value={paymentMethod.cardHolder}
                          onChange={(e) =>
                            setPaymentMethod({ ...paymentMethod, cardHolder: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentMethod.cardNumber}
                          onChange={(e) =>
                            setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={paymentMethod.expiryDate}
                            onChange={(e) =>
                              setPaymentMethod({ ...paymentMethod, expiryDate: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            maxLength={4}
                            value={paymentMethod.cvv}
                            onChange={(e) =>
                              setPaymentMethod({ ...paymentMethod, cvv: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Back
                    </Button>
                    <Button type="submit" className="flex-1">
                      Review Order
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="mb-2">Shipping Address</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>{shippingAddress.fullName}</p>
                    <p>{shippingAddress.address}</p>
                    <p>
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                    </p>
                    <p>{shippingAddress.country}</p>
                    <p>{shippingAddress.phone}</p>
                  </div>
                  <Button variant="link" className="p-0 h-auto" onClick={() => setStep(1)}>
                    Edit
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2">Payment Method</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {paymentMethod.type === 'card' && `Card ending in ${paymentMethod.cardNumber?.slice(-4)}`}
                    {paymentMethod.type === 'upi' && 'UPI'}
                    {paymentMethod.type === 'netbanking' && 'Net Banking'}
                    {paymentMethod.type === 'cod' && 'Cash on Delivery'}
                  </div>
                  <Button variant="link" className="p-0 h-auto" onClick={() => setStep(2)}>
                    Edit
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-4">Order Items</h3>
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span>
                          {item.product.name} x {item.quantity}
                        </span>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handlePlaceOrder} disabled={isProcessing} className="flex-1">
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>FREE</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Promo Discount ({appliedCode})</span>
                  <span>-${getDiscountAmount().toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="promo" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Promo Code</Label>
                {appliedCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/20 p-2 border border-emerald-200 dark:border-emerald-900 rounded text-sm">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{appliedCode} ({discountPercent}% Off)</span>
                    <Button type="button" variant="ghost" size="sm" onClick={handleRemovePromo} className="h-auto p-1 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-destructive">
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      id="promo"
                      placeholder="e.g. SAVE10"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="h-9"
                    />
                    <Button type="button" size="sm" onClick={handleApplyPromo} className="h-9">
                      Apply
                    </Button>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${getFinalTotal().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
