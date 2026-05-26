import { PageHeader } from "@/components/layout/PageHeader";
import { CreateAssignmentForm } from "@/components/create-form/CreateAssignmentForm";

export default function NewAssignmentPage() {
  return (
    <div className="min-h-full bg-background">
      <div className="hidden md:block">
        <PageHeader title="Assignment" backHref="/assignments" />
      </div>
      <div className="p-4 md:p-6 pb-28">
        <CreateAssignmentForm />
      </div>
    </div>
  );
}
