import { useTheme } from "../contexts/ThemeContext";

export default function TeamCard({ image, name, role, bio }) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === 'earthy';

  return (
    <div className={`card team-card ${isEarthy ? 'border-tan-200 hover:border-rust-400' : 'border-cool-grey hover:border-slate-blue'}`} style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}}>
      <img src={image} alt={name} className={`profile-image-fixed ${isEarthy ? 'border-cream-200' : 'border-cool-grey'}`} style={{borderColor: isEarthy ? undefined : 'var(--cool-grey)'}} />
      <h3 className={`text-xl font-semibold mb-2 ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'}`} style={{color: isEarthy ? undefined : 'var(--charcoal-grey)'}}>{name}</h3>
      <p className={`font-medium mb-3 ${isEarthy ? 'text-rust-500' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>{role}</p>
      <p className={`text-sm ${isEarthy ? 'text-brown-600' : 'text-slate-blue'}`} style={{color: isEarthy ? undefined : 'var(--slate-blue)'}}>{bio}</p>
    </div>
  );
}
