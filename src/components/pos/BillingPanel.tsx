import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, Undo2, ShoppingBag, Receipt, Tag, CreditCard } from "lucide-react";
import { usePOSStore, calcTotals } from "@/store/pos-store";
import { toast } from "sonner";
import ReceiptModal from "./ReceiptModal";
import CustomerForm from "./CustomerForm";

export default function BillingPanel() {
  const {
    invoiceItems,
    discountPercent,
    promoCode,
    removedItems,
    updateQuantity,
    removeItem,
    undoRemove,
    setDiscount,
    setPromoCode,
  } = usePOSStore();

  const [showReceipt, setShowReceipt] = useState(false);
  const totals = calcTotals(invoiceItems, discountPercent);

  const handleRemove = (id: string, name: string) => {
    removeItem(id);
    toast("Item removed", {
      description: name,
      action: { label: "Undo", onClick: undoRemove },
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Receipt className="w-4 h-4 text-primary" />
          <h2 className="font-heading font-semibold text-foreground">Invoice</h2>
          {invoiceItems.length > 0 && (
            <span className="pos-badge-indigo">{invoiceItems.length}</span>
          )}
        </div>
        {removedItems.length > 0 && (
          <button onClick={undoRemove} className="flex items-center gap-1 text-xs text-primary hover:underline">
            <Undo2 className="w-3 h-3" /> Undo
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-auto scrollbar-thin p-4 space-y-2">
        <AnimatePresence mode="popLayout">
          {invoiceItems.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 text-muted-foreground"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <ShoppingBag className="w-12 h-12 mb-3 opacity-30" />
              </motion.div>
              <p className="text-sm">No items yet</p>
              <p className="text-xs mt-1">Add products from the inventory</p>
            </motion.div>
          ) : (
            invoiceItems.map((item) => (
              <motion.div
                key={item.product.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="pos-card p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{item.product.name}</p>
                    <p className="font-mono text-xs text-muted-foreground mt-0.5">
                      ${item.product.price.toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-mono font-semibold text-sm text-foreground shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-md bg-muted hover:bg-muted/70 flex items-center justify-center text-foreground transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-sm w-8 text-center text-foreground">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-md bg-muted hover:bg-muted/70 flex items-center justify-center text-foreground transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.product.id, item.product.name)}
                    className="w-7 h-7 rounded-md hover:bg-destructive/10 text-destructive flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Discount */}
      {invoiceItems.length > 0 && (
        <div className="px-4 pb-2 space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="pos-input w-full pl-8 text-xs"
              />
            </div>
            <div className="relative w-24">
              <input
                type="number"
                min={0}
                max={100}
                value={discountPercent || ""}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="0"
                className="pos-input w-full text-xs text-right pr-7 font-mono"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">%</span>
            </div>
          </div>
        </div>
      )}

      {/* Customer Form */}
      {invoiceItems.length > 0 && <CustomerForm />}

      {/* Totals */}
      {invoiceItems.length > 0 && (
        <div className="p-4 border-t border-border space-y-1.5">
          <Row label="Subtotal" value={totals.subtotal} />
          {totals.discount > 0 && <Row label={`Discount (${discountPercent}%)`} value={-totals.discount} accent />}
          <Row label="Tax (8%)" value={totals.tax} />
          <div className="border-t border-border pt-2 mt-2 flex justify-between">
            <span className="font-heading font-semibold text-foreground">Grand Total</span>
            <motion.span
              key={totals.grandTotal.toFixed(2)}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="font-mono font-bold text-lg text-primary"
            >
              ${totals.grandTotal.toFixed(2)}
            </motion.span>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowReceipt(true)}
            className="pos-btn-primary w-full mt-3 flex items-center justify-center gap-2 py-3"
          >
            <CreditCard className="w-4 h-4" />
            Checkout
          </motion.button>
        </div>
      )}

      <ReceiptModal open={showReceipt} onClose={() => setShowReceipt(false)} />
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <motion.span
        key={value.toFixed(2)}
        initial={{ y: 4, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`font-mono ${accent ? "text-secondary" : "text-foreground"}`}
      >
        {value < 0 ? "-" : ""}${Math.abs(value).toFixed(2)}
      </motion.span>
    </div>
  );
}
