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
// Hooks
import { Outlet } from "react-router-dom";
import { useIsMobile } from "@/hooks/general/use-mobile";
import { Link } from "react-router-dom";
import useParsedRouteParams from "@/hooks/general/use-parsed-route-params";
// Custom Components
import { AppSidebar } from "@/components/sidebar/AppSidebar"

const HomePage = ( ) => {
  // Inits
  const isMobile = useIsMobile()

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
        <header className="bg-[#f7f7f7] flex h-fit items-center gap-2 px-4 pt-8">
          <div className="flex items-center gap-2 px-4">
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
        </header>
        <Outlet/>
      </SidebarInset>
    </SidebarProvider>
  );
}
 
export default HomePage;