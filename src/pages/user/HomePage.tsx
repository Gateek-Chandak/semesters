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
import { useLocation } from 'react-router-dom';
// Custom Components
import { AppSidebar } from "@/components/sidebar/AppSidebar"
import CompleteTermPopup from "@/components/term/popups/CompleteTermPopup";

const HomePage = ( ) => {
  const { termData } = useData();
  // Inits
  const isMobile = useIsMobile()
  const location = useLocation();
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
        {/* Breakcrumbs */}
        {/* {location.pathname != '/home/new-updates' && <div className="text-center w-full border-b border-muted-slate-300 py-1 pt-2 bg-sidebar">
          <Link to="/home/new-updates" className="flex flex-row items-center gap-2 w-full justify-center">
              <h1 className="text-sm text-black">
                  Click here to see <span className="hover:text-gray-500 transition-colors duration-200 cursor-pointer font-medium">what&apos;s new</span> with Semesters
              </h1>
              🔥
          </Link>
        </div>} */}
        {/* Sidebar Opener and Closer */}
        {isMobile && <Trigger />}
        <header className="bg-[#f7f7f7] flex h-fit min-h-20 items-center gap-2 px-5 pt-6">
          <div className="w-full flex flex-row justify-between items-cente pr-6 pl-4">
            <div className="flex flex-row items-center gap-2">
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="block text-sm">
                    {(term || location.pathname == '/home/new-updates' || location.pathname == '/home/degree-planner') ? <Link to="/home">Home</Link> : <BreadcrumbPage>Home</BreadcrumbPage>}
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
                  {/* Breadcrumbs for new updates page */}
                  {location.pathname == '/home/new-updates' && (
                    <>
                      <BreadcrumbSeparator className="block" />
                      <BreadcrumbItem className="text-sm">
                        <BreadcrumbPage>New Updates</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  )}
                  {location.pathname == '/home/degree-planner' && (
                    <>
                      <BreadcrumbSeparator className="block" />
                      <BreadcrumbItem className="text-sm">
                        <BreadcrumbPage>Degree Planner</BreadcrumbPage>
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