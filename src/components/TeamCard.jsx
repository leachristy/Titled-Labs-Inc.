export default function TeamCard({ image, name, role, bio }) {
  return (
    <div className="card team-card">
      <img src={image} alt={name} className="profile-image-fixed" />
      <h3 className="text-xl font-semibold text-brown-800 mb-2">{name}</h3>
      <p className="text-rust-500 font-medium mb-3">{role}</p>
      <p className="text-brown-600 text-sm">{bio}</p>
    </div>
  );
}
