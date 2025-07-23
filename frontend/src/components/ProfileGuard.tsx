
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { ProfileDialog } from './ProfileDialog';

interface ProfileGuardProps {
  children: React.ReactNode;
  onProfileRequired?: () => void;
}

export function ProfileGuard({ children, onProfileRequired }: ProfileGuardProps) {
  const { hasProfile } = useUser();
  const [showCreateProfile, setShowCreateProfile] = useState(false);

  if (!hasProfile) {
    if (onProfileRequired) {
      onProfileRequired();
    }
    return (
      <>
        {children}
        <ProfileDialog 
          open={showCreateProfile} 
          onOpenChange={setShowCreateProfile}
        />
      </>
    );
  }

  return <>{children}</>;
}
