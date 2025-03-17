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
import { useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/generalHooks/use-mobile";
import { Course, Term } from "@/types/mainTypes";

export function NavMain({ data }: {data: any}) {

  let { term: selectedTerm, course: selectedCourse } = useParams()
  selectedTerm = selectedTerm?.replace('-', ' ')
  const selectedTermData = data.find((t: Term) => t.term.toLowerCase() === selectedTerm?.toLowerCase());
  selectedCourse = selectedCourse?.replace('-', ' ')

  const { open, setOpenMobile, openMobile } = useSidebar()
  const isMobile = useIsMobile()

  return (
    <SidebarGroup className="">
      <SidebarGroupLabel className="text-md mb-3">Terms</SidebarGroupLabel>
      {(isMobile || open) && 
      <SidebarMenu className="">
        {data.slice().reverse().map((term: Term) => (
          <Collapsible
            key={term.term}
            asChild
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {!term.isCompleted &&
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={term.term}>
                  <Link className="truncate text-md w-full" to={`/home/${term.term.replace(/\s+/g, '-')}`} onClick={() => setOpenMobile(!openMobile)}>
                    {term.term}
                  </Link>
                  {term.isCompleted && <p className="text-xs text-muted-foreground">completed</p>}
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>}
              {term.isCompleted &&
                <SidebarMenuButton tooltip={term.term}>
                  <Link className="truncate text-md w-full" to={`/home/${term.term.replace(/\s+/g, '-')}`} onClick={() => setOpenMobile(!openMobile)}>
                    {term.term}
                  </Link>
                  {term.isCompleted && <p className="text-xs text-muted-foreground">completed</p>}
                </SidebarMenuButton>}
              <CollapsibleContent>
                <SidebarMenuSub>
                  {!term.isCompleted && (term.courses.length > 0) && term.courses?.map((course: Course) => (
                    <SidebarMenuSubItem key={course.courseTitle}>
                      <SidebarMenuSubButton asChild>
                        <Link className="text-sm w-full" to={`/home/${term.term.replace(/\s+/g, '-')}/${course.courseTitle.replace(/\s+/g, '-')}`} onClick={() => setOpenMobile(!openMobile)}>
                          <span>{course.courseTitle}</span>
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
        <Link to={`/home/${selectedTermData.term.replace(' ', '-')}`} className="flex mb-6 flex-row items-center justify-center text-xl text-muted-foreground">
          <h1>{selectedTermData.term.split('')[0]}</h1>
          <h1>{selectedTermData.term.split(' ')[1].slice(-2)}</h1>
        </Link>
      }
      <div className="w-full flex flex-col-reverse justify-center items-center gap-4">
        {!open && !isMobile && selectedCourse && selectedTermData.courses.map((course: Course) => {
          if (course.courseTitle === selectedCourse) {
            let hoverColour ='black'
            if (course.colour === 'black') {
              hoverColour = 'black'
            } else {
              hoverColour = `${course.colour}-500`
            }
            return (
              <Link key={course.courseTitle} to={`/home/${selectedTerm?.replace(/\s+/g, '-')}/${course.courseTitle.replace(/\s+/g, '-')}`}>
                <Button variant='outline' className={`w-12 h-12 rounded-xl text-sm border border-slate-300 bg-${hoverColour} hover:bg-${hoverColour} hover:text-gray-200 text-white flex flex-col gap-0`}>
                  <h1>{course.courseTitle.split(' ')[0]}</h1>
                  <h1>{course.courseTitle.split(' ')[1]}</h1>
                </Button>
              </Link>
            )
          } else {
            return (
              <Link key={course.courseTitle} to={`/home/${selectedTerm?.replace(/\s+/g, '-')}/${course.courseTitle.replace(/\s+/g, '-')}`}>
                <Button variant='outline' className="w-12 h-12 p-2 rounded-xl text-sm border border-slate-300 flex flex-col gap-0">
                <h1 className="">{course.courseTitle.split(' ')[0]}</h1>
                <h1 className="">{course.courseTitle.split(' ')[1]}</h1>
                </Button>
              </Link>
            )
          }
        })}
      </div>
      <div className="w-full flex flex-col-reverse justify-center items-center gap-4">
        {!open && !isMobile && selectedTerm && !selectedCourse && data.map((term: Term) => {
          if (term.term === selectedTerm) {
            return (
              <Link key={term.term} to={`/home/${term.term.replace(/\s+/g, '-')}`}>
                <Button variant='outline' className={`w-12 h-12 rounded-xl text-sm border border-slate-300 bg-black hover:bg-gray-800 hover:text-white text-white flex flex-row gap-0`}>
                  <h1>{term.term.split('')[0]}</h1>
                  {term.term.split(' ').length > 1 && <h1>{term.term.split(' ')[1].slice(-2)}</h1>}
                </Button>
              </Link>
            )
          } else {
            return (
              <Link key={term.term} to={`/home/${term.term.replace(/\s+/g, '-')}`}>
                <Button variant='outline' className={`w-12 h-12 rounded-xl text-sm border border-slate-300 bg-black-500 flex flex-row gap-0`}>
                  <h1>{term.term.split('')[0]}</h1>
                  <h1>{term.term.split(' ')[1].slice(-2)}</h1>
                </Button>
              </Link>
            )
          }
        })}
      </div>
    
    </SidebarGroup>
  );
}
