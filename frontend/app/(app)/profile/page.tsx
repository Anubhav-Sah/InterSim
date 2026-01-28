import Container from "@/components/layout/container";
import Section from "@/components/layout/section";
import PageTitle from "@/components/ui/page-title";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  return (
    <Container>
      <PageTitle title="Profile" />

      <Section>
        <Card>
          <CardContent className="p-6 space-y-4">
            <Input placeholder="Name" />
            <Input placeholder="College" />
            <Input placeholder="Course" />
            <Input placeholder="Semester" />

            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </Section>
    </Container>
  );
}
