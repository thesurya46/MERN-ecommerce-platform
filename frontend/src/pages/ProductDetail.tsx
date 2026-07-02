import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Product, Review } from '../types';
import { productAPI, reviewAPI, wishlistAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../app/components/ui/card';
import { Badge } from '../app/components/ui/badge';
import { Input } from '../app/components/ui/input';
import { Textarea } from '../app/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../app/components/ui/tabs';
import { Star, ShoppingCart, Minus, Plus, ArrowLeft, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR } from '../utils/currency';
import { getProductImage } from '../utils/productImage';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [recommendations, setRecommendations] = useState<Product[]>([]);

  useEffect(() => {
    loadProduct();
    loadReviews();
    checkWishlist();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await productAPI.getProduct(id);
      setProduct(data);
      if (data) {
        const allProducts = await productAPI.getProducts({ category: data.category });
        setRecommendations(allProducts.filter(p => p.id !== data.id).slice(0, 4));
      }
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkWishlist = async () => {
    if (!id) return;
    try {
      const fav = await wishlistAPI.isInWishlist(id);
      setIsWishlisted(fav);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    try {
      if (isWishlisted) {
        await wishlistAPI.removeFromWishlist(product.id);
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistAPI.addToWishlist(product.id);
        setIsWishlisted(true);
        toast.success('Added to wishlist!');
      }
      window.dispatchEvent(new Event('wishlist-updated'));
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const loadReviews = async () => {
    if (!id) return;
    try {
      const data = await reviewAPI.getReviews(id);
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product.id, quantity);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) {
      toast.error('Please login to submit a review');
      return;
    }

    try {
      await reviewAPI.addReview({
        productId: product.id,
        userId: user.id,
        userName: user.name,
        rating: newReview.rating,
        comment: newReview.comment
      });
      toast.success('Review submitted successfully!');
      setNewReview({ rating: 5, comment: '' });
      loadReviews();
    } catch (error) {
      toast.error('Failed to submit review');
    }
  };

  const renderStars = (rating: number, size: string = 'h-5 w-5') => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate('/products')} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <div className="aspect-square overflow-hidden rounded-lg mb-4">
            <img
              src={getProductImage(product.images)}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded overflow-hidden border-2 ${
                    selectedImage === idx ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={getProductImage([image])} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl">{product.name}</h1>
              {product.featured && <Badge>Featured</Badge>}
            </div>
            <Badge variant="outline">{product.category}</Badge>
          </div>

          <div className="flex items-center gap-4">
            {renderStars(product.rating)}
            <span className="text-muted-foreground">
              {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="text-4xl font-bold">{formatINR(product.price)}</div>

          <p className="text-muted-foreground">{product.description}</p>

          <div>
            <p className="mb-2 flex items-center gap-2">
              <span>Stock:</span>
              <span className={`font-semibold ${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                {product.stock} available
              </span>
            </p>
            {product.stock < 10 && product.stock > 0 && (
              <Badge variant="destructive" className="bg-amber-500 hover:bg-amber-600 border-none font-semibold text-white animate-pulse">
                ⚠️ Low Stock: Only {product.stock} left!
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border-0"
                min="1"
                max={product.stock}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleAddToCart} className="flex-grow" disabled={product.stock === 0}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleWishlist}
              className="border border-border/80 rounded-md"
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="w-full">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="write-review">Write a Review</TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Authentic product backed by manufacturer warranty</li>
                <li>Ships within 1–2 business days from our warehouse</li>
                <li>30-day return policy on unused items</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specs">
          <Card>
            <CardContent className="pt-6">
              <dl className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-muted-foreground">Category</dt>
                  <dd className="font-medium">{product.category}</dd>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-muted-foreground">SKU</dt>
                  <dd className="font-medium">SH-{product.id.padStart(5, '0')}</dd>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-muted-foreground">Availability</dt>
                  <dd className="font-medium">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</dd>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <dt className="text-muted-foreground">Rating</dt>
                  <dd className="font-medium">{product.rating.toFixed(1)} / 5 ({product.reviewCount} reviews)</dd>
                </div>
                <div className="flex justify-between py-2 border-b sm:col-span-2">
                  <dt className="text-muted-foreground">Warranty</dt>
                  <dd className="font-medium">1-year limited manufacturer warranty</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {reviews.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{review.userName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {renderStars(review.rating, 'h-4 w-4')}
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{review.comment}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="write-review">
          <Card>
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
              {!user ? (
                <p className="text-muted-foreground">
                  Please <button onClick={() => navigate('/')} className="underline">login</button> to write a review
                </p>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="text-sm mb-2 block">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                        >
                          <Star
                            className={`h-8 w-8 cursor-pointer ${
                              star <= newReview.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm mb-2 block">Your Review</label>
                    <Textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your experience with this product..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button type="submit">Submit Review</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {recommendations.length > 0 && (
        <div className="mt-16 border-t pt-12">
          <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} onClick={() => window.scrollTo(0,0)}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col relative group">
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={getProductImage(p.images)}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {p.stock < 10 && p.stock > 0 && (
                      <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded font-semibold">
                        Only {p.stock} left!
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{p.category}</span>
                    <h3 className="text-sm font-semibold mt-1 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{p.rating.toFixed(1)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div className="font-bold">{formatINR(p.price)}</div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        await addToCart(p.id, 1);
                        toast.success(`${p.name} added to cart!`);
                      }}
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                      Add
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
