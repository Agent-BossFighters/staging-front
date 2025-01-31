import { XPProgress as Progress } from '@ui/progress';
import { XP_DATA } from './xp-data';

export function XPProgressBar({ className }) {
  return (
    <div className={className}>
      <Progress {...XP_DATA} />
    </div>
  );
} 