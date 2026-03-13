import { useState } from "react";
import Navbar from "@/components/pos/Navbar";
import ProductPanel from "@/components/pos/ProductPanel";
import BillingPanel from "@/components/pos/BillingPanel";
import SalesDashboard from "@/components/pos/SalesDashboard";
import MobileNav from "@/components/pos/MobileNav";
import { motion } from "framer-motion";

type MobileTab = "products" | "invoice" | "customer" | "receipt";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileTab, setMobileTab] = useState<MobileTab>("products");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar searchQuery={searchQuery} onSearch={setSearchQuery} />

      {/* Sales Dashboard */}
      <SalesDashboard />

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-1 gap-4 px-4 pb-4 min-h-0">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-[3] pos-card overflow-hidden flex flex-col"
        >
          <ProductPanel searchQuery={searchQuery} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-[2] pos-card overflow-hidden flex flex-col"
        >
          <BillingPanel />
        </motion.div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex-1 pb-16">
        {mobileTab === "products" && (
          <div className="pos-card mx-4 overflow-hidden flex flex-col" style={{ height: "calc(100vh - 250px)" }}>
            <ProductPanel searchQuery={searchQuery} />
          </div>
        )}
        {(mobileTab === "invoice" || mobileTab === "customer" || mobileTab === "receipt") && (
          <div className="pos-card mx-4 overflow-hidden flex flex-col" style={{ height: "calc(100vh - 250px)" }}>
            <BillingPanel />
          </div>
        )}
      </div>

      <MobileNav active={mobileTab} onChange={setMobileTab} />
    </div>
  );
};

export default Index;
