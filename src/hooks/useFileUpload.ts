
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export const useFileUpload = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async (files: File[], sessionId: string, userId: string): Promise<string[]> => {
    setIsUploading(true);
    const uploadedPaths: string[] = [];
    
    // Initialize progress tracking
    const initialProgress = files.map(file => ({
      fileName: file.name,
      progress: 0,
      status: 'uploading' as const
    }));
    setUploadProgress(initialProgress);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `${userId}/${sessionId}/${file.name}`;
        
        console.log(`Uploading file ${i + 1}/${files.length}: ${file.name}`);
        
        const { data, error } = await supabase.storage
          .from('user-uploads')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error('Upload error for', file.name, error);
          setUploadProgress(prev => prev.map(p => 
            p.fileName === file.name 
              ? { ...p, status: 'error', progress: 0 }
              : p
          ));
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }

        uploadedPaths.push(data.path);
        
        // Update progress
        setUploadProgress(prev => prev.map(p => 
          p.fileName === file.name 
            ? { ...p, status: 'completed', progress: 100 }
            : p
        ));
      }

      return uploadedPaths;
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error('File upload failed. Please try again.');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const clearProgress = () => {
    setUploadProgress([]);
  };

  return {
    uploadFiles,
    uploadProgress,
    isUploading,
    clearProgress
  };
};
