import { useState, useCallback } from 'react';
import JSZip from 'jszip';

export interface ExtractedFile {
  name: string;
  type: 'summary' | 'raw_transactions' | 'persons_of_interest' | 'poi';
  data: ArrayBuffer;
  originalFileName?: string;
  beneficiaryName?: string;
}

interface UseZipFileExtractionReturn {
  extractedFiles: ExtractedFile[];
  isExtracting: boolean;
  error: string | null;
  extractFilesFromZip: (zipUrl: string) => Promise<void>;
  downloadFile: (file: ExtractedFile) => void;
  clearFiles: () => void;
}

export const useZipFileExtraction = (): UseZipFileExtractionReturn => {
  const [extractedFiles, setExtractedFiles] = useState<ExtractedFile[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const determineFileType = (fileName: string): { type: ExtractedFile['type']; originalFileName?: string; beneficiaryName?: string } => {
    if (fileName.startsWith('summary_') && fileName.endsWith('.xlsx')) {
      return { 
        type: 'summary', 
        originalFileName: fileName.replace('summary_', '').replace('.xlsx', '') 
      };
    }
    
    if (fileName.startsWith('raw_transactions_') && fileName.endsWith('.xlsx')) {
      return { 
        type: 'raw_transactions', 
        originalFileName: fileName.replace('raw_transactions_', '').replace('.xlsx', '') 
      };
    }
    
    if (fileName === 'persons_of_interest.xlsx') {
      return { type: 'persons_of_interest' };
    }
    
    if (fileName.startsWith('POI_') && fileName.endsWith('.xlsx')) {
      return { 
        type: 'poi', 
        beneficiaryName: fileName.replace('POI_', '').replace('.xlsx', '') 
      };
    }
    
    // Default to raw_transactions for unrecognized files
    return { type: 'raw_transactions' };
  };

  const extractFilesFromZip = useCallback(async (zipUrl: string) => {
    setIsExtracting(true);
    setError(null);
    setExtractedFiles([]);

    try {
      console.log('Fetching ZIP from URL:', zipUrl);
      
      const response = await fetch(zipUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch ZIP file: ${response.statusText}`);
      }

      const zipArrayBuffer = await response.arrayBuffer();
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(zipArrayBuffer);

      const files: ExtractedFile[] = [];

      for (const [fileName, file] of Object.entries(zipContent.files)) {
        if (!file.dir && fileName.endsWith('.xlsx')) {
          console.log('Processing file:', fileName);
          
          const fileData = await file.async('arraybuffer');
          const { type, originalFileName, beneficiaryName } = determineFileType(fileName);
          
          files.push({
            name: fileName,
            type,
            data: fileData,
            originalFileName,
            beneficiaryName
          });
        }
      }

      console.log('Extracted files:', files.map(f => ({ name: f.name, type: f.type })));
      setExtractedFiles(files);
    } catch (err) {
      console.error('Failed to extract ZIP files:', err);
      setError(err instanceof Error ? err.message : 'Failed to extract files from ZIP');
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const downloadFile = useCallback((file: ExtractedFile) => {
    const blob = new Blob([file.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }, []);

  const clearFiles = useCallback(() => {
    setExtractedFiles([]);
    setError(null);
  }, []);

  return {
    extractedFiles,
    isExtracting,
    error,
    extractFilesFromZip,
    downloadFile,
    clearFiles
  };
};