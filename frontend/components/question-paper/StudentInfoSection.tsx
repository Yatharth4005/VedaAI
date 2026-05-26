export function StudentInfoSection({ cls }: { cls: string }) {
  return (
    <div className="space-y-3.5 my-6 font-bold text-[#111827] text-sm select-none">
      <div>
        Name: <span className="inline-block w-64 border-b-2 border-dotted border-gray-400 align-bottom ml-1" />
      </div>
      <div>
        Roll Number: <span className="inline-block w-48 border-b-2 border-dotted border-gray-400 align-bottom ml-1" />
      </div>
      <div>
        Class: {cls} &nbsp;&nbsp; Section: <span className="inline-block w-24 border-b-2 border-dotted border-gray-400 align-bottom ml-1" />
      </div>
    </div>
  );
}
