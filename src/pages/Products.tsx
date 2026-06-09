import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Product, FilterOptions } from '../types';
import { productAPI, wishlistAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { categories } from '../data/mockData';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../app/components/ui/select';
import { Slider } from '../app/components/ui/slider';
import { Search, Star, ShoppingCart, Filter, Heart } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../app/components/ui/sheet';
import { toast } from 'sonner';
import { formatINR } from '../utils/currency';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<Partial<FilterOptions>>({
    category: searchParams.get('category') || 'All',
    minPrice: 0,
    maxPrice: 50000,
    minRating: 0,
    search: searchParams.get('search') || '',
    sortBy: 'newest'
  });
  const { addToCart } = useCart();

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    setFilters((prev) => ({
      ...prev,
      ...(category ? { category } : {}),
      ...(search !== null ? { search } : {}),
    }));
  }, [searchParams]);

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const list = await wishlistAPI.getWishlist();
      setWishlistIds(list.map(p => p.id));
    } catch (error) {
      console.error(error);
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

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productAPI.getProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(productId);
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm mb-2 block">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={filters.search || ''}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>

      <div>
        <label className="text-sm mb-2 block">Category</label>
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm mb-2 block">Sort By</label>
        <Select
          value={filters.sortBy}
          onValueChange={(value: any) => setFilters({ ...filters, sortBy: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm mb-2 block">
          Price Range: {formatINR(filters.minPrice || 0)} - {formatINR(filters.maxPrice || 50000)}
        </label>
        <Slider
          value={[filters.minPrice || 0, filters.maxPrice || 50000]}
          min={0}
          max={50000}
          step={500}
          onValueChange={([min, max]) => setFilters({ ...filters, minPrice: min, maxPrice: max })}
          className="mt-2"
        />
      </div>

      <div>
        <label className="text-sm mb-2 block">Minimum Rating: {filters.minRating || 0}+</label>
        <Slider
          value={[filters.minRating || 0]}
          min={0}
          max={5}
          step={0.5}
          onValueChange={([value]) => setFilters({ ...filters, minRating: value })}
          className="mt-2"
        />
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() =>
          setFilters({
            category: 'All',
            minPrice: 0,
            maxPrice: 50000,
            minRating: 0,
            search: '',
            sortBy: 'newest'
          })
        }
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-2">Products</h1>
          <p className="text-muted-foreground">{products.length} products found</p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterPanel />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block">
          <Card>
            <CardHeader>
              <h2 className="text-lg">Filters</h2>
            </CardHeader>
            <CardContent>
              <FilterPanel />
            </CardContent>
          </Card>
        </aside>

        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No products found matching your criteria</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col relative group">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 left-2 z-10 bg-background/85 hover:bg-background rounded-full transition-transform hover:scale-110 shadow-xs border border-border/50"
                      onClick={(e) => handleToggleWishlist(product.id, e)}
                    >
                      <Heart
                        className={`h-4.5 w-4.5 transition-colors ${
                          wishlistIds.includes(product.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground'
                        }`}
                      />
                    </Button>

                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {product.stock < 10 && product.stock > 0 && (
                        <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md font-semibold">
                          Only {product.stock} left!
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex items-center justify-center font-bold text-destructive text-sm">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="line-clamp-2 flex-1 font-semibold group-hover:text-primary transition-colors">{product.name}</h3>
                        {product.featured && (
                          <Badge variant="secondary" className="ml-2">
                            Featured
                          </Badge>
                        )}
                      </div>
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
                      <Badge variant="outline">{product.category}</Badge>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex items-center justify-between">
                      <div className="text-2xl font-bold">{formatINR(product.price)}</div>
                      <Button
                        onClick={(e) => handleAddToCart(product.id, e)}
                        size="sm"
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
