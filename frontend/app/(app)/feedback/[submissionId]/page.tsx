"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ListChecks, 
  ArrowRight, 
  Loader2, 
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

type Feedback = {
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  recommendedNextSteps: string[];
};

// --- Helper Component: Analyzing State ---
const AnalyzingScreen = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
      <div className="relative bg-white p-4 rounded-full shadow-lg border border-indigo-100">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    </div>
    <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing your submission...</h2>
    <p className="text-slate-500 max-w-md">
      Our AI is reviewing your code structure, logic, and best practices. 
      This usually takes about 10-20 seconds.
    </p>
  </div>
);

// --- Helper Component: Feedback Section Card ---
const FeedbackSection = ({
  title,
  items,
  icon: Icon,
  variant
}: {
  title: string;
  items: string[];
  icon: any;
  variant: "success" | "warning" | "info" | "primary";
}) => {
  const styles = {
    success: {
      border: "border-emerald-200",
      bg: "bg-emerald-50/50",
      text: "text-emerald-900",
      iconColor: "text-emerald-600",
      bullet: "bg-emerald-200"
    },
    warning: {
      border: "border-amber-200",
      bg: "bg-amber-50/50",
      text: "text-amber-900",
      iconColor: "text-amber-600",
      bullet: "bg-amber-200"
    },
    info: {
      border: "border-blue-200",
      bg: "bg-blue-50/50",
      text: "text-blue-900",
      iconColor: "text-blue-600",
      bullet: "bg-blue-200"
    },
    primary: {
      border: "border-indigo-200",
      bg: "bg-indigo-50/50",
      text: "text-indigo-900",
      iconColor: "text-indigo-600",
      bullet: "bg-indigo-200"
    }
  };

  const style = styles[variant];

  if (!items || items.length === 0) return null;

  return (
    <Card className={`border shadow-sm h-full ${style.border} ${style.bg}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`flex items-center gap-2 text-lg font-bold ${style.text}`}>
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.bullet}`} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default function FeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const { submissionId } = params as { submissionId: string };

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [status, setStatus] = useState<"evaluating" | "completed">("evaluating");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let isMounted = true;

    async function fetchFeedback() {
      try {
        const data = await apiFetch<Feedback>(
          `${API_BASE_URL}/submissions/${submissionId}/feedback`
        );

        if (isMounted) {
          setFeedback(data);
          setStatus("completed");
        }
      } catch {
        // 🔁 Retry if AI is still processing (404 or 202 likely)
        if (isMounted) {
          timer = setTimeout(fetchFeedback, 3000);
        }
      }
    }

    fetchFeedback();

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [submissionId]);

  if (status === "evaluating") {
    return <AnalyzingScreen />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-2 bg-green-100 text-green-700 rounded-full mb-4">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Evaluation Complete</h1>
        <p className="text-slate-500">
          Here is the breakdown of your submission (ID: {submissionId.slice(-6)})
        </p>
      </div>

      {feedback && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Main Feedback Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Strengths */}
            <FeedbackSection
              title="Key Strengths"
              items={feedback.strengths}
              icon={CheckCircle2}
              variant="success"
            />

            {/* 2. Weaknesses / Areas of Concern */}
            <FeedbackSection
              title="Areas for Review"
              items={feedback.weaknesses}
              icon={AlertTriangle}
              variant="warning"
            />

            {/* 3. Improvements */}
            <FeedbackSection
              title="Suggested Improvements"
              items={feedback.improvements}
              icon={TrendingUp}
              variant="info"
            />

            {/* 4. Next Steps */}
            <FeedbackSection
              title="Recommended Next Steps"
              items={feedback.recommendedNextSteps}
              icon={ListChecks}
              variant="primary"
            />
          </div>

          {/* Action Footer */}
          <div className="flex justify-center pt-8 border-t border-slate-200">
            <Button 
              size="lg" 
              onClick={() => router.push("/dashboard")}
              className="bg-slate-900 hover:bg-slate-800 text-white shadow-md group"
            >
              Back to Dashboard
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

        </div>
      )}
    </div>
  );
}