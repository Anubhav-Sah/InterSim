import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">InternSim</h1>

          <Link href="/login" className="underline">
            <Button variant="outline">Login</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          AI Internship Simulator
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
          Practice real internship tasks, get AI-powered feedback, and track
          your progress like a real intern.
        </p>

        <div className="flex justify-center gap-4">
          <Link href="/login" className="underline">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Real Tasks</h3>
              <p className="text-sm text-muted-foreground">
                Work on realistic internship-style tasks instead of tutorials.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">AI Feedback</h3>
              <p className="text-sm text-muted-foreground">
                Get instant feedback and suggestions from AI.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track your learning journey like a real internship.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
