import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShoppingBag, ShieldCheck, Sparkles, Timer, Wallet } from 'lucide-react';
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError || undefined,
        password: passwordError || undefined,
      });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/home');
    } catch (error) {
      console.error('Login error:', error);
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
              <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            Sign in to track orders, manage your wishlist, and checkout faster.
          </p>

          <div className="mt-6 space-y-4">
            <FeatureRow icon={Wallet} title="Secure Payments" desc="UPI, cards & more with encrypted flow" />
            <FeatureRow icon={ShieldCheck} title="Protected Account" desc="Your data stays safe with secure auth" />
            <FeatureRow icon={Timer} title="Quick Checkout" desc="Remember your details for faster buying" />
          </div>

          <div className="mt-8 rounded-2xl p-4 bg-primary/5 border border-primary/15">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Sparkles className="h-4 w-4" />
              Tip
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Use your real email address to avoid login issues.
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
              <CardTitle className="text-2xl text-center">Sign in</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit} noValidate>
              <CardContent className="space-y-4">
                {(errors.email || errors.password) && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                    <p className="text-sm font-medium text-destructive">Please fix the highlighted fields.</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    aria-invalid={!!errors.email}
                    autoComplete="email"
                  />
                  {(errors.email || computedEmailError) && (
                    <p className="text-sm text-destructive">
                      {errors.email || computedEmailError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Link to="#" className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 pointer-events-none opacity-70">
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                      }}
                      minLength={8}
                      aria-invalid={!!errors.password}
                      autoComplete="current-password"
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
                    <p className="text-sm text-destructive">
                      {errors.password || computedPasswordError}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 chars, with 1 uppercase letter & 1 number.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                <div className="text-sm text-center text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <Link to="/register" className="underline text-foreground font-medium">
                    Create one
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

