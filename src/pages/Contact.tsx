import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../app/components/ui/card';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Textarea } from '../app/components/ui/textarea';
import { Label } from '../app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../app/components/ui/select';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
    messages.push({ ...form, submittedAt: new Date().toISOString() });
    localStorage.setItem('contact_messages', JSON.stringify(messages));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: 'general', message: '' });
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-indigo-500/10 via-background to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Have a question about your order, a product, or partnership? Our team is ready to help 24/7.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8 max-w-6xl">
        <div className="space-y-4">
          <Card className="border-none ring-1 ring-border shadow-sm">
            <CardContent className="pt-6 flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:support@shophub.com" className="text-sm text-muted-foreground hover:text-foreground">
                  support@shophub.com
                </a>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none ring-1 ring-border shadow-sm">
            <CardContent className="pt-6 flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">Mon–Fri, 9am–6pm EST</p>
                <a href="tel:+18005551234" className="text-sm hover:text-foreground">+1 (800) 555-1234</a>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none ring-1 ring-border shadow-sm">
            <CardContent className="pt-6 flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Office</p>
                <p className="text-sm text-muted-foreground">
                  123 Commerce Street<br />
                  New York, NY 10001
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none ring-1 ring-border shadow-sm">
            <CardContent className="pt-6 flex gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Response Time</p>
                <p className="text-sm text-muted-foreground">Average reply within 24 hours</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2 shadow-xl border-none ring-1 ring-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send a Message
            </CardTitle>
            <CardDescription>Fill out the form and we will respond as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="order">Order Status</SelectItem>
                    <SelectItem value="returns">Returns & Refunds</SelectItem>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="partnership">Business Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you?"
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
