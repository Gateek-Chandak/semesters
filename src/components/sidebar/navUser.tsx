import {
    ChevronsUpDown,
    LogOut,
} from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
  
import { useDispatch } from "react-redux"
import { logout } from "@/redux/slices/authSlice"
import axios from "axios"

export function NavUser({
    user,
  }: {
    user: {
      name: string
      email: string
      picture: string
    }
  }) {
    const { isMobile, open, openMobile } = useSidebar()
    const dispatch = useDispatch()

    const handleLogout = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_SITE_URL}/api/auth/logout`, { withCredentials: true });
        dispatch(logout()); // Clear user from Redux
        window.location.href = '/'; // Redirect to landing page after logout
      } catch (error) {
        console.error('Error during logout', error);
      }
    };

    return (
      <SidebarMenu className="w-full pb-2">
        <SidebarMenuItem className="w-full flex flex-row justify-start">
          {(open || openMobile) && 
          <div className="w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="!h-10 !w-10 rounded-full">
                    <AvatarImage src={user.picture} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{user.name.slice(0, 1)}{user.name.split(' ').length > 1 && user.name.split(' ').at(-1)?.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-full">
                      <AvatarImage src={user.picture} alt={user.name} />
                      <AvatarFallback className="rounded-lg">{user.name.slice(0, 1)}{user.name.split(' ').length > 1 && user.name.split(' ').at(-1)?.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user.name}</span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>}
          {(!open && !openMobile) && 
            <div className="w-full flex flex-col items-center gap-5">
              <Avatar className="!h-8 !w-8 rounded-full">
                <AvatarImage className="" src={user.picture} alt={user.name} />
                <AvatarFallback className="rounded-lg border">{user.name.slice(0, 1)}{user.name.split(' ').length > 1 && user.name.split(' ').at(-1)?.slice(0, 1)}</AvatarFallback>
              </Avatar>
            </div>  
            
          }
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }