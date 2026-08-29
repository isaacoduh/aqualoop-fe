import {
  BadgeCheck,
  Ban,
  Bell,
  Boxes,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Gauge,
  HandCoins,
  House,
  Package,
  PackageCheck,
  PanelsTopLeft,
  QrCode,
  RefreshCcw,
  Settings,
  ShoppingBasket,
  Star,
  Store,
  Trash2,
  Truck,
  UserCog,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";

import type {
  ShellNavigationItem,
  ShellNavigationSection,
} from "@/components/layout";

export const customerPrimaryNavigation = [
  { href: "/app", label: "Home", icon: House, exact: true },
  { href: "/app/businesses", label: "Businesses", icon: Store },
  { href: "/app/orders", label: "Orders", icon: ClipboardList },
  { href: "/app/codes", label: "Codes", icon: QrCode },
  { href: "/app/profile", label: "Profile", icon: UserRound },
] satisfies readonly ShellNavigationItem[];

export const customerSecondaryNavigation = [
  { href: "/app/payments", label: "Payments", icon: CreditCard },
  { href: "/app/notifications", label: "Notifications", icon: Bell },
  { href: "/app/support", label: "Support", icon: CircleHelp },
] satisfies readonly ShellNavigationItem[];

export const operatorPrimaryNavigation = [
  { href: "/operator", label: "Dashboard", icon: Gauge, exact: true },
  { href: "/operator/orders", label: "Orders", icon: ClipboardList },
  { href: "/operator/redeem", label: "Redeem", icon: QrCode },
  { href: "/operator/stock", label: "Stock", icon: Package },
  { href: "/operator/profile", label: "Profile", icon: UserRound },
] satisfies readonly ShellNavigationItem[];

export const operatorSecondaryNavigation = [
  { href: "/operator/deliveries", label: "Deliveries", icon: Truck },
  { href: "/operator/earnings", label: "Earnings", icon: HandCoins },
  { href: "/operator/withdrawals", label: "Withdrawals", icon: WalletCards },
  { href: "/operator/reviews", label: "Reviews", icon: Star },
  { href: "/operator/plans", label: "Plans", icon: PanelsTopLeft },
  { href: "/operator/support", label: "Support", icon: CircleHelp },
] satisfies readonly ShellNavigationItem[];

export const adminNavigationSections = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: Gauge, exact: true },
    ],
  },
  {
    label: "Accounts",
    items: [
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/operators", label: "Operators", icon: UserCog },
      { href: "/admin/businesses", label: "Businesses", icon: Store },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        href: "/admin/orders/businesses",
        label: "Business orders",
        icon: ClipboardList,
      },
      {
        href: "/admin/orders/customers",
        label: "Customer orders",
        icon: ShoppingBasket,
      },
      {
        href: "/admin/requests/withdrawals",
        label: "Withdrawal requests",
        icon: HandCoins,
      },
      {
        href: "/admin/requests/rollovers",
        label: "Rollover requests",
        icon: RefreshCcw,
      },
      {
        href: "/admin/verification",
        label: "Verification",
        icon: BadgeCheck,
      },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/admin/products", label: "Products", icon: Boxes },
      { href: "/admin/plans", label: "Plans", icon: PackageCheck },
    ],
  },
  {
    label: "Platform",
    items: [
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/ratings", label: "Ratings", icon: Star },
      { href: "/admin/blocklist", label: "Blocklist", icon: Ban },
      { href: "/admin/system/cleanup", label: "Cleanup", icon: Trash2 },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/admin/settings/general", label: "General", icon: Settings },
    ],
  },
] satisfies readonly ShellNavigationSection[];
