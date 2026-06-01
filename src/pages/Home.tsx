import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { productAPI, wishlistAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { Button } from '../app/components/ui/button';
import { Card, CardContent, CardFooter } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import { Star, ShoppingCart, ArrowRight, Heart } from 'lucide-react';
import { toast } from 'sonner';

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
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl mb-4 font-bold">Welcome to ShopHub</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Your one-stop shop for everything you need.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/products">
              <Button size="lg">
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl mb-2">Featured Products</h2>
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
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl mb-2">🚚</div>
              <h3 className="text-xl">Free Shipping</h3>
              <p className="text-muted-foreground">On all orders over $50</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl mb-2">🔒</div>
              <h3 className="text-xl">Secure Payment</h3>
              <p className="text-muted-foreground">100% secure transactions</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl mb-2">⭐</div>
              <h3 className="text-xl">Top Quality</h3>
              <p className="text-muted-foreground">Guaranteed satisfaction</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
