import React from 'react';
import { BookOpen, Compass, Bookmark, User } from 'lucide-react';

export type NavTab = 'stories' | 'explore' | 'saved' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  savedCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  savedCount = 0,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'stories',
      label: 'قصص',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'explore',
      label: 'استكشاف',
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: 'saved',
      label: 'محفوظات',
      icon: <Bookmark className="w-5 h-5" />,
      badge: savedCount > 0 ? savedCount : undefined,
    },
    {
      id: 'profile',
      label: 'حسابي',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 w-full z-40 bg-[#0e0e10]/90 backdrop-blur-2xl border-t border-red-950/40 shadow-[0_-8px_32px_rgba(0,0,0,0.9),0_0_24px_rgba(220,38,38,0.18)]"
    >
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center w-16 h-12 transition-all cursor-pointer ${
                isActive
                  ? 'text-red-400 font-semibold'
                  : 'text-[#ac8884] hover:text-white'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_8px_rgba(220,38,38,0.8)]">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 font-medium">{tab.label}</span>

              {/* Glowing active indicator dot */}
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#dc2626]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
