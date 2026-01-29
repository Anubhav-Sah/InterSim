"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Container from "@/components/layout/container";
import PageTitle from "@/components/ui/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

type Feedback = {
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  recommendedNextSteps: string[];
};

export default function FeedbackPage() {
  const params = useParams();
  const { submissionId } = params as { submissionId: string };

  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [status, setStatus] = useState<"evaluating" | "completed">(
    "evaluating"
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;

    async function fetchFeedback() {
      try {
        const data = await apiFetch<Feedback>(
          `${API_BASE_URL}/submissions/${submissionId}/feedback`
        );

        // ✅ Feedback ready
        setFeedback(data);
        setStatus("completed");
      } catch {
        // 🔁 AI still processing → retry
        setStatus("evaluating");
        timer = setTimeout(fetchFeedback, 3000);
      }
    }

    fetchFeedback();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [submissionId]);

  return (
    <Container>
      <PageTitle
        title="AI Feedback"
        subtitle={`Submission ID: ${submissionId}`}
      />

      <Card>
        <CardContent className="p-6 space-y-6">
          {status === "evaluating" && (
            <p className="text-sm text-muted-foreground">
              ⏳ Your submission is being evaluated by AI.
              <br />
              This page will update automatically.
            </p>
          )}

          {status === "completed" && feedback && (
            <>
              <FeedbackSection
                title="Strengths"
                items={feedback.strengths}
              />
              <FeedbackSection
                title="Weaknesses"
                items={feedback.weaknesses}
              />
              <FeedbackSection
                title="Improvements"
                items={feedback.improvements}
              />
              <FeedbackSection
                title="Recommended Next Steps"
                items={feedback.recommendedNextSteps}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

function FeedbackSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
