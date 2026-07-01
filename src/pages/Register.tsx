import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, ShieldCheck, ShoppingBag, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword } from '../utils/authValidation';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../app/components/ui/card';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const passwordRules = useMemo(() => {
    const minLen = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return { minLen, hasUpper, hasNumber };
  }, [password]);

  const computedEmailError = useMemo(() => {
    if (!email.trim()) return null;
    return validateEmail(email);
  }, [email]);

  const computedPasswordError = useMemo(() => {
    if (!password) return null;
    return validatePassword(password);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: Record<string, string> = {};

    if (!name.trim()) {
      nextErrors.name = 'Full name is required';
    }

    const emailError = validateEmail(email);
    if (emailError) nextErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) nextErrors.password = passwordError;

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await register(email, password, name);
      navigate('/home');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-5 gap-6 items-stretch">
        <aside className="md:col-span-2 hidden md:flex flex-col justify-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background border border-border/60 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ShopHub</p>
              <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            Join thousands of shoppers across India. Get wishlist, fast checkout and order tracking.
          </p>

          <div className="mt-6 space-y-4">
            <FeatureRow icon={Zap} title="Fast Setup" desc="Create account in under a minute" />
            <FeatureRow icon={ShieldCheck} title="Safe Authentication" desc="Strong password rules to protect you" />
            <FeatureRow icon={GraduationCap} title="Smart Shopping" desc="Better recommendations with your profile" />
          </div>

          <div className="mt-8 rounded-2xl p-4 bg-primary/5 border border-primary/15">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Sparkles className="h-4 w-4" />
              Pro tip
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Use a password that includes uppercase letters and numbers.
            </p>
          </div>
        </aside>

        <section className="md:col-span-3">
          <Card className="w-full shadow-lg border border-border/60 backdrop-blur">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-3 md:hidden">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Sign up</CardTitle>
              <CardDescription className="text-center">Use your real email address</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} noValidate>
              <CardContent className="space-y-4">
                {(errors.name || errors.email || errors.password || errors.confirmPassword) && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                    <p className="text-sm font-medium text-destructive">Check the form and try again.</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    aria-invalid={!!errors.name}
                    autoComplete="name"
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    aria-invalid={!!errors.email}
                    autoComplete="email"
                  />
                  {(errors.email || computedEmailError) && (
                    <p className="text-sm text-destructive">{errors.email || computedEmailError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                      }}
                      minLength={8}
                      aria-invalid={!!errors.password}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-accent text-muted-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {(errors.password || computedPasswordError) && (
                    <p className="text-sm text-destructive">{errors.password || computedPasswordError}</p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <RuleItem ok={passwordRules.minLen} text="8+ chars" />
                    <RuleItem ok={passwordRules.hasUpper} text="1 uppercase" />
                    <RuleItem ok={passwordRules.hasNumber} text="1 number" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                      }}
                      minLength={8}
                      aria-invalid={!!errors.confirmPassword}
                      autoComplete="new-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 hover:bg-accent text-muted-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
                <div className="text-sm text-center">
                  Already have an account?{' '}
                  <Link to="/" className="underline font-medium">
                    Login
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </section>
      </div>
    </div>
  );
}

function FeatureRow({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-2xl bg-background border border-border/60 flex items-center justify-center">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function RuleItem({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div className={`rounded-md border px-2 py-1 ${ok ? 'border-primary/30 bg-primary/10 text-primary' : 'border-border/60 bg-background text-muted-foreground'}`}>
      {text}
    </div>
  );
}

