import { create } from "zustand";

interface FindState {
  university: string;
  studentId: string;
  setUniversity: (univ: string) => void;
  setStudentId: (id: string) => void;
}

export const useFindStore = create<FindState>((set) => ({
  university: "",
  studentId: "",
  setUniversity: (univ) => set({ university: univ }),
  setStudentId: (id) => set({ studentId: id }),
}));
