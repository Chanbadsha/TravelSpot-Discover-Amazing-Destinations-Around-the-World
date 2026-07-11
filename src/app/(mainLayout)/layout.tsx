import Navbar from "@/src/Components/Navbar/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main className="pt-16 md:pt-20">{children}</main>
    </div>
  );
};

export default MainLayout;
