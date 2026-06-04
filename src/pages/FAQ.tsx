import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../app/components/ui/accordion';
import { Card, CardContent } from '../app/components/ui/card';
import { Button } from '../app/components/ui/button';
import { HelpCircle } from 'lucide-react';

const faqSections = [
  {
    id: 'orders',
    title: 'Orders & Account',
    items: [
      {
        q: 'How do I track my order?',
        a: 'Log in and visit My Orders from your account menu. Each order shows its current status — pending, processing, shipped, or delivered — with timestamps.',
      },
      {
        q: 'Do I need an account to shop?',
        a: 'You can browse and add items to your cart without an account. An account is required at checkout so we can process your order and send updates.',
      },
      {
        q: 'Can I modify or cancel an order?',
        a: 'Orders can be cancelled within 1 hour of placement while status is "pending". Contact support for changes after that window.',
      },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping & Delivery',
    items: [
      {
        q: 'How much does shipping cost?',
        a: 'Standard shipping is FREE on orders over $50. Orders under $50 have a flat $5.99 shipping fee. Express shipping (2–3 business days) is $12.99.',
      },
      {
        q: 'How long will delivery take?',
        a: 'Standard delivery takes 5–7 business days. Express options are available at checkout. You will receive a tracking email once your order ships.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'We currently ship within the United States. International shipping is planned for a future release — subscribe to our newsletter for updates.',
      },
    ],
  },
  {
    id: 'returns',
    title: 'Returns & Refunds',
    items: [
      {
        q: 'What is your return policy?',
        a: 'Unopened items in original packaging can be returned within 30 days for a full refund. Opened electronics may qualify for exchange within 14 days.',
      },
      {
        q: 'How do I start a return?',
        a: 'Email support@shophub.com with your order number and reason for return. We will send a prepaid return label for eligible items.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5–7 business days after we receive your return. The amount appears on your original payment method.',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Payment & Security',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept credit/debit cards, UPI, net banking, and cash on delivery (COD) where available. All card transactions are encrypted.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes. We use industry-standard SSL encryption and never store full card numbers on our servers.',
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & Terms',
    items: [
      {
        q: 'How do you use my personal data?',
        a: 'We use your data only to process orders, improve our service, and send marketing emails if you opt in. We never sell your information to third parties.',
      },
      {
        q: 'Terms of Service',
        a: 'By using ShopHub you agree to our terms including acceptable use, order fulfillment policies, and limitation of liability. Contact us for the full document.',
      },
    ],
  },
];

export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-12">
        <HelpCircle className="h-12 w-12 mx-auto text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">
          Find answers to common questions. Still need help?{' '}
          <Link to="/contact" className="text-primary underline hover:no-underline">
            Contact our team
          </Link>
          .
        </p>
      </div>

      <div className="space-y-10">
        {faqSections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
            <Accordion type="single" collapsible className="w-full">
              {section.items.map((item, idx) => (
                <AccordionItem key={idx} value={`${section.id}-${idx}`}>
                  <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        ))}
      </div>

      <Card className="mt-12">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground mb-4">Didn&apos;t find what you were looking for?</p>
          <Link to="/contact">
            <Button>Get in Touch</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
