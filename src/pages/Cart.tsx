import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../app/components/ui/button';
import { getProductImage } from '../utils/productImage';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../app/components/ui/card';
import { Input } from '../app/components/ui/input';
import { Separator } from '../app/components/ui/separator';
import { Badge } from '../app/components/ui/badge';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, Tag, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR, FREE_SHIPPING_MIN_INR, SHIPPING_FEE_INR } from '../utils/currency';

const PROMO_CODES: Record<string, { discount: number; label: string }> = {
  SAVE10: { discount: 0.1, label: '10% off' },
  WELCOME15: { discount: 0.15, label: '15% off' },
};

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartItemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const subtotal = getCartTotal();
  const discountRate = appliedPromo ? PROMO_CODES[appliedPromo]?.discount ?? 0 : 0;
  const discountAmount = subtotal * discountRate;
  const shipping = subtotal >= FREE_SHIPPING_MIN_INR || subtotal === 0 ? 0 : SHIPPING_FEE_INR;
  const total = subtotal - discountAmount + shipping;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      toast.success(`Promo applied: ${PROMO_CODES[code].label}`);
    } else {
      toast.error('Invalid promo code. Try SAVE10 or WELCOME15');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto p-12 text-center">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Start shopping to add items to your cart</p>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-8">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={getProductImage(item.product.images)}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg mb-1">{item.product.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.product.category}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border rounded">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.productId, parseInt(e.target.value) || 1)
                          }
                          className="w-16 text-center border-0"
                          min="1"
                          max={item.product.stock}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xl font-semibold">
                        {formatINR(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" onClick={handleApplyPromo} type="button">
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              {appliedPromo && (
                <Badge variant="secondary" className="w-fit">
                  {appliedPromo} — {PROMO_CODES[appliedPromo].label}
                </Badge>
              )}
              {subtotal > 0 && subtotal < FREE_SHIPPING_MIN_INR && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" />
                  Add {formatINR(FREE_SHIPPING_MIN_INR - subtotal)} more for free shipping
                </p>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items ({getCartItemCount()})</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatINR(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatINR(shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCheckout} className="w-full" size="lg">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
