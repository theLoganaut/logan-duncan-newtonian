export const metadata = {
  title: "Eggcellent Choices!",
  description: "Stack up carton to carton!",
};

export default function RootLayout({ children }) {
  return (
    <>
      <script async src="../path/to/flowbite/dist/flowbite.min.js"></script>
      <div className="bg-teal-500">{children}</div>
    </>
  );
}
