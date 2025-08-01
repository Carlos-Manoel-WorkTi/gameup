import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserMenu } from './UserMenu';
import { useUser } from '@/contexts/UserContext';

export function Navbar() {
  const navigate = useNavigate();
  const { hasProfile } = useUser();

  return (
    <nav className="bg-gradient-to-b from-black to-transparent backdrop-blur-sm border-b border-[rgb(33,38,45)] sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hover:bg-transparent"
        >
          GameUp
        </Button>

        <div className="flex items-center gap-4">
          {hasProfile ? (
            <UserMenu />
          ) : (
            <div className="text-sm text-slate-400">
              Crie seu perfil para jogar
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
