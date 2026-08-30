"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, DatabaseBackup, LockKeyhole, RefreshCcw, Save } from "lucide-react";
import { useState } from "react";

import { Card, ConfirmDialog, FormField, formControlClassName } from "@/components/ui";
import { adminSettingsRepository } from "@/data";
import type { NotificationChannel, PlatformSettings } from "@/domain/types";
import { SubmitButton } from "@/features/auth/auth-controls";
import { SettingToggle, SettingsHeader, SettingsLoading, SettingsMutationMessage, useAdminSettings } from "@/features/admin-settings/settings-ui";

function useUpdateSettings(){const client=useQueryClient();return useMutation({mutationFn:(patch:Partial<PlatformSettings>)=>adminSettingsRepository.update(patch),onSuccess:()=>client.invalidateQueries({queryKey:["admin-settings"]})})}

function DemoResetCard(){
  const client=useQueryClient();
  const [open,setOpen]=useState(false);
  const mutation=useMutation({
    mutationFn:()=>adminSettingsRepository.resetDemo(),
    onSuccess:async()=>{
      setOpen(false);
      await client.resetQueries();
    },
  });

  return <Card className="p-6"><DatabaseBackup aria-hidden="true" className="size-6 text-danger"/><h2 className="mt-4 font-semibold">Reset demo data</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Restore every customer, operator, admin, order, stock, payment, code, and setting record to the original seeded state.</p><button type="button" onClick={()=>setOpen(true)} className="mt-5 min-h-control w-full rounded-control border border-danger px-4 text-sm font-semibold text-danger hover:bg-danger-soft">Reset all demo data</button>{mutation.isSuccess?<p role="status" className="mt-3 text-sm font-semibold text-success">Demo data restored.</p>:null}{mutation.isError?<p role="alert" className="mt-3 text-sm font-semibold text-danger">{mutation.error.message}</p>:null}<ConfirmDialog open={open} onOpenChange={setOpen} title="Reset all demo data?" description="This discards every change made during this browser session and restores the original AquaLoop demo records." confirmLabel="Reset demo data" pendingLabel="Restoring…" tone="danger" pending={mutation.isPending} onConfirm={()=>mutation.mutate()}/></Card>
}

export function GeneralSettingsScreen(){
  const query=useAdminSettings();
  const mutation=useUpdateSettings();
  if(query.isLoading)return <SettingsLoading/>;
  const s=query.data!.settings;
  function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const d=new FormData(e.currentTarget);
    mutation.mutate({platformName:String(d.get("platformName")??""),supportEmail:String(d.get("supportEmail")??"")});
  }
  return <div><SettingsHeader title="General settings" description="Platform identity, support contact, maintenance availability, and demo recovery."/><div className="mt-7 grid gap-5 lg:grid-cols-2"><form onSubmit={submit}><Card className="space-y-5 p-6"><FormField id="platform-name" label="Platform name" required>{p=><input {...p} name="platformName" defaultValue={s.platformName} className={formControlClassName}/>}</FormField><FormField id="support-email" label="Support email" required>{p=><input {...p} name="supportEmail" type="email" defaultValue={s.supportEmail} className={formControlClassName}/>}</FormField><SubmitButton pending={mutation.isPending}><Save className="size-4"/>Save general settings</SubmitButton><SettingsMutationMessage mutation={mutation}/></Card></form><SettingToggle setting="maintenanceMode" label="Maintenance mode" description="When enabled, the platform is considered unavailable for normal customer and operator activity." destructiveWhenOn/><DemoResetCard/></div></div>
}

export function CustomerSettingsScreen(){const query=useAdminSettings();const mutation=useUpdateSettings();if(query.isLoading)return <SettingsLoading/>;const s=query.data!.settings;function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const d=new FormData(e.currentTarget);mutation.mutate({maxCustomerAddresses:Number(d.get("maxCustomerAddresses")),maxOrderQuantity:Number(d.get("maxOrderQuantity")),cancellationWindowMinutes:Number(d.get("cancellationWindowMinutes"))});}return <div><SettingsHeader title="Customer settings" description="Set reusable address, order-size, cancellation, and review boundaries."/><div className="mt-7 grid gap-5 lg:grid-cols-2"><form onSubmit={submit}><Card className="space-y-5 p-6"><FormField id="max-addresses" label="Maximum saved addresses" required>{p=><input {...p} name="maxCustomerAddresses" type="number" min="1" defaultValue={s.maxCustomerAddresses} className={formControlClassName}/>}</FormField><FormField id="max-order-quantity" label="Maximum units per order" required>{p=><input {...p} name="maxOrderQuantity" type="number" min="1" defaultValue={s.maxOrderQuantity} className={formControlClassName}/>}</FormField><FormField id="cancel-window" label="Cancellation window in minutes" required>{p=><input {...p} name="cancellationWindowMinutes" type="number" min="1" defaultValue={s.cancellationWindowMinutes} className={formControlClassName}/>}</FormField><SubmitButton pending={mutation.isPending}>Save customer limits</SubmitButton><SettingsMutationMessage mutation={mutation}/></Card></form><SettingToggle setting="reviewsEnabled" label="Customer reviews" description="Allow customers to submit feedback after completed orders." destructiveWhenOff/></div></div>}

