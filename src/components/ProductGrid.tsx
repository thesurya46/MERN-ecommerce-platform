import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Button } from '../app/components/ui/button';
import { Card, CardContent, CardFooter } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { formatINR } from '../utils/currency';

interface ProductGridProps {
  products: Product[];
  wishlistIds: string[];
  badgeLabel?: string;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  onAddToCart: (productId: string, e: React.MouseEvent) => void;
}

export default function ProductGrid({
  products,
  wishlistIds,
  badgeLabel,
  onToggleWishlist,
  onAddToCart,
}: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product.id} to={`/product/${product.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col relative group">
            <Button
              variant="ghost"
              size="icon"
              type="button"
              className="absolute top-4 left-4 z-10 bg-background/85 hover:bg-background rounded-full border border-border/50"
              onClick={(e) => onToggleWishlist(product.id, e)}
            >
              <Heart
                className={`h-5 w-5 ${
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
              {badgeLabel && <Badge className="absolute top-4 right-4">{badgeLabel}</Badge>}
              {product.stock < 10 && product.stock > 0 && (
                <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md font-semibold">
                  Only {product.stock} left!
                </div>
              )}
            </div>
            <CardContent className="p-4 flex-grow">
              <Badge variant="outline" className="mb-2 text-xs">{product.category}</Badge>
              <h3 className="text-base mb-2 line-clamp-1 font-semibold group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <div className="text-xl font-bold">{formatINR(product.price)}</div>
              <Button type="button" onClick={(e) => onAddToCart(product.id, e)} size="sm">
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add
              </Button>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
