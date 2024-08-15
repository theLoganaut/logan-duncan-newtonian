import { Inter } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
 

const inter = Inter({ subsets: ["latin"] });

const metadata = {
  title: "Logan Duncan's Site",
  description: "A simple portfolio to show some of what I've done.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth overflow-x-hidden">
      <link rel="icon" href="/profilePic.ico" sizes="any" />
      {/* <script async src="../path/to/flowbite/dist/flowbite.min.js"></script> */}
      <body className="bg-[#98cfb2]">{children}</body>
    </html>
  );
}
