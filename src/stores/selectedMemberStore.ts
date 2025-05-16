import { create } from "zustand";

type SelectedMember = {
  id: number;
  name: string;
  phoneNumber: string;
  totalPoint: number;
} | null;

interface SelectedMemberStore {
  selectedMember: SelectedMember;
  setSelectedMember: (member: SelectedMember) => void;
  clearSelectedMember: () => void;
  updateTotalPoint: (amount: number) => void;
}

export const useSelectedMemberStore = create<SelectedMemberStore>((set) => ({
  selectedMember: null,
  setSelectedMember: (member) => set({ selectedMember: member }),
  clearSelectedMember: () => set({ selectedMember: null }),
  updateTotalPoint: (amount) =>
    set((state) => {
      if (!state.selectedMember) return state;
      return {
        selectedMember: {
          ...state.selectedMember,
          totalPoint: state.selectedMember.totalPoint + amount,
        },
      };
    }),
}));
