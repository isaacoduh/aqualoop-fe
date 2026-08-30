"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Power } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Card, ConfirmDialog, StatusBadge } from "@/components/ui";
import { adminSettingsRepository } from "@/data";
import type { PlatformSettings } from "@/domain/types";
import { AdminLoading, AdminPageHeading, adminSecondaryClassName, titleCase } from "@/features/admin-accounts";

const nav=["general","customer","admins","rollover","registration","notifications","security","plans","businesses","operators","withdrawals"];
export function SettingsNav(){return <nav aria-label="Settings sections" className="mt-5 flex gap-2 overflow-x-auto pb-1">{nav.map(item=><Link key={item} href={`/admin/settings/${item}`} className="shrink-0 rounded-pill border border-border-strong bg-surface px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary">{titleCase(item)}</Link>)}</nav>}
export function SettingsHeader({title,description}:{title:string;description:string}){return <><AdminPageHeading eyebrow="Admin settings" title={title} description={description}/><SettingsNav/></>}
export function useAdminSettings(){return useQuery({queryKey:["admin-settings"],queryFn:()=>adminSettingsRepository.overview()})}
export function SettingsLoading(){return <AdminLoading count={3}/>}
export function SettingsMutationMessage({mutation}:{mutation:{isError:boolean;isSuccess:boolean;error:Error|null}}){return <>{mutation.isError?<p role="alert" className="mt-4 text-sm font-semibold text-danger">{mutation.error?.message}</p>:null}{mutation.isSuccess?<p role="status" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-success"><Check className="size-4"/>Settings saved.</p>:null}</>}

export function SettingToggle({setting,label,description,destructiveWhenOff=false,destructiveWhenOn=false}:{setting:keyof PlatformSettings;label:string;description:string;destructiveWhenOff?:boolean;destructiveWhenOn?:boolean}){const client=useQueryClient();const query=useAdminSettings();const [confirmValue,setConfirmValue]=useState<boolean|null>(null);const mutation=useMutation({mutationFn:(enabled:boolean)=>adminSettingsRepository.update({[setting]:enabled}),onSuccess:()=>{setConfirmValue(null);client.invalidateQueries({queryKey:["admin-settings"]})}});if(query.isLoading)return <Card className="h-28 animate-pulse bg-surface-muted"/>;const enabled=Boolean(query.data?.settings[setting]);function change(){const next=!enabled;if((enabled&&destructiveWhenOff)||(!enabled&&destructiveWhenOn)){setConfirmValue(next);return}mutation.mutate(next)}return <Card className="p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="font-semibold">{label}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></div><StatusBadge tone={enabled?"success":"danger"}>{enabled?"Enabled":"Disabled"}</StatusBadge></div><button type="button" onClick={change} disabled={mutation.isPending} className={`${adminSecondaryClassName} mt-5 w-full`}><Power className="size-4"/>{enabled?"Disable":"Enable"}</button>{mutation.isError?<p role="alert" className="mt-3 text-sm text-danger">{mutation.error.message}</p>:null}<ConfirmDialog open={confirmValue!==null} onOpenChange={open=>!open&&setConfirmValue(null)} title={`${confirmValue?"Enable":"Disable"} ${label.toLowerCase()}?`} description="This changes a live platform capability and may affect active user workflows." confirmLabel={`${confirmValue?"Enable":"Disable"} setting`} tone="danger" pending={mutation.isPending} onConfirm={()=>confirmValue!==null&&mutation.mutate(confirmValue)}/></Card>}
