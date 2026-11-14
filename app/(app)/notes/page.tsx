import { PageHeader } from "@/components/ui";
import { SectionPending } from "@/components/SectionPending";

export default function NotesPage() {
  return (
    <>
      <PageHeader
        title="Notes"
        description="Personal notes organised by module."
      />
      <SectionPending
        phase="Phase 7"
        willInclude={[
          "Create, edit, and delete personal notes",
          "Organise notes by module",
          "Quick links to important learning resources",
        ]}
      />
    </>
  );
}
