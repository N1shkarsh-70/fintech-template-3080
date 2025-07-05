
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import AppFooter from '@/components/AppFooter';
import { Upload, FileText, Image, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useFileUpload } from '@/hooks/useFileUpload';

const Analysis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statementCount, setStatementCount] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { uploadFiles, uploadProgress, isUploading, clearProgress } = useFileUpload();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  };

  const handleFileChange = (index: number, file: File | null) => {
    const newFiles = [...files];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'text/csv',
        'image/jpeg',
        'image/jpg', 
        'image/png'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload only PDF, CSV, JPG, or PNG files');
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      newFiles[index] = file;
    } else {
      newFiles.splice(index, 1);
    }
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  const createAnalysisSession = async (sessionId: string, fileCount: number) => {
    const { error } = await supabase
      .from('analysis_sessions')
      .insert({
        user_id: user!.id,
        session_id: sessionId,
        file_count: fileCount,
        status: 'uploading'
      });

    if (error) {
      console.error('Failed to create analysis session:', error);
      throw new Error('Failed to create analysis session');
    }
  };

  const updateAnalysisSession = async (sessionId: string, updates: any) => {
    const { error } = await supabase
      .from('analysis_sessions')
      .update(updates)
      .eq('session_id', sessionId);

    if (error) {
      console.error('Failed to update analysis session:', error);
      throw new Error('Failed to update analysis session');
    }
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one bank statement');
      return;
    }

    if (!user) {
      toast.error('Please log in to continue');
      navigate('/login');
      return;
    }

    setIsAnalyzing(true);
    clearProgress();

    try {
      const sessionId = generateSessionId();
      console.log('Starting analysis with session ID:', sessionId);

      // Create analysis session in database
      await createAnalysisSession(sessionId, files.length);
      
      // Upload files to Supabase Storage
      toast.info('Uploading files...');
      const uploadedPaths = await uploadFiles(files, sessionId, user.id);
      
      console.log('Files uploaded successfully:', uploadedPaths);
      
      // Update session status to processing
      await updateAnalysisSession(sessionId, { 
        status: 'processing' 
      });

      toast.success('Files uploaded successfully! Processing...');
      
      // For now, simulate the ZIP creation process
      // In the next step, we'll create the Edge Function to handle this
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update session status to completed
      await updateAnalysisSession(sessionId, { 
        status: 'completed' 
      });
      
      toast.success('Analysis completed successfully!');
      
      // Navigate to results page
      navigate(`/analysis/results/${sessionId}`);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const FileUploadField = ({ index }: { index: number }) => (
    <div className="space-y-2">
      <Label htmlFor={`file-${index}`}>Bank Statement {index + 1}</Label>
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-pink-500/50 transition-colors relative">
        <input
          id={`file-${index}`}
          type="file"
          accept=".pdf,.csv,.jpg,.jpeg,.png"
          onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
          className="hidden"
        />
        <label
          htmlFor={`file-${index}`}
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className="w-8 h-8 text-muted-foreground" />
          <div className="text-sm">
            <span className="font-medium text-pink-500">Click to upload</span>
            <span className="text-muted-foreground"> or drag and drop</span>
          </div>
          <div className="text-xs text-muted-foreground">
            PDF, CSV, JPG, PNG up to 10MB
          </div>
        </label>
        {files[index] && (
          <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="flex-1 truncate">{files[index].name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                removeFile(index);
              }}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-pink-950/20 dark:via-background dark:to-blue-950/20">
      <Navigation />
      
      <main className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton />
          
          <div className="bg-background/80 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Financial
                <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                  {" "}Analysis
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Upload bank statements to trace fraudulent money movement
              </p>
            </div>

            <div className="space-y-8">
              {/* Statement Count */}
              <div className="space-y-2">
                <Label htmlFor="count">Number of Bank Statements</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="10"
                  value={statementCount}
                  onChange={(e) => setStatementCount(parseInt(e.target.value) || 1)}
                  className="h-12"
                  disabled={isUploading || isAnalyzing}
                />
              </div>

              {/* File Upload Fields */}
              <div className="space-y-6">
                {Array.from({ length: statementCount }, (_, index) => (
                  <FileUploadField key={index} index={index} />
                ))}
              </div>

              {/* Upload Progress */}
              {uploadProgress.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Upload Progress:</h3>
                  {uploadProgress.map((progress) => (
                    <div key={progress.fileName} className="flex items-center space-x-2 text-sm">
                      {progress.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin" />}
                      {progress.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {progress.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                      <span className="flex-1 truncate">{progress.fileName}</span>
                      <span>{progress.progress}%</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || isUploading || files.length === 0}
                className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white h-12"
              >
                {isAnalyzing || isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isUploading ? 'Uploading Files...' : 'Processing Analysis...'}
                  </>
                ) : (
                  'Start Analysis'
                )}
              </Button>

              {/* Supported Formats */}
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>PDF</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>CSV</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Image className="w-4 h-4" />
                  <span>Images</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default Analysis;
