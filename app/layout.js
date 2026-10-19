import { Sarabun } from 'next/font/google';
import './globals.css';

const sarabun = Sarabun({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['thai', 'latin'],
  display: 'swap',
});

export const metadata = {
  title: '🌤️ ดวงฟ้าเปิด — เช็คดวงก่อนขึ้นดอย',
  description: 'แอพทำนายดวงนักเดินป่า เช็คว่าใครเป็นคนบาปที่ทำให้ฟ้าปิด ผสมโหราศาสตร์จริง + ข้อมูลอากาศจริง',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={sarabun.className}>
      <body>{children}</body>
    </html>
  );
}
