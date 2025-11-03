export function formatDuration(duration: string): string {
  const [hours, minutes] = duration.split(':').map(Number);
  
  if (minutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${minutes}min`;
}
