import { PageHeader } from "@/components/ui";
import { SectionPending } from "@/components/SectionPending";

export default function MaterialsPage() {
  return (
    <>
      <PageHeader
        title="Learning Materials"
        description="The original presentations in PPTX and PDF, organised by course and module."
      />
      <SectionPending
        phase="Phase 5"
        willInclude={[
          "Library of the five original presentations (PPTX and PDF)",
          "Search and filter by course and module",
          "Open and download for each file",
        ]}
      />
    </>
  );
}
