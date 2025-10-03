import {
  LayoutDashboard,
  Key,
  FileUp,
  FilePenLine,
  FileDown,
  Clock10,
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
          title: "Upload File",
          url: "/upload-file",
          icon: FileUp,
        },
        {
          title: "Type It",
          url: "/type-file",
          icon: FilePenLine,
        },
      ],
    },
    {
      title: "Manage Data",
      items: [
        {
          title: "Get File",
          url: "/download-file",
          icon: FileDown,
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