export function RolloverSettingsScreen(){const query=useAdminSettings();const mutation=useUpdateSettings();if(query.isLoading)return <SettingsLoading/>;const s=query.data!.settings;function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const d=new FormData(e.currentTarget);mutation.mutate({maxRolloverQuantity:Number(d.get("maxRolloverQuantity")),rolloverWindowDays:Number(d.get("rolloverWindowDays"))});}return <div><SettingsHeader title="Rollover settings" description="Control reusable-container rollover requests and their submission limits."/><div className="mt-7 grid gap-5 lg:grid-cols-2"><SettingToggle setting="rolloverEnabled" label="Rollover requests" description="Allow operators to request container allocation rollover." destructiveWhenOff/><form onSubmit={submit}><Card className="space-y-5 p-6"><RefreshCcw className="size-5 text-primary"/><FormField id="rollover-quantity" label="Maximum rollover quantity" required>{p=><input {...p} name="maxRolloverQuantity" type="number" min="1" defaultValue={s.maxRolloverQuantity} className={formControlClassName}/>}</FormField><FormField id="rollover-days" label="Rollover window in days" required>{p=><input {...p} name="rolloverWindowDays" type="number" min="1" defaultValue={s.rolloverWindowDays} className={formControlClassName}/>}</FormField><SubmitButton pending={mutation.isPending}>Save rollover limits</SubmitButton><SettingsMutationMessage mutation={mutation}/></Card></form></div></div>}

export function RegistrationSettingsScreen(){return <div><SettingsHeader title="Registration settings" description="Control customer and operator registration, plus approval requirements for new operator accounts."/><div className="mt-7 grid gap-5 lg:grid-cols-3"><SettingToggle setting="registrationEnabled" label="Customer registration" description="Allow new customer accounts to register." destructiveWhenOff/><SettingToggle setting="operatorRegistrationEnabled" label="Operator registration" description="Allow new water-business operators to register." destructiveWhenOff/><SettingToggle setting="operatorApprovalRequired" label="Operator approval" description="Require admin approval before an operator becomes active." destructiveWhenOff/></div></div>}

export function NotificationSettingsScreen(){
  const query=useAdminSettings();
  const mutation=useUpdateSettings();
  const [pendingChannel,setPendingChannel]=useState<NotificationChannel|null>(null);
  if(query.isLoading)return <SettingsLoading/>;
  const channels=query.data!.settings.notificationChannels;
  function toggle(channel:NotificationChannel){
    if(channels[channel]){setPendingChannel(channel);return;}
    mutation.mutate({notificationChannels:{...channels,[channel]:true}});
  }
  function disable(){
    if(!pendingChannel)return;
    mutation.mutate(
      {notificationChannels:{...channels,[pendingChannel]:false}},
      {onSuccess:()=>setPendingChannel(null)},
    );
  }
  return <div><SettingsHeader title="Notification settings" description="Choose which delivery channels administrators may use for platform communications."/><div className="mt-7 grid gap-4 sm:grid-cols-2">{(Object.keys(channels) as NotificationChannel[]).map(channel=><Card key={channel} className="p-5"><div className="flex justify-between gap-3"><div><Bell className="size-5 text-primary"/><h2 className="mt-3 font-semibold">{channel.replaceAll("_"," ")}</h2></div><span className={`text-sm font-semibold ${channels[channel]?"text-success":"text-danger"}`}>{channels[channel]?"Enabled":"Disabled"}</span></div><button onClick={()=>toggle(channel)} disabled={mutation.isPending} className="mt-5 min-h-control w-full rounded-control border border-border-strong text-sm font-semibold">{channels[channel]?"Disable channel":"Enable channel"}</button></Card>)}</div><SettingsMutationMessage mutation={mutation}/><ConfirmDialog open={pendingChannel!==null} onOpenChange={open=>!open&&setPendingChannel(null)} title="Disable notification channel?" description="Administrators will no longer be able to send platform messages through this channel." confirmLabel="Disable channel" tone="danger" pending={mutation.isPending} onConfirm={disable}/></div>
}

export function SecuritySettingsScreen(){const query=useAdminSettings();const mutation=useUpdateSettings();if(query.isLoading)return <SettingsLoading/>;const s=query.data!.settings;function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();const d=new FormData(e.currentTarget);mutation.mutate({maxFailedLoginAttempts:Number(d.get("maxFailedLoginAttempts")),accountLockoutMinutes:Number(d.get("accountLockoutMinutes")),minimumPasswordLength:Number(d.get("minimumPasswordLength")),confirmationCodeLifetimeMinutes:Number(d.get("confirmationCodeLifetimeMinutes"))});}return <div><SettingsHeader title="Security settings" description="Set login protection, password strength, administrator MFA, and handover-code lifetime."/><div className="mt-7 grid gap-5 lg:grid-cols-2"><form onSubmit={submit}><Card className="space-y-5 p-6"><LockKeyhole className="size-5 text-primary"/><div className="grid gap-5 sm:grid-cols-2"><FormField id="failed-logins" label="Maximum failed logins" required>{p=><input {...p} name="maxFailedLoginAttempts" type="number" min="1" defaultValue={s.maxFailedLoginAttempts} className={formControlClassName}/>}</FormField><FormField id="lockout" label="Lockout minutes" required>{p=><input {...p} name="accountLockoutMinutes" type="number" min="1" defaultValue={s.accountLockoutMinutes} className={formControlClassName}/>}</FormField><FormField id="password-length" label="Minimum password length" required>{p=><input {...p} name="minimumPasswordLength" type="number" min="10" defaultValue={s.minimumPasswordLength} className={formControlClassName}/>}</FormField><FormField id="code-life" label="Confirmation-code lifetime" description="Minutes" required>{p=><input {...p} name="confirmationCodeLifetimeMinutes" type="number" min="1" defaultValue={s.confirmationCodeLifetimeMinutes} className={formControlClassName}/>}</FormField></div><SubmitButton pending={mutation.isPending}>Save security policy</SubmitButton><SettingsMutationMessage mutation={mutation}/></Card></form><SettingToggle setting="adminMfaRequired" label="Admin MFA" description="Require multi-factor authentication for administrative access." destructiveWhenOff/></div></div>}
