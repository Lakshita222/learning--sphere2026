import { PageHeader } from "@/components/ui";
import { SectionPending } from "@/components/SectionPending";

export default function CertificatesPage() {
  return (
    <>
      <PageHeader
        title="Certificates"
        description="Completion certificates unlock when all lessons are complete, all module assessments are passed, and the final scores at least 70%."
      />
      <SectionPending
        phase="Phase 7"
        willInclude={[
          "Printable certificate with student name, course name, completion date, and Learning Sphere branding",
          "Save as PDF through the browser print dialog",
          "Eligibility check that explains anything still outstanding",
        ]}
      />
    </>
  );
}
