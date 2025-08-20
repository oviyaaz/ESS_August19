import Header from "./Header";
import Footer from "./Footer";

const DashboardLayout = ({ children, sideBarLinks }) => {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Dashboard Content */}
      <main className="flex-grow p-6 bg-gray-50">
        {children}
      </main>

      {/* Common Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
