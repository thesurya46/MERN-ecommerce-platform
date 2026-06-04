import { Avatar, AvatarFallback, AvatarImage } from '../app/components/ui/avatar';
import { User } from '../types';
import { getInitials } from '../utils/profilePhoto';
import { cn } from '../app/components/ui/utils';

interface UserAvatarProps {
  user: Pick<User, 'name' | 'avatar'>;
  className?: string;
  fallbackClassName?: string;
}

export default function UserAvatar({ user, className, fallbackClassName }: UserAvatarProps) {
  return (
    <Avatar className={cn('h-16 w-16', className)}>
      {user.avatar ? (
        <AvatarImage src={user.avatar} alt={user.name} />
      ) : null}
      <AvatarFallback className={cn('bg-primary/10 text-primary font-semibold text-lg', fallbackClassName)}>
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}
