export default function ResourceCard({ type, title, description, color = "primary" }) {
  return (
    <div className="resource-card">
      <div className={`resource-image bg-${color}`}></div>
      <div className="resource-content">
        <div className="resource-badge">{type}</div>
        <h3 className="resource-title">{title}</h3>
        <p className="resource-description">{description}</p>
      </div>
    </div>
  );
}
