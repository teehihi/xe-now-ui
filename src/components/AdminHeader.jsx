import { useAuth } from '../context/AuthContext';

export default function AdminHeader({ title, subtitle }) {
  const { user } = useAuth();

  const displayName = user?.fullName || user?.name || user?.username || 'Unknown';
  const displayEmail = user?.email || '';
  const displayRole = user?.role || (user?.roles?.[0]) || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-[73px] bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{displayName}</p>
          <p className="text-xs text-gray-500">{displayEmail} {displayRole && `• ${displayRole}`}</p>
        </div>
        {user?.avatar ? (
          <img src={user.avatar} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#155DFC] to-[#1447E6] flex items-center justify-center text-white font-medium text-sm">
            {initial}
          </div>
        )}
      </div>
    </header>
  );
}
