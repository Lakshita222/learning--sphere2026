import { PageHeader } from "@/components/ui";
import { SectionPending } from "@/components/SectionPending";

export default function CoursesPage() {
  return (
    <>
      <PageHeader
        title="Course Modules"
        description="Five courses and 37 modules, built from the official presentations."
      />
      <SectionPending
        phase="Phase 5"
        willInclude={[
          "Course list with module descriptions and learning objectives",
          "Module pages with topics, lessons, examples, and related materials",
          "Lesson pages with Mark as complete and Next lesson navigation",
          "Source presentation and slide reference for each lesson",
        ]}
      />
    </>
  );
}
