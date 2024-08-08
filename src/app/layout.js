import { Inter } from "next/font/google";
import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Logan Duncan's Site",
  description: "A simple portfolio to show some of what I've done.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/profilePic.ico" sizes="any" />
      <script async src="../path/to/flowbite/dist/flowbite.min.js"></script>
      <body className="bg-[#98cfb2]">{children}</body>
    </html>
  );
}
