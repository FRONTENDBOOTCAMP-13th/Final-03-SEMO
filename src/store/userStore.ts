import { create } from "zustand";

interface UserInfo {
  email: string;
  password: string;
  university: string;
  department: string;
  studentId: string;
  dormitory: string;
  nickname: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setUniversity: (university: string) => void;
  setDepartment: (department: string) => void;
  setStudentId: (studentId: string) => void;
  setDormitory: (dormitory: string) => void;
  setNickname: (nickname: string) => void;
  reset: () => void;
}

export const useUserStore = create<UserInfo>((set) => ({
  email: "",
  password: "",
  university: "",
  department: "",
  studentId: "",
  dormitory: "",
  nickname: "",
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setUniversity: (university) => set({ university }),
  setDepartment: (department) => set({ department }),
  setStudentId: (studentId) => set({ studentId }),
  setDormitory: (dormitory) => set({ dormitory }),
  setNickname: (nickname) => set({ nickname }),
  reset: () =>
    set({
      email: "",
      password: "",
      university: "",
      department: "",
      studentId: "",
      dormitory: "",
      nickname: "",
    }),
}));

if (process.env.NODE_ENV === "development") {
  useUserStore.subscribe((state) => {
    console.log("Zustand 상태:", state);
  });
}
