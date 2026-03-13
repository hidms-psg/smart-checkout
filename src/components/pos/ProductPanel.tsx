import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ScanBarcode, Filter, ArrowUpDown } from "lucide-react";
import { products, categories, type Product } from "@/data/products";
import { usePOSStore } from "@/store/pos-store";
import { toast } from "sonner";

interface Props {
  searchQuery: string;
}

export default function ProductPanel({ searchQuery }: Props) {
  const [category, setCategory] = useState("All");
  const [sortAsc, setSortAsc] = useState(true);
  const [barcode, setBarcode] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const addItem = usePOSStore((s) => s.addItem);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = category === "All" || p.category === category;
      return matchSearch && matchCat;
    });
    list.sort((a, b) => (sortAsc ? a.price - b.price : b.price - a.price));
    return list;
  }, [searchQuery, category, sortAsc]);

  const handleBarcode = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && barcode.trim()) {
      const p = products.find((p) => p.code.toLowerCase() === barcode.toLowerCase());
      if (p) {
        addItem(p);
        toast.success(`${p.name} added to invoice`);
      } else {
        toast.error("Product not found");
      }
      setBarcode("");
    }
  };

  const getQty = (id: string) => quantities[id] || 1;
  const setQty = (id: string, v: number) =>
    setQuantities((q) => ({ ...q, [id]: Math.max(1, v) }));

  const handleAdd = (product: Product) => {
    addItem(product, getQty(product.id));
    toast.success(`${product.name} × ${getQty(product.id)} added`);
    setQuantities((q) => ({ ...q, [product.id]: 1 }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Barcode */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Scan barcode or type product code..."
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={handleBarcode}
            className="pos-input w-full pl-9 font-mono"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-border flex flex-wrap gap-2 items-center">
        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
        <div className="flex gap-1 flex-wrap flex-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                category === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowUpDown className="w-3 h-3" />
          Price {sortAsc ? "↑" : "↓"}
        </button>
      </div>

      {/* Product Table */}
      <div className="flex-1 overflow-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/50 backdrop-blur-sm">
            <tr className="text-left text-xs text-muted-foreground uppercase tracking-wider">
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium hidden lg:table-cell">Category</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium text-center hidden sm:table-cell">Stock</th>
              <th className="px-4 py-3 font-medium text-center">Qty</th>
              <th className="px-4 py-3 font-medium text-center">Add</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((p) => (
                <motion.tr
                  key={p.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="border-b border-border/50 hover:bg-surface-hover transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.code}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="pos-badge-teal">{p.category}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-foreground">
                    ${p.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center hidden sm:table-cell">
                    <span
                      className={`font-mono text-xs ${
                        p.stock < 20 ? "text-destructive" : "text-secondary"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setQty(p.id, getQty(p.id) - 1)}
                        className="w-6 h-6 rounded flex items-center justify-center bg-muted hover:bg-muted/70 text-foreground transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-sm w-6 text-center text-foreground">{getQty(p.id)}</span>
                      <button
                        onClick={() => setQty(p.id, getQty(p.id) + 1)}
                        className="w-6 h-6 rounded flex items-center justify-center bg-muted hover:bg-muted/70 text-foreground transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAdd(p)}
                      className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary flex items-center justify-center transition-all duration-200 mx-auto"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Search className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
