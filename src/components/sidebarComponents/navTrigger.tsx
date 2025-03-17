import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarSeparator
} from "@/components/ui/sidebar"

import { useIsMobile } from "@/hooks/generalHooks/use-mobile"

export function Trigger() {
  const isMobile = useIsMobile()
  const { openMobile } = useSidebar()

  return (
    <SidebarMenu className={`
              ${(isMobile && !openMobile) ? 'bg-[#f7f7f7] px-6 pt-4' : ''}
              ${(isMobile && openMobile) ? 'bg-[#f7f7f7]' : ''}`}>
      <SidebarMenuItem>
        <div className="flex flex-row justify-between w-full">
          <div className="w-full flex flex-row items-center pb-2">
            <SidebarTrigger className={`
                ${(isMobile && openMobile) ? 'pb-4' : ''} 
                ${(isMobile && !openMobile) ? 'relative' : ''} 
                ${(!isMobile) ? 'pb-4' : ''}
                px-6 pt-4 mr-auto`} />
          </div>
        </div>
        
        {isMobile && openMobile && <SidebarSeparator />}
        {!isMobile && <SidebarSeparator />}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
