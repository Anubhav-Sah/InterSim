import Container from "@/components/layout/container";
import Section from "@/components/layout/section";
import PageTitle from "@/components/ui/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { demoTasks } from "@/data/tasks";
import Link from "next/link";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ UNWRAP PARAMS
  const { id } = await params;

  console.log("URL PARAM ID:", id);

  const task = demoTasks.find((t) => t.id === id);

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <Container>
      <PageTitle title={task.title} subtitle={`Week ${task.week}`} />

      <Section>
        <Card>
          <CardContent className="p-6">{task.description}</CardContent>
        </Card>
      </Section>

      <Link href={`/editor/${task.id}`}>
        <Button>Start Coding</Button>
      </Link>
    </Container>
  );
}
