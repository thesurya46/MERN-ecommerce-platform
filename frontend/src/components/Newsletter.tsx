import { useState } from 'react';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

interface NewsletterProps {
  compact?: boolean;
}

export default function Newsletter({ compact = false }: NewsletterProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
    }
    toast.success('Thanks for subscribing! You\'ll receive exclusive deals soon.');
    setEmail('');
  };

  if (compact) {
    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-lg">Stay in the loop</h3>
          <p className="text-sm text-muted-foreground">Get exclusive offers and new arrivals in your inbox.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2 w-full md:max-w-md">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button type="submit">Subscribe</Button>
        </form>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-primary via-indigo-600 to-purple-700 text-primary-foreground py-20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]" />
      <div className="container mx-auto px-4 text-center">
        <Mail className="h-12 w-12 mx-auto mb-6 opacity-80" />
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Subscribe to Our Newsletter</h2>
        <p className="opacity-90 mb-6 max-w-md mx-auto">
          Be the first to know about sales, new products, and member-only discounts.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-primary-foreground text-foreground"
          />
          <Button type="submit" variant="secondary" className="shrink-0">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
