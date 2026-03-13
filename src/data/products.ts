export interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
}

export const products: Product[] = [
  { id: "1", code: "ELC001", name: "Wireless Mouse", category: "Electronics", price: 29.99, stock: 45 },
  { id: "2", code: "ELC002", name: "USB-C Hub", category: "Electronics", price: 49.99, stock: 30 },
  { id: "3", code: "ELC003", name: "Mechanical Keyboard", category: "Electronics", price: 89.99, stock: 20 },
  { id: "4", code: "ELC004", name: "Webcam HD 1080p", category: "Electronics", price: 59.99, stock: 25 },
  { id: "5", code: "ELC005", name: "Bluetooth Speaker", category: "Electronics", price: 34.99, stock: 40 },
  { id: "6", code: "STN001", name: "Notebook A5", category: "Stationery", price: 4.99, stock: 200 },
  { id: "7", code: "STN002", name: "Gel Pen Pack (5)", category: "Stationery", price: 6.99, stock: 150 },
  { id: "8", code: "STN003", name: "Desk Organizer", category: "Stationery", price: 19.99, stock: 60 },
  { id: "9", code: "STN004", name: "Sticky Notes Bundle", category: "Stationery", price: 3.49, stock: 300 },
  { id: "10", code: "GRC001", name: "Organic Coffee 250g", category: "Groceries", price: 12.99, stock: 80 },
  { id: "11", code: "GRC002", name: "Green Tea Box", category: "Groceries", price: 8.49, stock: 100 },
  { id: "12", code: "GRC003", name: "Dark Chocolate Bar", category: "Groceries", price: 3.99, stock: 120 },
  { id: "13", code: "GRC004", name: "Almond Butter", category: "Groceries", price: 9.99, stock: 55 },
  { id: "14", code: "ACC001", name: "Phone Case", category: "Accessories", price: 14.99, stock: 90 },
  { id: "15", code: "ACC002", name: "Screen Protector", category: "Accessories", price: 7.99, stock: 200 },
  { id: "16", code: "ACC003", name: "Laptop Stand", category: "Accessories", price: 39.99, stock: 35 },
  { id: "17", code: "ACC004", name: "Cable Organizer", category: "Accessories", price: 11.99, stock: 70 },
  { id: "18", code: "ELC006", name: "Monitor Light Bar", category: "Electronics", price: 44.99, stock: 15 },
];

export const categories = ["All", "Electronics", "Stationery", "Groceries", "Accessories"];
