export type ReviewItem = {
  id: number;
  name: string;
  photo?: string;
  rating: number;
  content: string;
  date: string;
  isNew?: boolean; 
};

export const initialReviews: ReviewItem[] = [
  { id: 1, name: 'Rizky Aditya', rating: 5, date: '12 Oct 2026', content: 'Wi-Fi-nya kencang dan lingkungannya tenang, cocok buat kuliah online dan ngerjain tugas. Pemiliknya juga ramah dan responsif di WhatsApp.' },
  { id: 2, name: 'Nabila Safitri', rating: 5, date: '03 Oct 2026', content: 'Kamar bersih, kamar mandi dalam, dan air panasnya nyala terus. Dekat minimarket dan warung makan, jadi nggak repot kalau lapar tengah malam.' },
  { id: 3, name: 'Dimas Pratama', rating: 4, date: '21 Sep 2026', content: 'Overall bagus, harga masuk akal untuk fasilitasnya. Parkir motor agak penuh di jam sibuk, tapi tetap aman karena ada penjaga.' },
  { id: 4, name: 'Siti Rahmawati', rating: 5, date: '09 Sep 2026', content: 'Penjaga keamanannya siaga 24 jam dan ada CCTV, jadi tenang. Area jemuran dan dapur bersamanya juga terawat.' },
  { id: 5, name: 'Fajar Maulana', rating: 4, date: '28 Aug 2026', content: 'Jaraknya dekat kampus, naik motor cuma beberapa menit. Kamarnya luas, kasurnya nyaman. Semoga nanti ada tambahan mesin cuci.' },
  { id: 6, name: 'Ayu Lestari', rating: 5, date: '15 Aug 2026', content: 'Sudah tiga bulan tinggal di sini dan betah. Aturan jelas, jam malam dihormati, dan penghuninya saling menjaga kebersihan.' },
];