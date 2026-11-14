import { PageHeader } from "@/components/ui";
import { SectionPending } from "@/components/SectionPending";

export default function QuizzesPage() {
  return (
    <>
      <PageHeader
        title="Quizzes and Assessments"
        description="Module assessments and course finals. A score of 70% or higher passes."
      />
      <SectionPending
        phase="Phase 6"
        willInclude={[
          "Multiple-choice quizzes with four options per question",
          "Server-side grading and automatic score calculation",
          "Correct and incorrect feedback with explanations",
          "Retake option and attempt history",
        ]}
      />
    </>
  );
}
