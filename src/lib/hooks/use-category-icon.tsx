import {
  CarTaxiFront,
  Drama,
  Gift,
  GraduationCap,
  HandCoins,
  HeartPulse,
  HelpCircle,
  Home,
  LucideIcon,
  Plane,
  ReceiptText,
  ShoppingCart,
  Utensils,
} from "lucide-react";

export function useCategoryIcon() {
  const getCategoryIcon = (iconName: string): LucideIcon => {
    switch (iconName) {
      case "utensils":
        return Utensils;
      case "car-taxi-front":
        return CarTaxiFront;
      case "house":
        return Home;
      case "shopping-cart":
        return ShoppingCart;
      case "plane":
        return Plane;
      case "drama":
        return Drama;
      case "graduation-cap":
        return GraduationCap;
      case "heart-pulse":
        return HeartPulse;
      case "receipt-text":
        return ReceiptText;
      case "gift":
        return Gift;
      case "hand-coins":
        return HandCoins;
      default:
        return HelpCircle;
    }
  };

  return { getCategoryIcon };
}