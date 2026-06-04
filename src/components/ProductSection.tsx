import { Link } from 'react-router-dom';
import { Product } from '../types';
import { Button } from '../app/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ProductGrid from './ProductGrid';

interface ProductSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  wishlistIds: string[];
  badgeLabel?: string;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  onAddToCart: (productId: string, e: React.MouseEvent) => void;
}

export default function ProductSection({
  title,
  subtitle,
  products,
  wishlistIds,
  badgeLabel,
  onToggleWishlist,
  onAddToCart,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <Link to="/products">
          <Button variant="outline">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <ProductGrid
        products={products}
        wishlistIds={wishlistIds}
        badgeLabel={badgeLabel}
        onToggleWishlist={onToggleWishlist}
        onAddToCart={onAddToCart}
      />
    </section>
  );
}
