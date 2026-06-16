// utils/stringHelpers.ts
export const extractRepNames = (fullName: string | undefined): { rep_last_name: string; rep_first_name: string } => {
  if (!fullName) return { rep_last_name: '', rep_first_name: '' };
  const parts = fullName.trim().split(' ');
  return {
    rep_last_name: parts[0] || '',
    rep_first_name: parts.slice(1).join(' ') || ''
  };
};