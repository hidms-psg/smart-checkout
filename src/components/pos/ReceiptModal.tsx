import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, Download, Store } from "lucide-react";
import { usePOSStore, calcTotals } from "@/store/pos-store";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ReceiptModal({ open, onClose }: Props) {
  const { invoiceItems, discountPercent, customer, completeSale, clearInvoice } = usePOSStore();
  const totals = calcTotals(invoiceItems, discountPercent);

  const handleComplete = () => {
    completeSale();
    clearInvoice();
    onClose();
    toast.success("Sale completed successfully!");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 top-auto md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[420px] bg-card rounded-2xl border border-border shadow-2xl z-50 max-h-[85vh] overflow-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-heading font-semibold text-foreground">Receipt Preview</h3>
              <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              {/* Store */}
              <div className="text-center mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Store className="w-5 h-5 text-primary" />
                </div>
                <p className="font-heading font-bold text-foreground">SmartPOS Store</p>
                <p className="text-xs text-muted-foreground">123 Commerce St · (555) 123-4567</p>
                <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                  {new Date().toLocaleString()}
                </p>
              </div>

              {/* Customer */}
              {customer.name && (
                <div className="mb-4 text-xs text-muted-foreground">
                  <span className="text-foreground font-medium">{customer.name}</span>
                  {customer.phone && <span> · {customer.phone}</span>}
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-dashed border-border my-3" />

              {/* Items */}
              <div className="space-y-2 mb-4">
                {invoiceItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <div>
                      <span className="text-foreground">{item.product.name}</span>
                      <span className="text-muted-foreground ml-1">×{item.quantity}</span>
                    </div>
                    <span className="font-mono text-foreground">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-border my-3" />

              {/* Totals */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono">${totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-secondary">
                    <span>Discount</span>
                    <span className="font-mono">-${totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span className="font-mono">${totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground pt-2 border-t border-border text-base">
                  <span className="font-heading">Total</span>
                  <span className="font-mono text-primary">${totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-2 text-xs text-center text-muted-foreground">
                Payment: <span className="font-medium text-foreground">{customer.paymentMethod}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 border-t border-border flex gap-2">
              <button
                onClick={() => window.print()}
                className="pos-btn-ghost flex-1 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button
                onClick={() => toast.info("Receipt downloaded")}
                className="pos-btn-ghost flex-1 flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download
              </button>
              <button
                onClick={handleComplete}
                className="pos-btn-primary flex-1"
              >
                Complete
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
