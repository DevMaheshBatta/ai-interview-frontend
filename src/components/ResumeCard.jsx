export default function ResumeCard({ score }) {
  return (
    <div className="p-4 border rounded shadow-md w-64">
      <h2 className="text-lg font-semibold mb-2">Resume Score</h2>
      <p className="text-3xl font-bold text-green-600">{score ?? "N/A"}</p>
    </div>
  );
}
