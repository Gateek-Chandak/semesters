import { ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/general/use-mobile";
import { Course, Term } from "@/types/mainTypes";

import useData from "@/hooks/general/use-data";
import useParsedRouteParams from "@/hooks/general/use-parsed-route-params";

export function NavMain() {

  const { data, termData: selectedTermData } = useData();
  const { parsedTerm: selectedTerm, parsedCourse: selectedCourse } = useParsedRouteParams();


  const { open, setOpenMobile, openMobile } = useSidebar()
  const isMobile = useIsMobile()

  return (
    <SidebarGroup className="overflow-y-auto overflow-x-clip">
      <SidebarGroupLabel className="text-md mb-3">Terms</SidebarGroupLabel>
      {(isMobile || open) && 
      <SidebarMenu className="">
        {data.slice().reverse().map((term: Term) => (
          <Collapsible
            key={term.term_name}
            asChild
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {!term.is_completed &&
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={term.term_name}>
                  <Link className="truncate text-md w-full" to={`/home/${term.term_name.replace(/\s+/g, '-')}`} onClick={() => setOpenMobile(!openMobile)}>
                    {term.term_name}
                  </Link>
                  {term.is_completed && <p className="text-xs text-muted-foreground">completed</p>}
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>}
              {term.is_completed &&
                <SidebarMenuButton tooltip={term.term_name}>
                  <Link className="truncate text-md w-full" to={`/home/${term.term_name.replace(/\s+/g, '-')}`} onClick={() => setOpenMobile(!openMobile)}>
                    {term.term_name}
                  </Link>
                  {term.is_completed && <p className="text-xs text-muted-foreground">completed</p>}
                </SidebarMenuButton>}
              <CollapsibleContent>
                <SidebarMenuSub>
                  {!term.is_completed && (term.courses.length > 0) && term.courses?.map((course: Course) => (
                    <SidebarMenuSubItem key={course.course_title}>
                      <SidebarMenuSubButton asChild>
                        <Link className="text-sm w-full" to={`/home/${term.term_name.replace(/\s+/g, '-')}/${course.course_title.replace(/\s+/g, '-')}`} onClick={() => setOpenMobile(!openMobile)}>
                          <span>{course.course_title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                  {term.courses.length <= 0 && <h1 className="text-sm">no courses found</h1>}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>}
      {!open && !isMobile && selectedCourse && 
        <Link to={`/home/${selectedTermData!.term_name.replace(' ', '-')}`} className="flex mb-6 flex-row items-center justify-center text-xl text-muted-foreground">
          <h1>{selectedTermData!.term_name.split('')[0]}</h1>
          <h1>{selectedTermData!.term_name.split(' ')[1].slice(-2)}</h1>
        </Link>
      }
      <div className="w-full flex flex-col-reverse justify-center items-center gap-4">
        {!open && !isMobile && selectedCourse && selectedTermData!.courses.map((course: Course) => {
          if (course.course_title === selectedCourse) {
            return (
              <Link key={course.course_title} to={`/home/${selectedTerm?.replace(/\s+/g, '-')}/${course.course_title.replace(/\s+/g, '-')}`} className={`bg${course.colour} rounded-3xl`}>
                <Button variant='outline' className={`w-12 h-12 rounded-xl border border-slate-300 bg${course.colour} hover:bg-inherit text-white hover:text-white flex flex-col gap-0`}>
                  <h1>{course.course_title.split(' ')[0].slice(0, 4)}</h1>
                  <h1>{course.course_title.split(' ')[1]}</h1>
                </Button>
              </Link>
            )
          } else {
            return (
              <Link key={course.course_title} to={`/home/${selectedTerm?.replace(/\s+/g, '-')}/${course.course_title.replace(/\s+/g, '-')}`} className={`rounded-3xl`}>
                <Button variant='outline' className="w-12 h-12 p-2 rounded-xl !text-[14px] border border-slate-300 flex flex-col gap-0">
                  <h1>{course.course_title.split(' ')[0].slice(0, 4)}</h1>
                  <h1 className="">{course.course_title.split(' ')[1]}</h1>
                </Button>
              </Link>
            )
          }
        })}
      </div>
      <div className="w-full flex flex-col-reverse justify-center items-center gap-4">
        {!open && !isMobile && selectedTerm && !selectedCourse && data.map((term: Term) => {
          if (term.term_name === selectedTerm) {
            return (
              <Link key={term.term_name} to={`/home/${term.term_name.replace(/\s+/g, '-')}`}>
                <Button variant='outline' className={`w-12 h-12 rounded-xl text-sm border border-slate-300 bg-black hover:bg-gray-800 hover:text-white text-white flex flex-row gap-0`}>
                  <h1>{term.term_name.split('')[0]}</h1>
                  {term.term_name.split(' ').length > 1 && <h1>{term.term_name.split(' ')[1].slice(-2)}</h1>}
                </Button>
              </Link>
            )
          } else {
            return (
              <Link key={term.term_name} to={`/home/${term.term_name.replace(/\s+/g, '-')}`}>
                <Button variant='outline' className={`w-12 h-12 rounded-xl text-sm border border-slate-300 bg-black-500 flex flex-row gap-0`}>
                  <h1>{term.term_name.split('')[0]}</h1>
                  <h1>{term.term_name.split(' ')[1].slice(-2)}</h1>
                </Button>
              </Link>
            )
          }
        })}
      </div>
    
    </SidebarGroup>
  );
}
