export type Transaction = {
  id: number;
  invoice: string;
  tenantName: string;
  boardingHouse: string;
  room: string;
  amount: number;
  status: 'Success' | 'Pending' | 'Cancelled';
  date: string;
};

export const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;