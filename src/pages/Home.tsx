import { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI, wishlistAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Card, CardContent } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import {
  Star,
  Search,
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  Laptop,
  Dumbbell,
  Home as HomeIcon,
  Sparkles,
  Quote,
  BookOpen,
  Shirt,
  Sparkle,
} from 'lucide-react';
import { toast } from 'sonner';
import Newsletter from '../components/Newsletter';
import ProductSection from '../components/ProductSection';
import { formatINR, FREE_SHIPPING_MIN_INR } from '../utils/currency';
import { Product } from '../types';

const categoryCards = [
  { name: 'Electronics', slug: 'Electronics', icon: Laptop, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600' },
  { name: 'Accessories', slug: 'Accessories', icon: Sparkles, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
  { name: 'Sports', slug: 'Sports', icon: Dumbbell, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600' },
  { name: 'Home & Kitchen', slug: 'Home & Kitchen', icon: HomeIcon, image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600' },
  { name: 'Stationery', slug: 'Stationery', icon: BookOpen, image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600' },
  { name: 'Fashion', slug: 'Fashion', icon: Shirt, image: 'https://images.unsplash.com/photo-1483985988354-763728e3685b?w=600' },
  { name: 'Beauty', slug: 'Beauty', icon: Sparkle, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600' },
];

const testimonials = [
  { name: 'Rahul Sharma', role: 'Mumbai', text: 'Fast delivery across India! The headphones are incredible — best purchase this year.', rating: 5 },
  { name: 'Priya Patel', role: 'Ahmedabad', text: 'ShopHub has great prices in rupees. Easy returns and support actually responds.', rating: 5 },
  { name: 'Amit Kumar', role: 'Bangalore', text: 'Ordered a smart watch and mixer grinder. Both arrived in 4 days. Highly recommend!', rating: 5 },
  { name: 'Sneha Reddy', role: 'Hyderabad', text: 'Love UPI checkout and the wishlist. Perfect for festival shopping.', rating: 5 },
  { name: 'Vikram Singh', role: 'Delhi', text: 'Cricket bat and pressure cooker — quality products at honest Indian prices.', rating: 5 },
  { name: 'Ananya Iyer', role: 'Chennai', text: 'Beautiful handloom saree. Packaging was excellent for a wedding gift.', rating: 5 },
];

const trustFeatures = [
  { icon: Truck, title: 'Free Shipping', desc: `On orders over ${formatINR(FREE_SHIPPING_MIN_INR)} across India` },
  { icon: Shield, title: 'Secure Payment', desc: 'UPI, cards & COD with SSL encryption' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day hassle-free return policy' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated team ready to help' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
    loadWishlist();
  }, []);

  const loadProducts = async () => {
    try {
      const [featured, best, newest] = await Promise.all([
        productAPI.getFeaturedProducts(),
        productAPI.getBestSellers(),
        productAPI.getNewArrivals(),
      ]);
      setFeaturedProducts(featured);
      setBestSellers(best);
      setNewArrivals(newest);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadWishlist = async () => {
    try {
      const list = await wishlistAPI.getWishlist();
      setWishlistIds(list.map((p) => p.id));
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  const handleToggleWishlist = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const isFav = wishlistIds.includes(productId);
      const updated = isFav
        ? await wishlistAPI.removeFromWishlist(productId)
        : await wishlistAPI.addToWishlist(productId);
      setWishlistIds(updated.map((p) => p.id));
      toast.success(isFav ? 'Removed from wishlist' : 'Added to wishlist!');
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(productId);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-purple-600 text-white py-2 overflow-hidden">
        <div className="container mx-auto px-4 flex items-center justify-center gap-4 text-xs md:text-sm font-bold tracking-widest uppercase">
          <span className="flex items-center gap-1">⚡ Flash Sale: Up to 70% Off</span>
          <span className="hidden md:inline opacity-50">|</span>
          <span className="hidden md:inline">Limited Time Only</span>
        </div>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-background to-rose-500/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-60" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors" variant="outline">India&apos;s trusted online store</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Shop smarter with <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">ShopHub</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              30+ products across electronics, fashion, kitchen & more — all priced in Indian Rupees with delivery across India.
            </p>

            <form 
              onSubmit={(e: FormEvent) => {
                e.preventDefault();
                navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
              }}
              className="flex flex-col sm:flex-row gap-4 mb-8 max-w-md"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search products..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-background/50 backdrop-blur-md border-primary/10 focus:border-primary/30" 
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8 w-full sm:w-auto shadow-lg shadow-primary/20">
                Explore
              </Button>
            </form>

            <div className="flex flex-wrap gap-4">
              <Link to="/products?category=Electronics">
                <Button size="sm" variant="outline" className="rounded-full bg-background/40 backdrop-blur-sm">Electronics</Button>
              </Link>
              <Link to="/products?category=Fashion">
                <Button size="sm" variant="outline" className="rounded-full bg-background/40 backdrop-blur-sm">Fashion</Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-border/50">
              <div>
                <p className="text-2xl font-bold">50K+</p>
                <p className="text-sm text-muted-foreground">Happy customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">30+</p>
                <p className="text-sm text-muted-foreground">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold">Free</p>
                <p className="text-sm text-muted-foreground">Shipping over {formatINR(FREE_SHIPPING_MIN_INR)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-gradient-to-r from-muted/50 via-background to-muted/50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {trustFeatures.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 group">
                <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                  <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <p className="font-bold text-sm uppercase tracking-wider">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
          <p className="text-muted-foreground">7 categories — hundreds of choices for Indian shoppers</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categoryCards.map(({ name, slug, icon: Icon, image }) => (
            <Link key={slug} to={`/products?category=${encodeURIComponent(slug)}`}>
              <Card className="overflow-hidden group hover:shadow-2xl transition-all h-full border-none ring-1 ring-border">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white">
                    <Icon className="h-5 w-5" />
                    <span className="font-semibold text-sm">{name}</span>
                    <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <ProductSection
        title="Featured Products"
        subtitle="Handpicked favourites for you"
        products={featuredProducts}
        wishlistIds={wishlistIds}
        badgeLabel="Featured"
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <ProductSection
        title="Best Sellers"
        subtitle="Most loved by shoppers across India"
        products={bestSellers}
        wishlistIds={wishlistIds}
        badgeLabel="Bestseller"
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <div className="bg-muted/40">
        <ProductSection
          title="New Arrivals"
          subtitle="Latest additions to our catalogue"
          products={newArrivals}
          wishlistIds={wishlistIds}
          badgeLabel="New"
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
        />
      </div>

      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent inline-block">What Our Customers Say</h2>
            <p className="text-muted-foreground">Reviews from shoppers across India</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="relative bg-background/60 backdrop-blur-sm border-none ring-1 ring-border">
                <CardContent className="pt-8 pb-6">
                  <Quote className="h-10 w-10 text-primary/10 absolute top-4 right-4" />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-br from-primary via-indigo-600 to-purple-700 text-primary-foreground overflow-hidden border-none shadow-2xl shadow-primary/20">
          <CardContent className="py-10 px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm opacity-90 mb-1">Limited time offer</p>
              <h2 className="text-2xl md:text-3xl font-bold">Use code SAVE10 at checkout</h2>
              <p className="opacity-90 mt-2">Get 10% off your order. Pay easily with UPI or COD.</p>
            </div>
            <Link to="/products">
              <Button size="lg" variant="secondary">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <Newsletter />
    </div>
  );
}
