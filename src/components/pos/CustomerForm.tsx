import { usePOSStore } from "@/store/pos-store";
import { User, Phone, Wallet } from "lucide-react";

export default function CustomerForm() {
  const { customer, setCustomer } = usePOSStore();
  const phoneValid = customer.phone === "" || /^\d{10}$/.test(customer.phone);

  return (
    <div className="px-4 pb-2 space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <User className="w-3 h-3" /> Customer
      </p>
      <input
        type="text"
        placeholder="Customer Name"
        value={customer.name}
        onChange={(e) => setCustomer({ name: e.target.value })}
        className="pos-input w-full text-xs"
      />
      <div>
        <div className="relative">
          <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="tel"
            placeholder="Phone (10 digits)"
            value={customer.phone}
            onChange={(e) => setCustomer({ phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
            className={`pos-input w-full pl-8 text-xs font-mono ${!phoneValid ? "ring-2 ring-destructive/30 border-destructive" : ""}`}
          />
        </div>
        {!phoneValid && <p className="text-[10px] text-destructive mt-1">Enter a valid 10-digit phone number</p>}
      </div>
      <div className="flex gap-1.5">
        {(["Cash", "Card", "UPI"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setCustomer({ paymentMethod: m })}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1 ${
              customer.paymentMethod === m
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
            }`}
          >
            <Wallet className="w-3 h-3" />
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}
