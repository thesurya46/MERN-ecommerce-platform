import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { wishlistAPI } from '../services/api';
import { Button } from '../app/components/ui/button';
import { Badge } from '../app/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../app/components/ui/dropdown-menu';
import {
  ShoppingBag,
  ShoppingCart,
  User,
  LogOut,
  Package,
  Settings,
  Heart,
  Sun,
  Moon,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const [wishlistCount, setWishlistCount] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  const updateWishlistCount = async () => {
    try {
      const list = await wishlistAPI.getWishlist();
      setWishlistCount(list.length);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    updateWishlistCount();
    window.addEventListener('wishlist-updated', updateWishlistCount);
    return () => window.removeEventListener('wishlist-updated', updateWishlistCount);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const goTo = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="border-b sticky top-0 bg-background/95 backdrop-blur-md z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-2">
          <Link to="/home" className="flex items-center gap-2 shrink-0">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight hidden sm:inline">ShopHub</span>
          </Link>

          <SearchBar />

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Link to="/products" className="hidden lg:block">
              <Button variant="ghost" size="sm">Products</Button>
            </Link>
            <Link to="/about" className="hidden xl:block">
              <Button variant="ghost" size="sm">About</Button>
            </Link>
            <Link to="/faq" className="hidden xl:block">
              <Button variant="ghost" size="sm">
                <HelpCircle className="h-4 w-4 lg:mr-1" />
                <span className="hidden lg:inline">FAQ</span>
              </Button>
            </Link>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full" type="button">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <Link to="/wishlist" className="relative">
              <Button variant="ghost" size="icon" className="rounded-full" type="button">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground font-semibold">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="rounded-full" type="button">
                <ShoppingCart className="h-5 w-5" />
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground font-semibold">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center border rounded-full pl-0.5 pr-0.5 bg-background">
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" asChild>
                  <Link to="/profile" title="My Profile" aria-label="My Profile">
                    <User className="h-5 w-5" />
                  </Link>
                </Button>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      className="rounded-full h-8 w-8"
                      aria-label="Account menu"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-[100]">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{user.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => goTo('/profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => goTo('/orders')}
                    >
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={() => goTo('/admin')}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onSelect={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link to="/">
                <Button type="button">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
