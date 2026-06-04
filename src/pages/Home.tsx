import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { productAPI, wishlistAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { Button } from '../app/components/ui/button';
import { Card, CardContent, CardFooter } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import {
  Star,
  ShoppingCart,
  ArrowRight,
  Heart,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  Laptop,
  Dumbbell,
  Home as HomeIcon,
  Sparkles,
  Quote,
} from 'lucide-react';
import { toast } from 'sonner';
import Newsletter from '../components/Newsletter';

const categoryCards = [
  { name: 'Electronics', slug: 'Electronics', icon: Laptop, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600' },
  { name: 'Accessories', slug: 'Accessories', icon: Sparkles, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600' },
  { name: 'Sports', slug: 'Sports', icon: Dumbbell, image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600' },
  { name: 'Home & Kitchen', slug: 'Home & Kitchen', icon: HomeIcon, image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600' },
];

const testimonials = [
  { name: 'Sarah Mitchell', role: 'Verified Buyer', text: 'Fast shipping and exactly as described. The headphones are incredible — best purchase this year!', rating: 5 },
  { name: 'James Chen', role: 'Verified Buyer', text: 'ShopHub has become my go-to for tech. Great prices, easy returns, and customer support actually responds.', rating: 5 },
  { name: 'Emily Rodriguez', role: 'Verified Buyer', text: 'Love the wishlist feature and smooth checkout. Ordered a smart watch and it arrived in 4 days.', rating: 5 },
];

const trustFeatures = [
  { icon: Truck, title: 'Free Shipping', desc: 'On all orders over $50 nationwide' },
  { icon: Shield, title: 'Secure Payment', desc: '256-bit SSL encrypted checkout' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day hassle-free return policy' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated team ready to help' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    loadFeaturedProducts();
    loadWishlist();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await productAPI.getFeaturedProducts();
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Failed to load featured products:', error);
    }
  };

  const loadWishlist = async () => {
    try {
      const list = await wishlistAPI.getWishlist();
      setWishlistIds(list.map(p => p.id));
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    }
  };

  const handleToggleWishlist = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const isFav = wishlistIds.includes(productId);
      let updatedIds = [];
      if (isFav) {
        const updated = await wishlistAPI.removeFromWishlist(productId);
        updatedIds = updated.map(p => p.id);
        toast.success('Removed from wishlist');
      } else {
        const updated = await wishlistAPI.addToWishlist(productId);
        updatedIds = updated.map(p => p.id);
        toast.success('Added to wishlist!');
      }
      setWishlistIds(updatedIds);
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (error) {
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/15 via-background to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <Badge className="mb-4" variant="secondary">New arrivals every week</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              Shop smarter with <span className="text-primary">ShopHub</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Premium products, honest prices, and delivery you can count on. Join 50,000+ customers who trust us for their everyday essentials.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" className="h-12 px-8">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Learn About Us
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-border/50">
              <div>
                <p className="text-2xl font-bold">50K+</p>
                <p className="text-sm text-muted-foreground">Happy customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold">4.8★</p>
                <p className="text-sm text-muted-foreground">Average rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold">Free</p>
                <p className="text-sm text-muted-foreground">Shipping over $50</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustFeatures.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
          <p className="text-muted-foreground">Find exactly what you need, faster</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categoryCards.map(({ name, slug, icon: Icon, image }) => (
            <Link key={slug} to={`/products?category=${encodeURIComponent(slug)}`}>
              <Card className="overflow-hidden group hover:shadow-lg transition-all h-full">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white">
                    <Icon className="h-5 w-5" />
                    <span className="font-semibold">{name}</span>
                    <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Handpicked favorites just for you</p>
          </div>
          <Link to="/products">
            <Button variant="outline">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 left-4 z-10 bg-background/85 hover:bg-background rounded-full transition-transform hover:scale-110 shadow-xs border border-border/50"
                  onClick={(e) => handleToggleWishlist(product.id, e)}
                >
                  <Heart
                    className={`h-5 w-5 transition-colors ${
                      wishlistIds.includes(product.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground'
                    }`}
                  />
                </Button>

                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 right-4">Featured</Badge>
                  {product.stock < 10 && product.stock > 0 && (
                    <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md font-semibold">
                      Only {product.stock} left!
                    </div>
                  )}
                </div>
                <CardContent className="p-4 flex-grow">
                  <h3 className="text-lg mb-2 line-clamp-1 font-semibold group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm">{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
                  <Button onClick={(e) => handleAddToCart(product.id, e)} size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
            <p className="text-muted-foreground">Real reviews from real shoppers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="relative">
                <CardContent className="pt-8 pb-6">
                  <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
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

      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground overflow-hidden">
          <CardContent className="py-10 px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-sm opacity-90 mb-1">Limited time offer</p>
              <h2 className="text-2xl md:text-3xl font-bold">Use code SAVE10 at checkout</h2>
              <p className="opacity-90 mt-2">Get 10% off your first order. Valid for new customers.</p>
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
