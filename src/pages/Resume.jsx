import { useEffect, useState } from "react";
import api from "../api/axios";

function Resume() {
  const [resume, setResume] = useState(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get("/my-resumes");

        if (response.data.length > 0) {
          setResume(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    fetchResume();
  }, []);

  if (!resume) return <div>No Resume Found</div>;

  return (
    <div>
      <h2>My Resume</h2>
      <p><strong>File Name:</strong> {resume.file_name}</p>
      <p><strong>Uploaded At:</strong> {resume.created_at}</p>
      <h3>Preview:</h3>

      
      <p>
  {resume.resume_text
    ? resume.resume_text.substring(0, 300) + "..."
    : "No resume text available"}
</p>

    </div>
  );
}

export default Resume;
