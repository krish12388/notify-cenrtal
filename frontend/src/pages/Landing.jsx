import React, { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Zap, Layout, Clock, Smartphone, MessageSquareWarning, CalendarX2, ArrowRight, QrCode, Bell } from 'lucide-react';

// Custom Intersection Observer Hook for scroll-reveal animations
function useInView(options = { threshold: 0.1 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.disconnect();
    };
  }, []);

  return [ref, inView];
}

const Reveal = ({ children, delay = 0 }) => {
  const [ref, inView] = useInView({ threshold: 0.1 });
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {children}
    </div>
  );
};

const Landing = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-200">
      
      {/* 1. Navigation Top Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-xl">
              N
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">NotifyCentral</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#problem" className="hover:text-teal-600 transition-colors">Problem</a>
            <a href="#solution" className="hover:text-teal-600 transition-colors">Solution</a>
            <a href="#features" className="hover:text-teal-600 transition-colors">Features</a>
            <a href="#impact" className="hover:text-teal-600 transition-colors">Impact</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors">
              Log in
            </Link>
            <a href="https://rajput127sakshi.wixsite.com/college-notice-porta" target="_blank" rel="noopener noreferrer">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 py-5 shadow-md hover:scale-105 transition-transform">
                Visit Site
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal delay={100}>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-sm font-medium mb-6 border border-teal-100">
                <span className="flex h-2 w-2 rounded-full bg-teal-600 animate-pulse"></span>
                The Modern College Hub
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-slate-900">
                A smart solution to <span className="text-teal-600">centralize and simplify</span> student communication.
              </h1>
              <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-light">
                Stop missing crucial deadlines because information is scattered across WhatsApp groups, flooded email inboxes, and physical notice boards.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white text-lg px-8 py-7 rounded-2xl shadow-xl hover:shadow-teal-500/20 hover:scale-105 transition-all duration-300">
                    Get Started Now
                  </Button>
                </Link>
                <a href="#problem">
                  <Button variant="outline" className="w-full sm:w-auto text-lg px-8 py-7 rounded-2xl border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all">
                    Discover More
                  </Button>
                </a>
              </div>
            </div>
          </Reveal>

          {/* Floating UI Mockup */}
          <Reveal delay={300}>
            <div className="relative w-full aspect-square md:aspect-video lg:aspect-square flex justify-center items-center">
              <div className="absolute inset-0 bg-teal-600/5 blur-3xl rounded-full" />
              <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-6 animate-[float_6s_ease-in-out_infinite] z-10">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-32 bg-teal-100 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-24 w-full bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
                      <div className="h-3 w-3/4 bg-slate-200 rounded"></div>
                      <div className="h-3 w-1/4 bg-teal-200 rounded"></div>
                    </div>
                    <div className="h-24 w-full bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col justify-between">
                      <div className="h-3 w-2/3 bg-slate-200 rounded"></div>
                      <div className="h-3 w-1/3 bg-rose-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glassmorphism accent card */}
              <div className="absolute -bottom-10 -left-10 w-48 bg-white/60 backdrop-blur-xl border border-white rounded-2xl p-4 shadow-xl z-20 animate-[float_8s_ease-in-out_infinite_reverse]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">New Exam Schedule</div>
                    <div className="text-xs text-slate-500">Just now</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. The Problem Section */}
      <section id="problem" className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">The Communication Gap</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">Colleges generate massive amounts of data daily. Without a central hub, critical information gets lost in the noise.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            <Reveal delay={100}>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 mb-6">
                  <MessageSquareWarning className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Scattered Information</h3>
                <p className="text-slate-500 leading-relaxed">Students are forced to monitor dozens of different WhatsApp groups, disparate mailing lists, and physical college notice boards.</p>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mb-6">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Information Overload</h3>
                <p className="text-slate-500 leading-relaxed">Important academic updates get buried under hundreds of casual messages in student chat groups, making it impossible to stay organized.</p>
              </div>
            </Reveal>
            <Reveal delay={300}>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-6">
                  <CalendarX2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Missed Deadlines</h3>
                <p className="text-slate-500 leading-relaxed">Due to the fragmented communication channels, students frequently miss fee dates, assignment deadlines, and crucial event registrations.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4. The Solution Section */}
      <section id="solution" className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            {/* Browser Mockup of Wix Site */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-2xl bg-slate-100">
              <div className="bg-slate-200 px-4 py-3 flex items-center gap-2 border-b border-slate-300">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="mx-auto bg-white/50 text-xs text-slate-500 px-3 py-1 rounded-md w-1/2 text-center truncate">
                  rajput127sakshi.wixsite.com/college-notice-porta
                </div>
              </div>
              <div className="aspect-4/3 bg-slate-50 flex flex-col relative overflow-hidden">
                {/* Faux Wix design */}
                <div className="h-16 bg-slate-900 w-full flex items-center px-4 justify-between">
                  <div className="w-24 h-4 bg-slate-700 rounded"></div>
                  <div className="flex gap-2">
                    <div className="w-8 h-4 bg-slate-700 rounded"></div>
                    <div className="w-8 h-4 bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="flex-1 p-8">
                  <div className="w-3/4 h-8 bg-slate-300 rounded mb-4"></div>
                  <div className="w-full h-32 bg-slate-200 rounded-xl mb-4"></div>
                  <div className="w-full h-32 bg-slate-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          </Reveal>
          
          <Reveal delay={200}>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-6">Centralized Platform Strategy</h2>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                We've engineered a unified portal designed to replace the chaos of fragmented communication. Everything you need, exactly when you need it.
              </p>
              
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Easy Accessibility</h4>
                    <p className="text-slate-500 leading-relaxed">A completely responsive architecture allowing you to check notices from any device—laptop, tablet, or mobile phone.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                    <Layout className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">User-Friendly Design</h4>
                    <p className="text-slate-500 leading-relaxed">A pristine, clutter-free dashboard interface that prioritizes readability and significantly reduces cognitive load.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Timely Notifications</h4>
                    <p className="text-slate-500 leading-relaxed">Real-time alerts guarantee you are the first to know about urgent faculty updates or shifting academic schedules.</p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Key Features section */}
      <section id="features" className="py-24 bg-teal-900 text-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Access anytime, from anywhere.</h2>
            <p className="text-xl text-teal-100 font-light mb-12">
              Whether you're in the library studying or commuting home, your college's heartbeat is always in your pocket. Instantly access notices, event details, and deadlines securely in one place.
            </p>
            <Link to="/register">
              <Button className="bg-white text-teal-900 hover:bg-slate-100 text-lg px-8 py-6 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300">
                Create Free Account
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 6. Expected Impact */}
      <section id="impact" className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-4">The Expected Impact</h2>
              <p className="text-lg text-slate-500">Transforming how institutions communicate.</p>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between">
              <div className="text-center md:text-left flex-1">
                <div className="inline-block px-4 py-2 bg-rose-50 text-rose-600 font-medium rounded-full mb-4">Before</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Confusion & Gaps</h3>
                <p className="text-slate-500">Students frequently missing core information, resulting in administrative backlog, missed payments, and frustration.</p>
              </div>
              
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <ArrowRight className="text-slate-400 w-6 h-6" />
              </div>

              <div className="text-center md:text-right flex-1">
                <div className="inline-block px-4 py-2 bg-teal-50 text-teal-600 font-medium rounded-full mb-4">After</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Organized & Efficient</h3>
                <p className="text-slate-500">A streamlined pipeline where every single student is perfectly aligned with faculty announcements instantaneously.</p>
              </div>
            </div>
          </Reveal>

          {/* QR Code Section */}
          <Reveal delay={300}>
            <div className="mt-16 flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Experience the Prototype</h3>
              <div className="w-48 h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center mb-6">
                <QrCode className="w-16 h-16 text-slate-300" />
              </div>
              <p className="text-slate-500 mb-6 max-w-sm">Scan to visit our interactive prototype or click the button below to explore the vision.</p>
              <a href="https://rajput127sakshi.wixsite.com/college-notice-porta" target="_blank" rel="noopener noreferrer">
                <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-full">
                  Visit Prototype
                </Button>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. Professional Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-teal-600 flex items-center justify-center text-white font-bold text-xs">
                N
              </div>
              <span className="font-bold text-lg tracking-tight text-white">NotifyCentral</span>
            </div>
            <p className="text-sm">Centralized Student Notice Communication System</p>
          </div>
          
          <div className="md:text-right space-y-2">
            <p className="text-sm">
              <span className="text-slate-500">Developed By:</span> <span className="text-slate-200 font-medium">Sakshi Singh & Aditya Vikram</span>
            </p>
            <p className="text-sm">
              <span className="text-slate-500">Presented To:</span> <span className="text-slate-200 font-medium">Dr. Bhupinder Kaur</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Tailwind keyframes inline for floating animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}} />
    </div>
  );
};

export default Landing;
