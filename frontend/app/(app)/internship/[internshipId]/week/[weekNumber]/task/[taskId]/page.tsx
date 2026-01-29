"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Clock, 
  Code2, 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

// --- Types ---
type Task = {
  _id: string;
  title: string;
  description: string;
  expectedDeliverables: string;
  estimatedHours: number;
  difficulty: string;
};

// --- Helper Components ---
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    <p className="text-slate-500 text-sm animate-pulse">Setting up workspace...</p>
  </div>
);

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
    {children}
  </span>
);

export default function TaskEditorPage() {
  const router = useRouter();
  const params = useParams();

  const { internshipId, taskId, weekNumber } = params as {
    internshipId: string;
    taskId: string;
    weekNumber: string;
  };

  const [task, setTask] = useState<Task | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Load task
  useEffect(() => {
    async function loadTask() {
      try {
        const tasks = await apiFetch<Task[]>(
          `${API_BASE_URL}/internships/${internshipId}/tasks?week=${weekNumber}`
        );
        const foundTask = tasks.find((t) => t._id === taskId);
        setTask(foundTask || null);
      } catch (err) {
        setError("Failed to load task details.");
      } finally {
        setLoading(false);
      }
    }
    loadTask();
  }, [internshipId, weekNumber, taskId]);

  // 🔹 Submit solution
  async function handleSubmit() {
    if (!task) return;
    if (!code.trim()) {
      setError("Workspace is empty. Please write your solution.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        internshipId,
        taskId,
        taskDescription: task.description,
        submittedData: code,
      };

      const res = await apiFetch<{ submissionId: string; status: string }>(
        `${API_BASE_URL}/submissions`, 
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      router.push(`/feedback/${res.submissionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingSpinner />;
  
  if (!task) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
         <div className="bg-red-50 text-red-600 p-4 rounded-lg inline-block mb-4">
           Task not found
         </div>
         <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-50">
      
      {/* 1. Header Toolbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push(`/internship/${internshipId}/week/${weekNumber}`)}
            className="text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit Task
          </Button>
          <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
          <h1 className="text-lg font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">
            {task.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
           {/* Metadata Badges */}
           <div className="hidden sm:flex items-center gap-2">
             <Badge className="bg-blue-50 text-blue-700 border-blue-200 capitalize">
               {task.difficulty}
             </Badge>
             <Badge className="bg-slate-50 text-slate-600 border-slate-200 flex items-center gap-1">
               <Clock className="w-3 h-3" /> {task.estimatedHours}h
             </Badge>
           </div>
           
           <Button
             onClick={handleSubmit}
             disabled={submitting || !code.trim()}
             className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
           >
             {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></span>
                  Submitting
                </span>
             ) : (
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" /> Submit
                </span>
             )}
           </Button>
        </div>
      </header>

      {/* 2. Main Workspace (Split View) */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 h-full">
        
        {/* Left Panel: Task Description */}
        <section className="w-full lg:w-1/3 flex flex-col gap-6 overflow-y-auto">
          <Card className="border-slate-200 shadow-sm flex-1">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-800">
                <FileText className="w-5 h-5 text-indigo-600" />
                Task Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="prose prose-sm prose-slate max-w-none text-slate-600 leading-relaxed">
                {task.description}
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Expected Deliverables
                </h4>
                <p className="text-sm text-amber-800">
                  {task.expectedDeliverables}
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Right Panel: Code Editor */}
        <section className="w-full lg:w-2/3 flex flex-col">
          <Card className="flex-1 border-slate-200 shadow-sm flex flex-col overflow-hidden h-full min-h-[500px]">
            {/* Editor Toolbar */}
            <div className="bg-slate-800 text-slate-200 px-4 py-2 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>editor.ts</span>
              </div>
              <span className="opacity-60">UTF-8</span>
            </div>
            
            {/* Editor Surface */}
            <div className="flex-1 relative bg-slate-900">
              <Textarea
                placeholder="// Write your code solution here..."
                className="w-full h-full min-h-[500px] resize-none border-0 rounded-none bg-slate-900 text-slate-100 font-mono text-sm leading-relaxed p-6 focus-visible:ring-0 focus-visible:ring-offset-0 selection:bg-indigo-500/30"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
              />
            </div>

            {/* Error Message Area */}
            {error && (
              <div className="bg-red-50 border-t border-red-100 p-4 flex items-start gap-3 animate-in slide-in-from-bottom-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-red-800">Submission Error</h4>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
            )}
          </Card>
        </section>

      </main>
    </div>
  );
}