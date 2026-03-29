import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  File, 
  Upload, 
  CheckCircle2, 
  Download, 
  Trash2,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useFilesStore, FileItem } from '../store/filesStore';

const FilesPage = () => {
  const { files, addFiles, updateFile, removeFile } = useFilesStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: FileItem[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'uploading',
      uploadedAt: Date.now(),
    }));

    addFiles(newFiles);

    // Simulate progress
    newFiles.forEach((file) => {
      let prog = 0;
      const interval = setInterval(() => {
        prog += Math.random() * 30;
        if (prog >= 100) {
          prog = 100;
          clearInterval(interval);
          updateFile(file.id, { progress: 100, status: 'completed' });
        } else {
          updateFile(file.id, { progress: Math.min(prog, 95) });
        }
      }, 500);
    });
  }, [addFiles, updateFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <ImageIcon className="h-6 w-6 text-pink-500" />;
    if (type.includes('video')) return <Video className="h-6 w-6 text-purple-500" />;
    if (type.includes('audio')) return <Music className="h-6 w-6 text-yellow-500" />;
    if (type.includes('pdf')) return <FileText className="h-6 w-6 text-red-500" />;
    return <File className="h-6 w-6 text-blue-500" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cloud Storage</h1>
          <p className="text-muted-foreground">Manage and store your assets securely</p>
        </div>
        <div className="flex border border-border rounded-xl p-1 bg-muted/30">
          <button className="p-2 rounded-lg bg-background shadow-sm text-foreground transition-all">
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-all">
            <ListIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div 
        {...getRootProps()} 
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden",
          isDragActive 
            ? "border-primary bg-primary/5 scale-[0.99]" 
            : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
        <input {...getInputProps()} />
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 ring-8 ring-primary/5 animate-pulse">
          <Upload className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Drop it like it's hot</h3>
        <p className="text-muted-foreground text-lg mb-8 max-w-sm text-center">Drag and drop your files here, or click to browse from your computer.</p>
        <div className="flex gap-4 text-xs font-medium text-muted-foreground">
          <span className="px-3 py-1.5 bg-muted rounded-full">Max size: 50MB</span>
          <span className="px-3 py-1.5 bg-muted rounded-full">PDF, ZIP, IMAGES</span>
          <span className="px-3 py-1.5 bg-muted rounded-full">Encrypted</span>
        </div>
      </div>

      {/* File List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
            Recent Activities
            <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{files.length}</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {files.map((file) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-card border border-border/50 hover:border-primary/30 rounded-2xl p-4 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center border border-border/30 group-hover:scale-110 transition-transform text-foreground">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{file.name}</h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">{formatSize(file.size)}</p>
                  </div>
                  <button 
                    onClick={() => removeFile(file.id)}
                    className="p-1 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-500 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4">
                  {file.status === 'uploading' ? (
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                        <span>Uploading...</span>
                        <span>{Math.round(file.progress)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary" 
                          initial={{ width: 0 }}
                          animate={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 py-1 px-2.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                        </div>
                        <div className="flex gap-1">
                            <button className="p-2 hover:bg-muted rounded-xl transition-all text-muted-foreground hover:text-foreground">
                                <Download className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FilesPage;
