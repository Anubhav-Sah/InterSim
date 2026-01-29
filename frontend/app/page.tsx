import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
      
      {/* Navigation Header - Matches the Dashboard Brand Identity */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <span className="text-xl font-bold text-slate-800">InternSim</span>
          </div>

          {/* Navigation Actions */}
          <nav className="flex items-center gap-4">
            <Link href="/login" passHref>
              <Button 
                variant="outline" 
                className="border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all"
              >
                Log In
              </Button>
            </Link>
            <Link href="/register" passHref> 
              {/* Assuming Sign Up goes to same place or similar */}
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg transition-all">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:pt-40 lg:pb-28 text-center overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none opacity-50">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-6 border border-indigo-100">
            v1.0 Now Live
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Master your career with the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
              AI Internship Simulator
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop watching tutorials. Start doing. Practice real-world tasks, get instant 
            AI-powered feedback, and track your professional growth in a safe environment.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" passHref>
              <Button size="lg" className="h-12 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/30 transition-all">
                Start Simulating
              </Button>
            </Link>
            <Link href="#features" passHref>
              <Button size="lg" variant="ghost" className="h-12 px-8 text-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid - ID added for navigation anchor */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Why use InternSim?</h2>
          <p className="text-slate-500 mt-2">Everything you need to bridge the gap between theory and practice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Real Tasks</h3>
              <p className="text-slate-500 leading-relaxed">
                Ditch the "Hello World" tutorials. Work on complex, realistic tickets 
                pulled from actual industry scenarios.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">AI Mentor</h3>
              <p className="text-slate-500 leading-relaxed">
                Stuck on a bug? Your AI mentor provides code reviews, hints, and 
                architectural advice instantly, 24/7.
              </p>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Career Tracking</h3>
              <p className="text-slate-500 leading-relaxed">
                Visualize your skill growth over time. Export your completed tasks 
                as a portfolio to show future employers.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2024 InternSim. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}