"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/layout/container";
import PageTitle from "@/components/ui/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

type Task = {
  _id: string;
  title: string;
  description: string;
  expectedDeliverables: string;
  estimatedHours: number;
  difficulty: string;
};

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

  // 🔹 Load task for the selected week
  useEffect(() => {
    async function loadTask() {
      try {
        const tasks = await apiFetch<Task[]>(
          `${API_BASE_URL}/internships/${internshipId}/tasks?week=${weekNumber}`
        );

        const foundTask = tasks.find((t) => t._id === taskId);
        setTask(foundTask || null);
      } catch (err) {
        setError("Failed to load task");
      } finally {
        setLoading(false);
      }
    }

    loadTask();
  }, [internshipId, weekNumber, taskId]);

  // 🔹 Submit solution
  async function handleSubmit() {
    if (!task) {
      setError("Task not found");
      return;
    }

    if (!code.trim()) {
      setError("Please write your solution before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        internshipId,                 // 1️⃣ REQUIRED
        taskId,                       // 2️⃣ REQUIRED
        taskDescription: task.description, // 3️⃣ REQUIRED
        submittedData: code,           // 4️⃣ REQUIRED
      };

      console.log("SUBMISSION PAYLOAD →", payload);

      const res = await apiFetch<{
        submissionId: string;
        status: string;
      }>(`${API_BASE_URL}/submissions`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // 👉 Redirect to feedback page
      router.push(`/feedback/${res.submissionId}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Submission failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // 🔹 Loading state
  if (loading) {
    return <Container>Loading task...</Container>;
  }

  // 🔹 Task not found
  if (!task) {
    return <Container>Task not found</Container>;
  }

  return (
    <Container>
      <PageTitle
        title={task.title}
        subtitle={`Difficulty: ${task.difficulty} · ⏱ ${task.estimatedHours} hrs`}
      />

      {/* Task description */}
      <Card className="mb-6">
        <CardContent className="p-6 space-y-4">
          <p className="text-sm text-muted-foreground">
            {task.description}
          </p>

          <div className="text-sm">
            <strong>Expected Deliverables:</strong>
            <p className="mt-1 text-muted-foreground">
              {task.expectedDeliverables}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Code editor */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <Textarea
            placeholder="Write your code / solution here..."
            className="min-h-55 font-mono"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={submitting || !code.trim()}
            >
              {submitting ? "Submitting..." : "Submit Code"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
