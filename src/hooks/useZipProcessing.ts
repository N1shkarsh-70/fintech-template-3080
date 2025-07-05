
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ZipProcessingState {
  isCreatingZip: boolean;
  zipUrl: string | null;
  error: string | null;
}

export const useZipProcessing = () => {
  const [state, setState] = useState<ZipProcessingState>({
    isCreatingZip: false,
    zipUrl: null,
    error: null
  });

  const createZip = async (sessionId: string, userId: string): Promise<string | null> => {
    setState(prev => ({ ...prev, isCreatingZip: true, error: null }));
    
    try {
      console.log('Creating ZIP for session:', sessionId);
      
      const { data, error } = await supabase.functions.invoke('create-zip-archive', {
        body: {
          bucketName: 'user-uploads',
          folderPath: `${userId}/${sessionId}`,
          zipFileName: `${sessionId}.zip`
        }
      });

      if (error) {
        console.error('ZIP creation error:', error);
        throw new Error(error.message || 'Failed to create ZIP file');
      }

      if (!data || !data.downloadUrl) {
        throw new Error('No download URL received from ZIP creation');
      }

      console.log('ZIP created successfully:', data);
      
      setState(prev => ({ 
        ...prev, 
        isCreatingZip: false, 
        zipUrl: data.downloadUrl 
      }));

      return data.downloadUrl;
    } catch (error) {
      console.error('ZIP processing failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setState(prev => ({ 
        ...prev, 
        isCreatingZip: false, 
        error: errorMessage 
      }));

      toast.error(`Failed to create ZIP: ${errorMessage}`);
      return null;
    }
  };

  const clearState = () => {
    setState({
      isCreatingZip: false,
      zipUrl: null,
      error: null
    });
  };

  return {
    ...state,
    createZip,
    clearState
  };
};
