import { Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';

const SignupPage = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-muted-foreground">Join the future of productivity today</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="name">Full Name</label>
          <div className="relative group">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <input
              id="name"
              placeholder="John Doe"
              className="flex h-10 w-full rounded-xl border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
          <div className="relative group">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <input
              id="email"
              placeholder="name@example.com"
              type="email"
              className="flex h-10 w-full rounded-xl border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
          <div className="relative group">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <input
              id="password"
              placeholder="••••••••"
              type="password"
              className="flex h-10 w-full rounded-xl border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2 flex items-start gap-2">
           <input type="checkbox" id="terms" className="mt-1 accent-primary" />
           <label htmlFor="terms" className="text-xs text-muted-foreground leading-snug">
              By signing up, you agree to our <span className="text-blue-500 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-500 hover:underline cursor-pointer">Privacy Policy</span>.
           </label>
        </div>

        <button 
          className="inline-flex items-center justify-center rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.01] active:scale-[0.99] h-11 px-4 py-2 w-full shadow-lg shadow-blue-500/20"
        >
          Create Account
        </button>
      </form>

      <p className="px-8 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="underline underline-offset-4 hover:text-primary transition-colors">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default SignupPage;
