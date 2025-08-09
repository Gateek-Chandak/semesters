import { useState, useCallback } from "react";
import { CreditCategory } from "@/types/degreePlanningTypes";
import { useToast } from "../general/use-toast";

const useDegreeRequirements = () => {
    // State for managing requirements
    const [degreeRequirements, setDegreeRequirements] = useState<CreditCategory[]>([]);
    const [editingRequirement, setEditingRequirement] = useState<CreditCategory | null>(null); // Requirement being edited
    const [deletingRequirement, setDeletingRequirement] = useState<CreditCategory | null>(null); // Requirement being deleted

    const [isAddingRequirement, setIsAddingRequirement] = useState(false);
    const [isEditingRequirement, setIsEditingRequirement] = useState(false);
    const [isDeletingRequirement, setIsDeletingRequirement] = useState(false);

    const { toast } = useToast();

    const validateRequirements = useCallback((requirement: CreditCategory) => {
        // Check for duplicate requirement names
        const duplicateName = degreeRequirements.some((r) => (r.id !== requirement.id) && (r.name.trim() === requirement.name.trim()));

        if (duplicateName) {
            return { 
                value: true, 
                reason: "Duplicate requirement names are not allowed" 
            }
        }

        // Check for empty requirement names
        if (requirement.name.trim() === "") {
            return { 
                value: true, 
                reason: "Requirement name cannot be empty" 
            }
        }

        // Check for valid credit values
        if (isNaN(requirement.requiredCredits)) {
            return { 
                value: true, 
                reason: "Required credits must be a valid number" 
            }
        }

        // Check for invalid credit values
        if (requirement.requiredCredits < 0) {
            return { 
                value: true, 
                reason: "Required credits must be greater than or equal to 0" 
            }
        }

        // All validations passed
        return { value: false, reason: "" };
    }, []);

    // Open edit dialog
    const initEditRequirement = useCallback((requirement: CreditCategory) => {
        setEditingRequirement(requirement);
        setIsEditingRequirement(true);
    }, []);

    const initDeleteRequirement = useCallback((requirement: CreditCategory) => {
        setDeletingRequirement(requirement);
        setIsDeletingRequirement(true);
    }, []);

    // Cancel edit
    const cancelEdit = useCallback(() => {
        setEditingRequirement(null);
        setIsEditingRequirement(false);
    }, []);

    // Add a new requirement
    const addRequirement = useCallback((name: string, requiredCredits: number): boolean => {
        const newRequirement: CreditCategory = {
            id: Date.now(), // Using timestamp for unique ID
            name: name.trim(),
            requiredCredits: parseFloat(requiredCredits.toFixed(2)),
            completedCredits: parseFloat((requiredCredits * Math.random()).toFixed(2)),
            coursesIds: []
        };

        const validation = validateRequirements(newRequirement);
        if (validation.value) {
            toast({
                variant: "destructive",
                title: "Invalid Requirement",
                description: validation.reason,
                duration: 3000
            });
            return false;
        }

        setDegreeRequirements(prev => [...prev, newRequirement]);
        setIsAddingRequirement(false);

        toast({
            variant: "success",
            title: "Requirement Added",
            description: `"${name}" has been added to your degree plan`,
            duration: 3000
        });

        return true;
    }, [toast, validateRequirements]);

    // Edit an existing requirement
    const editRequirement = useCallback((updatedRequirement: CreditCategory): boolean => {

        // short circuit if the requirement is the same
        const requirementToEdit = degreeRequirements.find(req => req.id === updatedRequirement.id);
        if (requirementToEdit?.name === updatedRequirement.name && requirementToEdit.requiredCredits === updatedRequirement.requiredCredits) {
            cancelEdit();
            return true;
        }

        // Check for duplicate requirement names
        const validation = validateRequirements(updatedRequirement);
        if (validation.value) {
            toast({
                variant: "destructive",
                title: "Invalid Requirement",
                description: validation.reason,
                duration: 3000
            });
            return false;
        }

        setDegreeRequirements(prev => 
            prev.map(req => 
                req.id === updatedRequirement.id ? updatedRequirement : req
            )
        );
        cancelEdit();

        toast({
            variant: "success",
            title: "Requirement Updated",
            description: `"${updatedRequirement.name}" has been updated`,
            duration: 3000
        });

        return true;
    }, [toast, cancelEdit, validateRequirements]);

    // Delete a requirement
    const deleteRequirement = useCallback((): boolean => {
        if (!deletingRequirement) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Requirement not found",
                duration: 3000
            });
            return false;
        }

        setDegreeRequirements(prev => prev.filter(req => req.id !== deletingRequirement.id));

        toast({
            variant: "success",
            title: "Requirement Deleted",
            description: `"${deletingRequirement.name}" has been removed from your degree plan`,
            duration: 3000
        });

        return true;
    }, [degreeRequirements, toast, deletingRequirement]);

    return {
        // State
        degreeRequirements,
        setDegreeRequirements,

        editingRequirement,
        deletingRequirement,

        isAddingRequirement,
        setIsAddingRequirement,
        isEditingRequirement,
        setIsEditingRequirement,
        isDeletingRequirement,
        setIsDeletingRequirement,

        // Actions
        addRequirement,
        editRequirement,
        deleteRequirement,
        initEditRequirement,
        initDeleteRequirement,
        cancelEdit,
    };
};

export default useDegreeRequirements;
