import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Newsletter from './Newsletter';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ShopHub</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted online marketplace for quality products, fast delivery, and exceptional customer service since 2020.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Facebook" className="p-2 rounded-full bg-background border hover:bg-accent transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-background border hover:bg-accent transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Instagram" className="p-2 rounded-full bg-background border hover:bg-accent transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 rounded-full bg-background border hover:bg-accent transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-foreground transition-colors">Electronics</Link></li>
              <li><Link to="/wishlist" className="hover:text-foreground transition-colors">Wishlist</Link></li>
              <li><Link to="/orders" className="hover:text-foreground transition-colors">Track Orders</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/faq#shipping" className="hover:text-foreground transition-colors">Shipping Info</Link></li>
              <li><Link to="/faq#returns" className="hover:text-foreground transition-colors">Returns Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>123 Commerce Street, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <a href="tel:+18005551234" className="hover:text-foreground">+1 (800) 555-1234</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <a href="mailto:support@shophub.com" className="hover:text-foreground">support@shophub.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <Newsletter compact />
        </div>

        <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ShopHub. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/faq#privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link to="/faq#terms" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
