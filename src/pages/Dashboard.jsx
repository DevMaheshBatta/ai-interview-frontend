import { useEffect, useState } from "react";
import API from "../api/api";
import ResumeCard from "../components/ResumeCard";
import Loading from "../components/Loading";

export default function Dashboard() {
  const [resumeScore, setResumeScore] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const resumeRes = await API.get("/resume-score");
        const interviewsRes = await API.get("/interview-history");

        setResumeScore(resumeRes.data.score);
        setInterviews(interviewsRes.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-6">
        <ResumeCard score={resumeScore} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Interview History</h2>
        {interviews.length === 0 ? (
          <p>No interviews yet.</p>
        ) : (
          <ul className="space-y-2">
            {interviews.map((item, idx) => (
              <li key={idx} className="p-3 border rounded">
                <p>Job: {item.job_title}</p>
                <p>Score: {item.score}</p>
                <p>Date: {new Date(item.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
