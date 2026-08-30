"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, CreditCard, PackageCheck, Truck } from "lucide-react";

import { EmptyState, NotificationRow } from "@/components/ui";
import { notificationRepository } from "@/data";
import { ActivityLoading, CUSTOMER_ID, PageHeading, formatDate } from "@/features/customer-activity";

const iconByType = { ORDER: PackageCheck, PAYMENT: CreditCard, DELIVERY: Truck, ACCOUNT: Bell, PROMOTION: Bell, SYSTEM: Bell } as const;
const hrefByType = { ORDER: "/app/orders", PAYMENT: "/app/payments", DELIVERY: "/app/orders", ACCOUNT: "/app/profile", PROMOTION: "/app/businesses", SYSTEM: "/app/support" } as const;

export function NotificationsScreen() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["customer-notifications", CUSTOMER_ID], queryFn: async () => (await notificationRepository.listForUser(CUSTOMER_ID)).sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
  const readMutation = useMutation({ mutationFn: (id: string) => notificationRepository.markRead(CUSTOMER_ID, id), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customer-notifications", CUSTOMER_ID] }) });
  const allMutation = useMutation({ mutationFn: () => notificationRepository.markAllRead(CUSTOMER_ID), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["customer-notifications", CUSTOMER_ID] }) });
  const unread = query.data?.filter((item) => !item.read).length ?? 0;
  return <div><PageHeading eyebrow="Updates" title="Notifications" description="Order, payment, delivery, and account updates in one place." action={<button type="button" onClick={() => allMutation.mutate()} disabled={unread === 0 || allMutation.isPending} className="inline-flex min-h-control items-center justify-center gap-2 rounded-control border border-border-strong px-4 py-2 text-sm font-semibold disabled:opacity-50"><CheckCheck className="size-4" /> Mark all read</button>} />
    {query.isLoading ? <ActivityLoading /> : query.data && query.data.length > 0 ? <div className="mt-7 overflow-hidden rounded-card border border-border shadow-card">{query.data.map((item) => <div key={item.id} onClick={() => !item.read && readMutation.mutate(item.id)}><NotificationRow title={item.title} body={item.body} timestamp={formatDate(item.createdAt, true)} dateTime={item.createdAt} href={hrefByType[item.type]} unread={!item.read} icon={iconByType[item.type]} tone={item.type === "DELIVERY" ? "info" : item.type === "PAYMENT" ? "success" : "neutral"} metadata={item.channel.replace("_", " ")} /></div>)}</div> : <EmptyState className="mt-7" icon={Bell} title="No notifications" description="Important customer updates will appear here." />}</div>;
}
