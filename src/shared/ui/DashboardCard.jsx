import { Link } from 'react-router-dom';
import { FaCalendarCheck, FaRegCalendarAlt, FaMap, FaTv, FaFistRaised } from 'react-icons/fa';
import { GiToken } from 'react-icons/gi';

// Importation dynamique du pattern
const rewardsPattern = new URL('../../assets/img/rewards_pattern2.png', import.meta.url).href;

const iconMap = {
  'daily': FaCalendarCheck,
  'monthly': FaRegCalendarAlt,
  'player-map': FaMap,
  'tv-tools': FaTv,
  'farming': GiToken,
  'fighting': FaFistRaised,
};

export function DashboardCard({ title, description, path, icon, backgroundImage }) {
  const pathEnd = path.split('/').pop();
  const IconComponent = iconMap[pathEnd];
  const isVestiary = pathEnd === 'vestiary';

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
      {/* Background Image avec opacité ajustée */}
      {backgroundImage && (
        <div 
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat ${isVestiary ? 'opacity-30' : 'opacity-20'}`}
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
      <div className="relative flex h-full z-10">
        <div className="flex flex-col justify-end">
          {/* Titre et Description */}
          <div className="flex items-end gap-4">
            {IconComponent && !isVestiary && (
              <div className="flex items-center">
                <IconComponent className="text-4xl text-zinc-500" />
              </div>
            )}
            <div>
              <h2 className="text-[#FFD32A] font-extrabold text-3xl tracking-wide mb-1">
                {title}
              </h2>
              <p className="text-gray-300 text-sm font-light">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 