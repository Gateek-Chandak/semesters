// UI
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import { Trigger } from "@/components/sidebarComponents/navTrigger";
// Hooks
import { Outlet, useParams } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast"
import { Link } from "react-router-dom";
import useSyncTermData from "@/hooks/use-sync-term-data";
// Redux
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
// Custom Components
import { AppSidebar } from "@/components/sidebarComponents/AppSidebar"
// Services
import { CalculationService } from "@/services/calculationService";
import { useEffect } from "react";

const HomePage = ( ) => {
  // Services
  const _calculationService = new CalculationService();
  // Inits
  const { toast } = useToast()
  const isMobile = useIsMobile()
  useSyncTermData();
  // Dont think this works
  const error = useSelector((state: RootState) => state.data.error)
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: error,
        description: "Sync failed, please reload the page before making any further changes",
        duration: 10000000
      });
    }
  }, [error])
  
  // Get Current Term and Course
  const { term: paramTerm, course: paramCourse } = useParams()
  const { parsedTerm: term, parsedCourse: course } = _calculationService.parseParams(paramTerm, paramCourse) 

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