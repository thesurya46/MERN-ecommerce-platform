import { Link } from 'react-router-dom';
import { Button } from '../app/components/ui/button';
import { Card, CardContent } from '../app/components/ui/card';
import { Target, Users, Award, Heart, ArrowRight } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'Make quality products accessible to everyone with transparent pricing and reliable delivery.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description: 'Every decision starts with you — from product curation to support response times under 24 hours.',
  },
  {
    icon: Award,
    title: 'Quality Guaranteed',
    description: 'We partner with trusted brands and stand behind every item with our satisfaction guarantee.',
  },
  {
    icon: Heart,
    title: 'Community Impact',
    description: '1% of profits support local education initiatives and sustainable packaging programs.',
  },
];

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '2,000+', label: 'Products' },
  { value: '99.2%', label: 'On-Time Delivery' },
  { value: '4.8★', label: 'Average Rating' },
];

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About ShopHub</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Founded in 2020, ShopHub has grown from a small online boutique into a full-service marketplace
            trusted by thousands of shoppers across the country. We believe shopping should be simple,
            secure, and enjoyable.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center border-none ring-1 ring-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6 pb-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent mb-1">{stat.value}</div>
                <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 pb-16">
        <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 space-y-3">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start shopping?</h2>
          <p className="text-muted-foreground mb-6">
            Browse our catalog or reach out if you have questions — we are here to help.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products">
              <Button size="lg">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">Contact Us</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
