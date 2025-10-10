import { useTheme } from "../../contexts/ThemeContext";

export default function DetailedFeatureThemed({ 
  badge, 
  title, 
  description, 
  linkText,
  onNavigate, 
  children,
  reverse = false 
}) {
  const { currentTheme } = useTheme();
  const isEarthy = currentTheme === 'earthy';

  return (
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center mb-20`}>
      <div className="flex-1">
        <div className={`inline-block px-3 py-1 ${isEarthy ? 'bg-rust-100 text-rust-600' : 'bg-pale-lavender text-slate-blue'} text-xs font-semibold tracking-wider rounded-full mb-4`}>
          {badge}
        </div>
        <h3 className={`text-3xl font-bold ${isEarthy ? 'text-brown-800' : 'text-charcoal-grey'} mb-4`}>{title}</h3>
        <p className={`text-lg ${isEarthy ? 'text-brown-600' : 'text-slate-blue'} mb-6 leading-relaxed`}>{description}</p>
        <button 
          onClick={onNavigate} 
          className={`${isEarthy ? 'text-rust-500 hover:text-rust-600' : 'text-slate-blue hover:text-charcoal-grey'} font-semibold inline-flex items-center gap-2 group`}
        >
          {linkText}
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}