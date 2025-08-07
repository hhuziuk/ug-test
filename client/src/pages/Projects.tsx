import React, { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";
import ProjectRow from "../components/ProjectRow";

interface Project {
  id: string;
  repoPath: { value: string };
  url: { value: string };
  stats: {
    stars: number;
    forks: number;
    issues: number;
  };
  createdAt: number;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newPath, setNewPath] = useState("");
  const { logout } = useContext(AuthContext);

  const fetchProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const add = async () => {
    const currentProjectCount = projects.length;
    await api.post("/projects", { repoPath: newPath });
    setNewPath("");

    const intervalId = setInterval(async () => {
      try {
        const res = await api.get("/projects");
        if (res.data.length > currentProjectCount) {
          setProjects(res.data);
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error("Error polling for projects:", error);
        clearInterval(intervalId);
      }
    }, 2000);

    setTimeout(() => {
      clearInterval(intervalId);
    }, 30000);
  };
  const remove = async (id: string) => {
    await api.delete(`/projects/${id}`);
    fetchProjects();
  };
  const update = async (id: string) => {
    await api.put(`/projects/${id}`);
    fetchProjects();
  };

  return (
    <div>
      <h2>Your Projects</h2>
      <button onClick={logout}>Logout</button>
      <div>
        <input
          value={newPath}
          onChange={(e) => setNewPath(e.target.value)}
          placeholder="owner/repo"
        />
        <button onClick={add}>Add</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Owner</th>
            <th>Name</th>
            <th>Stars</th>
            <th>Forks</th>
            <th>Issues</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <ProjectRow key={p.id} project={p} onDelete={remove} onUpdate={update} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
