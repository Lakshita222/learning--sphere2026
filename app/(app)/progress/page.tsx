import { PageHeader } from "@/components/ui";
import { SectionPending } from "@/components/SectionPending";

export default function ProgressPage() {
  return (
    <>
      <PageHeader
        title="Progress"
        description="Completion, quiz results, and certificate eligibility across all courses."
      />
      <SectionPending
        phase="Phase 7"
        willInclude={[
          "Overall course completion percentage",
          "Per-module completion and pending lessons",
          "Quiz and assessment scores",
          "Progress bars that update when lessons are completed or quizzes are submitted",
        ]}
      />
    </>
  );
}
