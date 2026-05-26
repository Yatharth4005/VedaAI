export function StudentInfoSection({ cls }: { cls: string }) {
  return (
    <div className="space-y-2 my-4">
      <div className="flex flex-wrap gap-8">
        <span className="text-sm">
          Name:{" "}
          <span className="inline-block w-48 border-b border-gray-400 align-bottom" />
        </span>
        <span className="text-sm">
          Roll Number:{" "}
          <span className="inline-block w-32 border-b border-gray-400 align-bottom" />
        </span>
      </div>
      <div className="text-sm">
        Class: {cls} &nbsp;&nbsp; Section:
        <span className="inline-block w-20 border-b border-gray-400 ml-1 align-bottom" />
      </div>
    </div>
  );
}
