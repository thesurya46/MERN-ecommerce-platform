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
    <div className="container mx-auto px-4 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground">
          Have a question about your order, a product, or partnership? Our team is ready to help.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 flex gap-4">
              <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:support@shophub.com" className="text-sm text-muted-foreground hover:text-foreground">
                  support@shophub.com
                </a>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex gap-4">
              <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">Mon–Fri, 9am–6pm EST</p>
                <a href="tel:+18005551234" className="text-sm hover:text-foreground">+1 (800) 555-1234</a>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex gap-4">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Office</p>
                <p className="text-sm text-muted-foreground">
                  123 Commerce Street<br />
                  New York, NY 10001
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex gap-4">
              <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Response Time</p>
                <p className="text-sm text-muted-foreground">Average reply within 24 hours</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2">
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
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
