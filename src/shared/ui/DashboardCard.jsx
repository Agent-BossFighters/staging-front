import { Link } from 'react-router-dom';

// Importation dynamique du pattern
const rewardsPattern = new URL('../../assets/img/rewards_pattern2.png', import.meta.url).href;

export function DashboardCard({ title, description, path, icon, backgroundImage, children }) {
  return (
    <Link
      to={path}
      className={`
        relative block p-6 rounded-2xl
        bg-[#1A1B1E] hover:bg-gradient-to-br
        hover:from-yellow-500/10 hover:to-yellow-900/10
        border border-gray-800/50
        transition-all duration-300
        hover:scale-[1.02] hover:border-gray-700/50
        group h-full
        overflow-hidden
      `}
    >
      {children}

      {/* Background Image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Pattern Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url(${rewardsPattern})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Content */}
      <div className="relative flex flex-col h-full justify-between z-10">
        <div className="flex items-center gap-3 mb-6">
          {icon && (
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={icon} alt="" className="w-8 h-8 object-contain" />
            </div>
          )}
          <h2 className="text-[#FFD32A] font-bold text-2xl tracking-wide">
            {title}
          </h2>
        </div>
        <p className="text-[#FFD32A]/70 text-sm font-medium tracking-wide uppercase">
          {description}
        </p>
      </div>
    </Link>
  );
} 