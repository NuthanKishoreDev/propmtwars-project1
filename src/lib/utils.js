export const getStatusColor = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('soon')) return 'status-use-soon';
  if (s.includes('fresh')) return 'status-fresh';
  return 'status-check-date';
};
