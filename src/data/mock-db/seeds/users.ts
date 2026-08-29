import type { User } from "@/domain/types";

export const users: User[] = [
  {
    id: "usr_001", role: "CUSTOMER", firstName: "Amina", lastName: "Bello",
    email: "amina.bello@example.test", phone: "+2348011110001",
    avatarUrl: "https://i.pravatar.cc/160?img=47", status: "ACTIVE",
    isEmailVerified: true, isPhoneVerified: true,
    createdAt: "2026-05-14T08:30:00Z", lastLoginAt: "2026-08-28T18:15:00Z"
  },
  {
    id: "usr_002", role: "CUSTOMER", firstName: "David", lastName: "Okafor",
    email: "david.okafor@example.test", phone: "+2348011110002",
    avatarUrl: "https://i.pravatar.cc/160?img=12", status: "ACTIVE",
    isEmailVerified: true, isPhoneVerified: true,
    createdAt: "2026-06-02T10:20:00Z", lastLoginAt: "2026-08-27T11:20:00Z"
  },
  {
    id: "usr_003", role: "CUSTOMER", firstName: "Temi", lastName: "Adeyemi",
    email: "temi.adeyemi@example.test", phone: "+2348011110003",
    avatarUrl: "https://i.pravatar.cc/160?img=32", status: "ACTIVE",
    isEmailVerified: true, isPhoneVerified: true,
    createdAt: "2026-06-19T14:00:00Z", lastLoginAt: "2026-08-29T07:45:00Z"
  },
  {
    id: "usr_101", role: "OPERATOR", firstName: "Kunle", lastName: "Adebayo",
    email: "kunle@bluespring.example.test", phone: "+2348022220101",
    avatarUrl: "https://i.pravatar.cc/160?img=5", status: "ACTIVE",
    isEmailVerified: true, isPhoneVerified: true,
    createdAt: "2026-03-10T09:00:00Z", lastLoginAt: "2026-08-29T09:30:00Z"
  },
  {
    id: "usr_102", role: "OPERATOR", firstName: "Ngozi", lastName: "Nwosu",
    email: "ngozi@puredrop.example.test", phone: "+2348022220102",
    avatarUrl: "https://i.pravatar.cc/160?img=44", status: "ACTIVE",
    isEmailVerified: true, isPhoneVerified: true,
    createdAt: "2026-03-12T09:00:00Z", lastLoginAt: "2026-08-28T16:50:00Z"
  },
  {
    id: "usr_103", role: "OPERATOR", firstName: "Ibrahim", lastName: "Musa",
    email: "ibrahim@oasis.example.test", phone: "+2348022220103",
    avatarUrl: "https://i.pravatar.cc/160?img=11", status: "ACTIVE",
    isEmailVerified: true, isPhoneVerified: true,
    createdAt: "2026-04-01T09:00:00Z", lastLoginAt: "2026-08-26T12:05:00Z"
  },
  {
    id: "usr_104", role: "OPERATOR", firstName: "Grace", lastName: "Ekanem",
    email: "grace@clearflow.example.test", phone: "+2348022220104",
    avatarUrl: "https://i.pravatar.cc/160?img=49", status: "PENDING",
    isEmailVerified: true, isPhoneVerified: true,
    createdAt: "2026-08-20T09:00:00Z"
  }
];
