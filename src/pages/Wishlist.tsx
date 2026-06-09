import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { wishlistAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { Button } from '../app/components/ui/button';
import { Card, CardContent, CardFooter } from '../app/components/ui/card';
import { Star, ShoppingCart, Trash2, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR } from '../utils/currency';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      const data = await wishlistAPI.getWishlist();
      setWishlist(data);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const updated = await wishlistAPI.removeFromWishlist(productId);
      setWishlist(updated);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(product.id, 1);
      // Optional: remove from wishlist once added to cart, or keep it. Let's keep it but show a nice toast.
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse h-[350px]">
              <div className="aspect-square bg-muted" />
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-rose-500/10 via-background to-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8 text-destructive fill-destructive" />
            <h1 className="text-3xl font-bold">My Wishlist</h1>
          </div>
          <p className="text-muted-foreground">{wishlist.length} items saved for later</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {wishlist.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <div className="text-5xl mb-4">❤️</div>
          <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Save items that you love here to easily find them later and add them to your cart.
          </p>
          <Link to="/products">
            <Button>Explore Products</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col relative group border-none ring-1 ring-border">
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleRemove(product.id, e)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.stock < 10 && product.stock > 0 && (
                    <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md font-semibold">
                      Only {product.stock} left!
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center font-bold text-destructive">
                      Out of Stock
                    </div>
                  )}
                </div>

                <CardContent className="p-4 flex-grow">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{product.category}</span>
                  <h3 className="text-base font-semibold mt-1 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-xs">{product.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex items-center justify-between gap-3">
                  <div className="text-lg font-bold">{formatINR(product.price)}</div>
                  <Button
                    onClick={(e) => handleAddToCart(product, e)}
                    size="sm"
                    className="flex-1 shadow-md shadow-primary/10"
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
