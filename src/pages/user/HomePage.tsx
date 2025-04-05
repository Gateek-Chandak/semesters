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
import { useDispatch } from "react-redux";
import useUser from "@/hooks/general/use-user";
import { useToast } from "@/hooks/general/use-toast";
// Redux
import { updateTerm } from "@/redux/slices/dataSlice";
// Custom Components
import { AppSidebar } from "@/components/sidebar/AppSidebar"
// Services
import { APIService } from "@/services/apiService";

const _apiService = new APIService();

const HomePage = ( ) => {
  const { toast } = useToast();
  const { user } = useUser();
  const { termData } = useData();
  const dispatch = useDispatch();
  // Inits
  const isMobile = useIsMobile()

  // Get Current Term and Course
  const { parsedTerm: term, parsedCourse: course } = useParsedRouteParams();
  
  const toggleCompleteTerm = async (is_completed: boolean) => {
    const updatedTerm = { ...termData!, is_completed }

    try {
      toast({
        variant: "default",
        title: "Updating...",
        duration: 3000
      })
      const response = await _apiService.updateTerm(user!.id, updatedTerm);
      toast({
        variant: "success",
        title: "Update Successful!",
        description: response.term_name + ' was updated',
        duration: 3000
      })
      dispatch(updateTerm({
        term_id: termData!.id,
        term: updatedTerm
      }))
    } catch {
      toast({
        variant: "destructive",
        title: "Update Unsuccessful",
        description: termData!.term_name + ' was unable to be updated.',
        duration: 3000
      })
    }
  }

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
            {!course && termData && !termData.is_completed && <Button onClick={() => toggleCompleteTerm(true)} variant={'outline'} className="border-2 border-black !h-8 !text-xs sm:!h-10 lg:!h-12 md:!text-sm">Mark as Completed</Button>}
            {!course && termData && termData.is_completed && <Button onClick={() => toggleCompleteTerm(false)} variant={'outline'} className="border-2 border-black !h-8 !text-xs sm:!h-10 lg:!h-12 md:!text-sm">Mark as Current Term</Button>}
          </div>
        </header>
        <Outlet/>
      </SidebarInset>
    </SidebarProvider>
  );
}
 
export default HomePage;