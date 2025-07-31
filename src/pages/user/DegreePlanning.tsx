import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';

const DegreePlanning = () => {

  const [activeTab, setActiveTab] = useState('requirements');


  return (
    <div className="w-full min-h-dvh h-fit px-5 lg:px-10 pt-7 bg-[#f7f7f7] flex flex-col justify-start items-center gap-8 overflow-visible">
        <div className="w-full flex flex-row items-center justify-center md:justify-start">
            <h1 className="text-3xl font-medium">Degree Planner</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full h-fit justify-around border rounded-3xl px-1 py-0.5">
              <TabsTrigger value="overview" className="py-2 w-full flex items-center rounded-full gap-2 !text-md">
                  <GraduationCap className="h-5 w-5" />
                  <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="requirements" className="py-3 w-full flex items-center rounded-full gap-2 !text-md">
                  <BookOpen className="h-5 w-5" />
                  <span>Requirements</span>
              </TabsTrigger>
              <TabsTrigger value="planning" className="py-3 w-full flex items-center rounded-full gap-2 !text-md">
                  <Calendar className="h-5 w-5" />
                  <span>Planning</span>
              </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
    
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No requirements yet</h3>
                <p className="text-gray-500 mb-4">Start by adding your course requirements</p>
                <Button onClick={() => {}}>
                Add Your First Requirement
                </Button>
            </div>
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No terms available</h3>
                <p className="text-gray-500">Create terms in your dashboard to start planning</p>
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
};

export default DegreePlanning;