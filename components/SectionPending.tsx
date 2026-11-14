import { Card, EmptyState } from "@/components/ui";

/**
 * Shell for a section whose data and interactions are built in a later phase.
 * It shows no working controls, so nothing here looks functional before it is.
 * Pages own their h1; this block uses h2/h3 so each page keeps one h1.
 */
export function SectionPending({
  title,
  description,
  phase,
  willInclude,
}: {
  title?: string;
  description?: string;
  phase: string;
  willInclude: string[];
}) {
  return (
    <>
      {title && (
        <h2 className="mb-1 text-lg font-semibold text-navy-900">{title}</h2>
      )}
      {description && (
        <p className="mb-5 text-sm text-muted sm:text-base">{description}</p>
      )}
      <Card>
        <EmptyState title={`Built in ${phase}`}>
          <p>
            This section is part of the approved plan and is not yet functional.
          </p>
        </EmptyState>
        <h3 className="mt-6 text-sm font-semibold text-navy-900">
          Planned for this section
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
          {willInclude.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>
    </>
  );
}
