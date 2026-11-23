export type User = {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Owner' | 'Customer';
  status: 'Active' | 'Inactive';
};

export const initialUsers: User[] = [
  { id: 1, name: 'Ahmad Fauzan', email: 'fauzan@ngekost.id', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Siti Rahma', email: 'rahma@gmail.com', role: 'Admin', status: 'Active' },
  { id: 3, name: 'Budi Santoso', email: 'budi@gmail.com', role: 'Admin', status: 'Inactive' },
];