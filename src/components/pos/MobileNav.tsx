import { Package, Receipt, User, FileText } from "lucide-react";

type Tab = "products" | "invoice" | "customer" | "receipt";

interface Props {
  active: Tab;
  onChange: (t: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "products", label: "Products", icon: Package },
  { id: "invoice", label: "Invoice", icon: Receipt },
  { id: "customer", label: "Customer", icon: User },
  { id: "receipt", label: "Receipt", icon: FileText },
];

export default function MobileNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pos-glass border-t border-border md:hidden">
      <div className="flex">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
              active === t.id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <t.icon className="w-5 h-5" />
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
