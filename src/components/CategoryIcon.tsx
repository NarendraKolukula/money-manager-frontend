import {
  Fuel,
  Film,
  UtensilsCrossed,
  Landmark,
  Stethoscope,
  ShoppingBag,
  Car,
  Zap,
  Gamepad2,
  GraduationCap,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Home,
  Coins,
  Receipt,
  HelpCircle,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Fuel,
  Film,
  UtensilsCrossed,
  Landmark,
  Stethoscope,
  ShoppingBag,
  Car,
  Zap,
  Gamepad2,
  GraduationCap,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
  Home,
  Coins,
  Receipt,
};

interface CategoryIconProps {
  iconName: string;
  className?: string;
}

export function CategoryIcon({ iconName, className = '' }: CategoryIconProps) {
  const IconComponent = iconMap[iconName] || HelpCircle;
  return <IconComponent className={className} />;
}
