import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';
import AddRequirementPopup from '@/components/degree-planner/requirements/AddRequirementPopup';
import RequirementsTable from '@/components/degree-planner/requirements/RequirementsTable';
import EditRequirementPopup from '@/components/degree-planner/requirements/EditRequirementPopup';
import useDegreeRequirements from '@/hooks/degree-planner/use-degree-requirements';
import ConfirmDeletePopup from '@/components/shared/ConfirmDeletePopup';

const DegreePlanning = () => {

  const [activeTab, setActiveTab] = useState('summary');
  
  // Get hook values and functions needed for prop drilling
  const {
    degreeRequirements,
    editingRequirement,
    deletingRequirement,

    isAddingRequirement,
    setIsAddingRequirement,
    isEditingRequirement,
    setIsEditingRequirement,
    isDeletingRequirement,
    setIsDeletingRequirement,

    addRequirement,
    editRequirement,
    deleteRequirement,

    initEditRequirement,
    initDeleteRequirement,
    cancelEdit,
  } = useDegreeRequirements();

  return (
    <div className="w-full min-h-dvh h-fit px-5 lg:px-10 pt-7 bg-[#f7f7f7] flex flex-col justify-start items-center gap-8 overflow-visible">
        <div className="w-full flex flex-row items-center justify-center md:justify-start">
            <h1 className="text-3xl font-medium">Degree Planner</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full h-fit justify-around border rounded-3xl p-1 mb-10">
              <TabsTrigger value="summary" className="py-2 w-full flex items-center rounded-full gap-2 !text-md">
                  <GraduationCap className="h-5 w-5" />
                  <span>Summary</span>
              </TabsTrigger>
              <TabsTrigger value="requirements" className="py-2 w-full flex items-center rounded-full gap-2 !text-md">
                  <BookOpen className="h-5 w-5" />
                  <span>Requirements</span>
              </TabsTrigger>
              <TabsTrigger value="planning" className="py-2 w-full flex items-center rounded-full gap-2 !text-md">
                  <Calendar className="h-5 w-5" />
                  <span>Planning</span>
              </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Summary Available</h3>
                  <p className="text-gray-500">Coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            {degreeRequirements.length === 0 
              ? <div className="text-center flex flex-col justify-center items-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No requirements yet</h3>
                  <p className="text-gray-500 mb-5">Start by adding your degree requirements</p>
                  <AddRequirementPopup 
                    isAddingRequirement={isAddingRequirement}
                    setIsAddingRequirement={setIsAddingRequirement}
                    addRequirement={addRequirement}
                  />
              </div>
              : <div className="custom-card px-8 py-6 gap-4 flex flex-col justify-center">
                  <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Credit Requirements</h2>
                      <AddRequirementPopup 
                        isAddingRequirement={isAddingRequirement}
                        setIsAddingRequirement={setIsAddingRequirement}
                        addRequirement={addRequirement}
                      />
                  </div>
                  <RequirementsTable 
                    degreeRequirements={degreeRequirements}
                    initEditRequirement={initEditRequirement}
                    initDeleteRequirement={initDeleteRequirement}
                  />
              </div>
            }
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No terms available</h3>
                <p className="text-gray-500">Create terms in your dashboard to start planning</p>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Global edit popup */}
        <EditRequirementPopup 
          editingRequirement={editingRequirement}
          isEditingRequirement={isEditingRequirement}
          setIsEditingRequirement={setIsEditingRequirement}
          editRequirement={editRequirement}
          cancelEdit={cancelEdit}
        />

        {/* Global delete popup */}
        <ConfirmDeletePopup 
          isDeleting={isDeletingRequirement}
          setIsDeleting={setIsDeletingRequirement}
          deleteItem={deleteRequirement}
          name={deletingRequirement?.name}
          itemObject={deletingRequirement}
        />
    </div>
  );
};

export default DegreePlanning;