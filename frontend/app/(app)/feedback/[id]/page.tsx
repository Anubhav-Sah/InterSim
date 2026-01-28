import Container from "@/components/layout/container";
import Section from "@/components/layout/section";
import PageTitle from "@/components/ui/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { demoFeedback } from "@/data/feedback";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Container>
      <PageTitle
        title="Feedback"
        subtitle={`Submission ID: ${id}`}
      />

      <Section>
        <Card>
          <CardContent className="p-6 space-y-2">
            <Badge>
              Score: {demoFeedback.score} / 10
            </Badge>
            <p>{demoFeedback.summary}</p>
          </CardContent>
        </Card>
      </Section>

      <Button variant="outline">Improve & Resubmit</Button>
    </Container>
  );
}
