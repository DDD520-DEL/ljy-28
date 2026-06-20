import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, Plus, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isDetailPage = location.pathname.startsWith('/detail/') || location.pathname.startsWith('/record');
  if (isDetailPage) return null;

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/discover', label: '发现', icon: Compass },
    { path: '/record', label: '新建', icon: Plus, isAction: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-kraft-100 shadow-lg">
      <div className="container max-w-2xl">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.isAction) {
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="relative -mt-6"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-kraft-400 to-kraft-500 flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium text-kraft-500 whitespace-nowrap">
                    {item.label}
                  </span>
                </button>
              );
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-1 px-4 py-2 transition-all duration-200',
                    isActive
                      ? 'text-kraft-700'
                      : 'text-kraft-400 hover:text-kraft-600'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-transform duration-200',
                        isActive && 'scale-110'
                      )}
                    />
                    <span className="text-xs font-medium">{item.label}</span>
                    {isActive && (
                      <span className="absolute top-0 w-1 h-1 rounded-full bg-kraft-500" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
