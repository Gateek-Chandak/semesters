// This Slice handles and monitors all changes relating to degree requirements data

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CreditCategory } from '@/types/degreePlanningTypes';

// Type for Degree Requirements State
interface DegreeRequirementsState {
    requirements: CreditCategory[];
}

// Initial State for Degree Requirements
const initialState: DegreeRequirementsState = {
    requirements: [],
};

const degreeRequirementsSlice = createSlice({
    name: 'degreeRequirements',
    initialState,
    reducers: {
        // Set all requirements (for initial load or reset)
        setRequirements(state, action: PayloadAction<CreditCategory[]>) {
            state.requirements = action.payload;
        },

        // Add a new requirement
        addRequirement(state, action: PayloadAction<{ requirement: CreditCategory }>) {
            const { requirement } = action.payload;
            state.requirements.push(requirement);
        },

        // Update an existing requirement
        updateRequirement(state, action: PayloadAction<{ updatedRequirement: CreditCategory }>) {
            const { updatedRequirement } = action.payload;

            const requirementIndex = state.requirements.findIndex((r: CreditCategory) => r.id === updatedRequirement.id);
            if (requirementIndex !== -1) {
                state.requirements[requirementIndex] = updatedRequirement;
            }
        },

        // Delete a requirement
        deleteRequirement(state, action: PayloadAction<{ requirementId: number }>) {
            const { requirementId } = action.payload;
            state.requirements = state.requirements.filter((r: CreditCategory) => r.id !== requirementId);
        },
    }
});

export const {
    setRequirements,
    addRequirement,
    updateRequirement,
    deleteRequirement,
} = degreeRequirementsSlice.actions;

export default degreeRequirementsSlice.reducer;