export default function FilterBar({ selectedTag, setSelectedTag }) {
  const tags = [
    "All",
    "AI",
    "Cybersecurity",
    "Web Development",
    "ML",
    "Blockchain",
    "GameDev",
  ];

  return (
    <div className="filter-bar">
      {tags.map((tag) => (
        <button
          key={tag}
          className={`tag-btn ${tag === selectedTag ? "active" : ""}`}
          onClick={() => setSelectedTag(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
