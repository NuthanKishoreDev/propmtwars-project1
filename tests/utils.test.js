import { describe, it, expect } from 'vitest';
import { getStatusColor } from '../src/lib/utils';

describe('getStatusColor', () => {
  it('should return status-use-soon for "soon"', () => {
    expect(getStatusColor('Use Soon')).toBe('status-use-soon');
  });

  it('should return status-fresh for "fresh"', () => {
    expect(getStatusColor('Freshly Picked')).toBe('status-fresh');
  });

  it('should return status-check-date for other statuses', () => {
    expect(getStatusColor('Expired')).toBe('status-check-date');
    expect(getStatusColor('')).toBe('status-check-date');
    expect(getStatusColor(null)).toBe('status-check-date');
  });
});
