"use client";

import { Card, PageHeader } from "@/components/ui";
import { SectionPending } from "@/components/SectionPending";
import { useSession } from "@/lib/use-session";

export default function DashboardPage() {
  const { session } = useSession();
  const firstName = session?.name.split(" ")[0] ?? "";

  return (
    <>
      <PageHeader
        title={firstName ? `Welcome back, ${firstName}` : "Welcome back"}
        description="Your learning overview for Product Management."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Enrolled courses", "5 courses available"],
          ["Completed lessons", "Tracked from Phase 7"],
          ["Overall progress", "Tracked from Phase 7"],
          ["Quiz performance", "Scored from Phase 6"],
        ].map(([label, note]) => (
          <Card key={label}>
            <p className="text-sm font-medium text-muted">{label}</p>
            <p className="mt-2 text-sm text-navy-900">{note}</p>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <SectionPending
          title="Continue Learning"
          description="Course cards, recent activity, and quick access appear here once content is connected."
          phase="Phase 5"
          willInclude={[
            "Continue Learning card that opens the next incomplete lesson",
            "Course cards with progress indicators",
            "Recent learning activity",
            "Quick links to study materials and quizzes",
          ]}
        />
      </div>
    </>
  );
}
