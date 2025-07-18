
import { useState } from 'react';
import { User, Edit3, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUser } from '@/contexts/UserContext';
import { ProfileDialog } from './ProfileDialog';

export function UserMenu() {
  const { user, clearUser } = useUser();
  const [showProfile, setShowProfile] = useState(false);

  if (!user) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} alt={user.nickname} />
              <AvatarFallback className="bg-purple-600 text-white">
                {user.nickname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              <p className="font-medium text-white">{user.nickname}</p>
              <p className="text-xs text-slate-400">Jogador</p>
            </div>
          </div>
          <DropdownMenuSeparator className="bg-slate-700" />
          <DropdownMenuItem 
            onClick={() => setShowProfile(true)}
            className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Editar Perfil
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={clearUser}
            className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog 
        open={showProfile} 
        onOpenChange={setShowProfile}
      />
    </>
  );
}
