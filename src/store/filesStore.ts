import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  uploadedAt: number;
}

interface FilesState {
  files: FileItem[];
  addFiles: (newFiles: FileItem[]) => void;
  updateFile: (id: string, updates: Partial<FileItem>) => void;
  removeFile: (id: string) => void;
}

export const useFilesStore = create<FilesState>()(
  persist(
    (set) => ({
      files: [
        {
          id: '1',
          name: 'System Architecture.pdf',
          size: 1024 * 1024 * 3.5,
          type: 'application/pdf',
          progress: 100,
          status: 'completed',
          uploadedAt: Date.now() - 86400000,
        },
      ],
      addFiles: (newFiles) => set((state) => ({ 
        files: [...newFiles, ...state.files] 
      })),
      updateFile: (id, updates) => set((state) => ({
        files: state.files.map((f) => f.id === id ? { ...f, ...updates } : f)
      })),
      removeFile: (id) => set((state) => ({
        files: state.files.filter((f) => f.id !== id)
      })),
    }),
    {
      name: 'amego-files-storage',
    }
  )
);
