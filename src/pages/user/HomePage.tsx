// UI
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import { Trigger } from "@/components/sidebar/navTrigger";
import { Button } from "@/components/ui/button";
// Hooks
import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/hooks/general/use-mobile";
import { Link } from "react-router-dom";
import useParsedRouteParams from "@/hooks/general/use-parsed-route-params";
import useData from "@/hooks/general/use-data";
import { useState } from "react";
// Custom Components
import { AppSidebar } from "@/components/sidebar/AppSidebar"
import CompleteTermPopup from "@/components/term/popups/CompleteTermPopup";

const HomePage = ( ) => {
  const { termData } = useData();
  // Inits
  const isMobile = useIsMobile()
  // States
  //  conditionals
  const [isCompletingCourse, setIsCompletingCourse] = useState<boolean>(false)

  // Get Current Term and Course
  const { parsedTerm: term, parsedCourse: course } = useParsedRouteParams();

  return (
    <SidebarProvider>
      {/* Actual Sidebar */}
      <AppSidebar />
      <SidebarInset>
        {/* Sidebar Opener and Closer */}
        {isMobile && <Trigger />}
        {/* Breakcrumbs */}
        <header className="bg-[#f7f7f7] flex h-fit min-h-20 items-center gap-2 px-4 pt-8">
          <div className="w-full flex flex-row justify-between items-cente pr-6 pl-4">
            <div className="flex flex-row items-center gap-2">
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="block text-sm">
                    {!term && <BreadcrumbPage>Home</BreadcrumbPage>}
                    {term && <Link to="/home">Home</Link>}
                  </BreadcrumbItem>
                  {/* Breadcrumbs for term page */}
                  {term && (
                    <>
                      <BreadcrumbSeparator className="block" />
                      <BreadcrumbItem className="text-sm">
                        {!course && <BreadcrumbPage>{term}</BreadcrumbPage>}
                        {course && <Link to={`/home/${term}`} className="text-muted-foreground">
                          {term}
                        </Link>}
                      </BreadcrumbItem>
                    </>
                  )}
                  {/* Bread crumbs for course page */}
                  {term && course && (
                    <>
                      <BreadcrumbSeparator className="block" />
                      <BreadcrumbItem className="text-sm">
                        <BreadcrumbPage>{course}</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            {!course && termData && !termData.is_completed && <Button onClick={() => setIsCompletingCourse(true)} variant={'outline'} className="border-2 border-black !h-8 !text-xs sm:!h-10 md:!text-sm">Mark as Completed</Button>}
            {/* {!course && termData && termData.is_completed && <Button onClick={() => toggleCompleteTerm(false)} variant={'outline'} className="border-2 border-black !h-8 !text-xs sm:!h-10 md:!text-sm">Mark as Current Term</Button>} */}
          </div>
        </header>
        <Outlet/>
      </SidebarInset>
      {/* Popup when term is being completed */}
      <CompleteTermPopup visible={isCompletingCourse} setVisible={setIsCompletingCourse} />
    </SidebarProvider>
  );
}
 
export default HomePage;