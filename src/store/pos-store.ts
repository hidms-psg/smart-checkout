import { create } from "zustand";
import type { Product } from "@/data/products";

export interface InvoiceItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  paymentMethod: "Cash" | "Card" | "UPI";
}

interface POSState {
  invoiceItems: InvoiceItem[];
  customer: CustomerInfo;
  discountPercent: number;
  promoCode: string;
  removedItems: InvoiceItem[];
  todaySales: number;
  todayTransactions: number;
  todayItemsSold: number;

  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  undoRemove: () => void;
  updateQuantity: (productId: string, qty: number) => void;
  setDiscount: (d: number) => void;
  setPromoCode: (code: string) => void;
  setCustomer: (c: Partial<CustomerInfo>) => void;
  clearInvoice: () => void;
  completeSale: () => void;
}

const TAX_RATE = 0.08;

export const usePOSStore = create<POSState>((set, get) => ({
  invoiceItems: [],
  customer: { name: "", phone: "", paymentMethod: "Cash" },
  discountPercent: 0,
  promoCode: "",
  removedItems: [],
  todaySales: 1247.5,
  todayTransactions: 23,
  todayItemsSold: 67,

  addItem: (product, qty = 1) =>
    set((s) => {
      const existing = s.invoiceItems.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          invoiceItems: s.invoiceItems.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
          ),
        };
      }
      return { invoiceItems: [...s.invoiceItems, { product, quantity: qty }] };
    }),

  removeItem: (productId) =>
    set((s) => {
      const item = s.invoiceItems.find((i) => i.product.id === productId);
      return {
        invoiceItems: s.invoiceItems.filter((i) => i.product.id !== productId),
        removedItems: item ? [item, ...s.removedItems.slice(0, 4)] : s.removedItems,
      };
    }),

  undoRemove: () =>
    set((s) => {
      const [last, ...rest] = s.removedItems;
      if (!last) return s;
      const existing = s.invoiceItems.find((i) => i.product.id === last.product.id);
      if (existing) {
        return {
          invoiceItems: s.invoiceItems.map((i) =>
            i.product.id === last.product.id ? { ...i, quantity: i.quantity + last.quantity } : i
          ),
          removedItems: rest,
        };
      }
      return { invoiceItems: [...s.invoiceItems, last], removedItems: rest };
    }),

  updateQuantity: (productId, qty) =>
    set((s) => ({
      invoiceItems:
        qty <= 0
          ? s.invoiceItems.filter((i) => i.product.id !== productId)
          : s.invoiceItems.map((i) =>
              i.product.id === productId ? { ...i, quantity: qty } : i
            ),
    })),

  setDiscount: (d) => set({ discountPercent: Math.min(100, Math.max(0, d)) }),
  setPromoCode: (code) => {
    set({ promoCode: code });
    if (code.toUpperCase() === "SAVE10") set({ discountPercent: 10 });
    if (code.toUpperCase() === "SAVE20") set({ discountPercent: 20 });
  },
  setCustomer: (c) => set((s) => ({ customer: { ...s.customer, ...c } })),
  clearInvoice: () =>
    set({ invoiceItems: [], customer: { name: "", phone: "", paymentMethod: "Cash" }, discountPercent: 0, promoCode: "", removedItems: [] }),
  completeSale: () => {
    const s = get();
    const subtotal = s.invoiceItems.reduce((a, i) => a + i.product.price * i.quantity, 0);
    const totalItems = s.invoiceItems.reduce((a, i) => a + i.quantity, 0);
    const discount = subtotal * (s.discountPercent / 100);
    const tax = (subtotal - discount) * TAX_RATE;
    const grand = subtotal - discount + tax;
    set({
      todaySales: s.todaySales + grand,
      todayTransactions: s.todayTransactions + 1,
      todayItemsSold: s.todayItemsSold + totalItems,
    });
  },
}));

export const TAX_RATE_VALUE = TAX_RATE;

export function calcTotals(items: InvoiceItem[], discountPercent: number) {
  const subtotal = items.reduce((a, i) => a + i.product.price * i.quantity, 0);
  const discount = subtotal * (discountPercent / 100);
  const taxable = subtotal - discount;
  const tax = taxable * TAX_RATE;
  const grandTotal = taxable + tax;
  return { subtotal, discount, tax, grandTotal };
}
