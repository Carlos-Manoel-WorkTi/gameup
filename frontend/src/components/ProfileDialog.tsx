
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';

const AVATAR_OPTIONS = [
  'photo-1618160702438-9b02ab6515c9',
  'photo-1582562124811-c09040d0a901',
  'photo-1535268647677-300dbf3d78d1',
  'photo-1501286353178-1ec881214838',
];

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { user, setUser } = useUser();
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '');

  const handleSave = () => {
    if (nickname.trim()) {
      setUser({
        nickname: nickname.trim(),
        avatar: selectedAvatar || `https://images.unsplash.com/${AVATAR_OPTIONS[0]}`,
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            {user ? 'Editar Perfil' : 'Criar Perfil'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Selection */}
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-3">Escolha seu avatar</p>
            <div className="flex justify-center mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage 
                  src={selectedAvatar ? `https://images.unsplash.com/${selectedAvatar}` : undefined} 
                  alt={nickname} 
                />
                <AvatarFallback className="bg-purple-600 text-white text-2xl">
                  {nickname.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`p-1 rounded-lg transition-colors ${
                    selectedAvatar === avatar
                      ? 'ring-2 ring-purple-500 bg-purple-600/20'
                      : 'hover:bg-slate-700'
                  }`}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`https://images.unsplash.com/${avatar}`} />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                </button>
              ))}
            </div>
          </div>

          {/* Nickname Input */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Nickname</label>
            <Input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Digite seu nickname"
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              maxLength={20}
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={!nickname.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {user ? 'Salvar Alterações' : 'Criar Perfil'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
