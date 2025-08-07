interface ProjectData {
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

interface Props {
  project: ProjectData;
  onDelete: (id: string) => void;
  onUpdate: (id: string) => void;
}

export default function ProjectRow({ project, onDelete, onUpdate }: Props) {
  const [owner, name] = project.repoPath.value.split("/");

  return (
    <tr>
      <td>{owner}</td>
      <td>
        <a href={project.url.value} target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      </td>
      <td>{project.stats.stars}</td>
      <td>{project.stats.forks}</td>
      <td>{project.stats.issues}</td>
      <td>{new Date(project.createdAt * 1000).toUTCString()}</td>
      <td>
        <button type="button" onClick={() => onUpdate(project.id)}>
          Update
        </button>
        <button type="button" onClick={() => onDelete(project.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}
