// Test file to debug import issues
import type { Report, Status, Role } from './types/index';

console.log('Report type imported successfully');

// This should work if the exports are correct
const testReport: Report = {
  id: 'test',
  description: 'test',
  status: Status.PENDING,
  submittedAt: new Date(),
  address: { region: 'test', city: 'test' },
  updatedAt: new Date(),
  category: { name: 'test' },
  authorityOffice: {
    officeName: 'test',
    address: { region: 'test', city: 'test' },
    iconUrl: 'test'
  },
  user: { name: 'test', id: 'test' }
};

export { testReport };
