import { useState, useEffect } from 'react';
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
import { formatINR } from '../utils/currency';

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
    cvv: '',
    upiId: '',
    bankName: ''
  });

  const [promoInput, setPromoInput] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  const [timer, setTimer] = useState(120);
  const [upiVerified, setUpiVerified] = useState(false);

  useEffect(() => {
    let intervalId: any;
    if (step === 2 && paymentMethod.type === 'upi' && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [step, paymentMethod.type, timer]);

  useEffect(() => {
    if (paymentMethod.type === 'upi') {
      setTimer(120);
      setUpiVerified(false);
    }
  }, [paymentMethod.type]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyUpiId = () => {
    if (!paymentMethod.upiId || !paymentMethod.upiId.trim() || !paymentMethod.upiId.includes('@')) {
      toast.error('Please enter a valid UPI ID (e.g. user@okaxis)');
      return;
    }
    setUpiVerified(true);
    toast.success('UPI ID verified successfully!');
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const [qrPaid, setQrPaid] = useState(false);

  const handleSimulateQrPay = () => {
    setQrPaid(true);
    toast.success('Mock payment successfully simulated!');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod.type === 'upi' && !upiVerified && !qrPaid) {
      toast.error('Please verify your UPI ID, or click "Simulate Payment Success" on the QR Code.');
      return;
    }
    if (paymentMethod.type === 'netbanking' && !paymentMethod.bankName) {
      toast.error('Please select a banking partner.');
      return;
    }
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

                  {paymentMethod.type === 'upi' && (
                    <div className="space-y-4 mt-4 p-4 border border-primary/20 bg-primary/5 rounded-lg">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Scan QR Code with any UPI App</span>
                        
                        {/* Mock QR Code */}
                        <div className="w-44 h-44 bg-white p-3 rounded-lg border border-border flex flex-col items-center justify-center relative shadow-sm">
                          <svg className="w-full h-full text-slate-800" viewBox="0 0 100 100" fill="currentColor">
                            <path d="M5 5h30v30H5V5zm3 3v24h24V8H8z" />
                            <path d="M65 5h30v30H65V5zm3 3v24h24V8H68z" />
                            <path d="M5 65h30v30H5V65zm3 3v24h24V68H8z" />
                            <path d="M12 12h5v5h-5zm0 14h5v5h-5zm14 0h5v5h-5zm0-14h5v5h-5zM72 12h5v5h-5zm0 14h5v5h-5zm14 0h5v5h-5zm0-14h5v5h-5zM12 72h5v5h-5zm0 14h5v5h-5zm14 0h5v5h-5zm0-14h5v5h-5z" />
                            <path d="M45 10h10v10H45zm0 20h10v5H45zm0 10h5v15h-5zm10 5h5v5h-5zm-20 5h5v5h-5zm30-10h10v5H55zm10 15h5v10h-5zm-15 5h10v5H40zm25 5h15v5H65zm-20 5h10v5H45z" />
                            <path d="M45 45h10v10H45z" />
                          </svg>
                          {qrPaid && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 rounded-lg transition-opacity duration-300">
                              <Check className="h-10 w-10 text-emerald-500 mb-1 animate-bounce" />
                              <span className="text-xs font-bold text-emerald-600 font-semibold">Payment Received!</span>
                            </div>
                          )}
                        </div>

                        {/* Countdown Timer */}
                        <div className="text-sm font-semibold text-amber-600" id="upi-timer">
                          {timer > 0 ? `QR Code expires in: ${formatTime(timer)}` : 'QR Code expired! Please refresh.'}
                        </div>

                        <Button
                          type="button"
                          size="sm"
                          variant={qrPaid ? "secondary" : "outline"}
                          onClick={handleSimulateQrPay}
                          disabled={qrPaid || timer <= 0}
                          className="w-full max-w-[200px]"
                        >
                          {qrPaid ? 'Simulated Success' : 'Simulate Scan & Pay'}
                        </Button>

                        <div className="flex items-center gap-2 w-full">
                          <Separator className="flex-1" />
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">or</span>
                          <Separator className="flex-1" />
                        </div>

                        {/* UPI ID Form */}
                        <div className="w-full text-left space-y-2">
                          <Label htmlFor="upiId">Enter UPI ID</Label>
                          <div className="flex gap-2">
                            <Input
                              id="upiId"
                              placeholder="e.g. name@upi"
                              value={paymentMethod.upiId || ''}
                              onChange={(e) =>
                                setPaymentMethod({ ...paymentMethod, upiId: e.target.value })
                              }
                              disabled={qrPaid}
                              className="bg-background h-10"
                            />
                            <Button
                              type="button"
                              onClick={handleVerifyUpiId}
                              disabled={qrPaid}
                              variant={upiVerified ? 'secondary' : 'default'}
                              className={upiVerified ? 'bg-emerald-600 text-white hover:bg-emerald-700 h-10 shrink-0' : 'h-10 shrink-0'}
                            >
                              {upiVerified ? 'Verified ✓' : 'Verify'}
                            </Button>
                          </div>
                          {upiVerified && (
                            <p className="text-xs text-emerald-600 font-medium">✓ UPI ID is valid.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod.type === 'netbanking' && (
                    <div className="space-y-3 mt-4 p-4 border border-primary/20 bg-primary/5 rounded-lg text-left">
                      <Label htmlFor="bank" className="font-semibold text-sm">Select Your Bank</Label>
                      <Select
                        value={paymentMethod.bankName || ''}
                        onValueChange={(value) =>
                          setPaymentMethod({ ...paymentMethod, bankName: value })
                        }
                      >
                        <SelectTrigger className="bg-background h-10">
                          <SelectValue placeholder="Choose a bank" />
                        </SelectTrigger>
                        <SelectContent className="z-[200]">
                          <SelectItem value="sbi">State Bank of India (SBI)</SelectItem>
                          <SelectItem value="hdfc">HDFC Bank</SelectItem>
                          <SelectItem value="icici">ICICI Bank</SelectItem>
                          <SelectItem value="axis">Axis Bank</SelectItem>
                          <SelectItem value="kotak">Kotak Mahindra Bank</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">Redirecting to bank security portal upon confirmation.</p>
                    </div>
                  )}

                  {paymentMethod.type === 'cod' && (
                    <div className="mt-4 p-4 border border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/10 rounded-lg text-left text-sm text-slate-800 dark:text-slate-200">
                      <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">Cash on Delivery (COD)</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Please keep the exact cash amount ready upon delivery. A verification call might be placed to confirm your order details before shipping.
                      </p>
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
                        <span>{formatINR(item.product.price * item.quantity)}</span>
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
                    <span>{formatINR(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatINR(getSubtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>FREE</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Promo Discount ({appliedCode})</span>
                  <span>-{formatINR(getDiscountAmount())}</span>
                </div>
              )}
              <Separator />
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase font-bold tracking-wider block">Available Coupons</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { code: 'SAVE10', discount: 10, label: '10% off' },
                    { code: 'WELCOME20', discount: 20, label: '20% off' }
                  ].map((coupon) => {
                    const isApplied = appliedCode === coupon.code;
                    return (
                      <button
                        key={coupon.code}
                        type="button"
                        onClick={() => {
                          if (isApplied) {
                            handleRemovePromo();
                          } else {
                            setAppliedCode(coupon.code);
                            setDiscountPercent(coupon.discount);
                            setPromoInput(coupon.code);
                            toast.success(`Promo applied: ${coupon.label}`);
                          }
                        }}
                        className={`text-left p-2 rounded border text-[11px] transition-all flex flex-col justify-between hover:border-primary/50 cursor-pointer ${
                          isApplied
                            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                            : 'border-border bg-card hover:bg-muted/40'
                        }`}
                      >
                        <span className="font-bold text-foreground text-[10px]">{coupon.code}</span>
                        <span className="text-[9px] text-muted-foreground">{coupon.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="promo" className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Or Enter Promo Code</Label>
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
                <span>{formatINR(getFinalTotal())}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
