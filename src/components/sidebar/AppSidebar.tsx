import * as React from "react"
import { NavMain } from "./navMain"
import { NavUser } from "./navUser"
import { Trigger } from "./navTrigger"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator
} from "@/components/ui/sidebar"
import { HomeIcon } from "lucide-react"

import { Link } from "react-router-dom"
import { useSidebar } from "@/components/ui/sidebar"

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSelector((state: RootState) => state.auth.user);

  const displayUser = {
    
    name: user!.name,
    email: user!.email,
    picture: user!.picture,
  }

  const { open, openMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Trigger/>
      </SidebarHeader>
      <SidebarContent>
        <div className={(open || openMobile) 
                        ? "px-6 py-4 flex flex-row items-center gap-2 rounded-xl hover:bg-gray-100" 
                        : "ml-[0.4rem] mr-1 my-1 px-4 py-3 flex flex-row items-center gap-2 rounded-md hover:bg-gray-100"}>
          <Link to="/home">
            <HomeIcon className="!h-5 !w-5"/>
          </Link>
          {(open || openMobile) && <Link to="/home" className="w-full truncate relative text-sm">Home</Link>}
        </div>
        {(open || openMobile) && <SidebarSeparator />}
        <NavMain/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={displayUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}