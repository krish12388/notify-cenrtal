import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Bell, Shield, Zap } from 'lucide-react';

const Landing = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-primary/20 hover:bg-primary/30 transition-all duration-1000 blur-[120px] rounded-full pointer-events-none" />

      <main className="z-10 text-center max-w-4xl px-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Never Miss a Notice <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-accent">Again</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          The centralized communication platform for our college. Stay updated with real-time academic notices, event alerts, and crucial deadlines.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
          <Link to="/login">
            <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg rounded-xl">
              Login to Dashboard
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 text-lg rounded-xl border-2">
              Create Account
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left mt-16 max-w-5xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl">
            <div className="bg-accent/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-accent">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Real-Time Alerts</h3>
            <p className="text-muted-foreground">Receive instant notifications for urgent updates and deadlines.</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl">
            <div className="bg-primary/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-primary">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Centralized Feed</h3>
            <p className="text-muted-foreground">All college notices neatly categorized in one intuitive dashboard.</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl">
            <div className="bg-chart-2/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-chart-2">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Verified Sources</h3>
            <p className="text-muted-foreground">Only authorized CRs and faculty can post, ensuring authenticity.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Landing;
