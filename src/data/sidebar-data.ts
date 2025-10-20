import {
  LayoutDashboard,
  Key,
  Clock10,
  ClipboardPaste,
  PlaneLanding,
  FileBarChart2Icon,
  Bot,
} from "lucide-react";
import { type SidebarData } from "@/lib/types";

export const sidebarData: SidebarData = {
  user: {
    name: "User",
    email: "user@email.com",
    avatar: "",
  },
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Upload Model",
          url: "/upload-model",
          icon: Bot,
        },
        {
          title: "Upload Dataset",
          url: "/upload-dataset",
          icon: FileBarChart2Icon,
        },
        {
          title: "Copy & Paste",
          url: "/copy-paste",
          icon: ClipboardPaste,
        },
      ],
    },
    {
      title: "Manage Data",
      items: [
        {
          title: "Download Model",
          url: "/download-model",
          icon: PlaneLanding,
        },
        {
          title: "Decrypt File",
          url: "/decrypt",
          icon: Key,
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "View Activities",
          url: "/activities",
          icon: Clock10,
          // items: [
          //   {
          //     title: "View Activities",
          //     url: "/activities",
          //     icon: Clock10,
          //   }
          // ]
        },
      ],
    },
  ],
};
