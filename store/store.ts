import { create } from "zustand";

interface AppState {
    DeleteModal: boolean;
    setDeleteModal: (open: boolean) => void;

    RenameModal: boolean;
    setRenameModal: (open: boolean) => void;

    fieldId: string | null;
    setFieldId: (fieldId: string) => void

    filename: string;
    setFilename: (filename: string) => void
}

export const useAppStore = create<AppState>()((set) =>({
    fieldId: null,
    setFieldId: (fieldId: string) => set((state) => ({fieldId})),

    filename: "",
    setFilename: (filename: string) => set((state) => ({filename})),

    RenameModal: false,
    setRenameModal: (open) => set((state) => ({RenameModal: open})),

    DeleteModal: false,
    setDeleteModal: (open) => set((state) => ({DeleteModal: open}))
}))