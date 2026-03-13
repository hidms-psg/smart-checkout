import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react";
import { usePOSStore } from "@/store/pos-store";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function SalesDashboard() {
  const { todaySales, todayTransactions, todayItemsSold } = usePOSStore();
  const revenue = todaySales;

  const cards = [
    { label: "Today's Sales", value: `$${revenue.toFixed(0)}`, icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
    { label: "Items Sold", value: todayItemsSold.toString(), icon: Package, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Transactions", value: todayTransactions.toString(), icon: ShoppingCart, color: "text-primary", bg: "bg-primary/10" },
    { label: "Avg. Order", value: todayTransactions > 0 ? `$${(revenue / todayTransactions).toFixed(0)}` : "$0", icon: TrendingUp, color: "text-secondary", bg: "bg-secondary/10" },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4"
    >
      {cards.map((c) => (
        <motion.div key={c.label} variants={item} className="pos-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{c.label}</span>
            <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
              <c.icon className={`w-4 h-4 ${c.color}`} />
            </div>
          </div>
          <motion.p
            key={c.value}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-mono text-xl font-bold text-foreground"
          >
            {c.value}
          </motion.p>
          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${c.color === "text-primary" ? "bg-primary" : "bg-secondary"}`}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
