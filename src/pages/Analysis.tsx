import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import AppFooter from '@/components/AppFooter';
import SessionRecovery from '@/components/SessionRecovery';
import { Upload, FileText, Image, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useZipProcessing } from '@/hooks/useZipProcessing';

const Analysis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statementCount, setStatementCount] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'zip' | 'process' | 'complete'>('upload');
  
  const { uploadFiles, uploadProgress, isUploading, clearProgress } = useFileUpload();
  const { createZip, isCreatingZip, zipUrl, error: zipError, clearState: clearZipState } = useZipProcessing();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  };

  const validateFile = (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'text/csv',
      'image/jpeg',
      'image/jpg', 
      'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error(`${file.name}: Please upload only PDF, CSV, JPG, or PNG files`);
      return false;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error(`${file.name}: File size must be less than 10MB`);
      return false;
    }

    return true;
  };

  const handleMultipleFileSelection = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    const newFiles = Array.from(selectedFiles).filter(validateFile);
    
    if (newFiles.length > 0) {
      // Update statement count if user selected more files than expected
      if (newFiles.length > statementCount) {
        setStatementCount(newFiles.length);
      }
      
      setFiles(newFiles);
      toast.success(`${newFiles.length} file(s) selected successfully`);
    }
  };

  const handleFileChange = (index: number, file: File | null) => {
    const newFiles = [...files];
    if (file) {
      if (!validateFile(file)) return;
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
    clearZipState();

    try {
      const sessionId = generateSessionId();
      console.log('Starting analysis with session ID:', sessionId);

      // Create analysis session in database
      await createAnalysisSession(sessionId, files.length);
      setCurrentStep('upload');
      
      // Step 1: Upload files to Supabase Storage
      toast.info('Uploading files...');
      const uploadedPaths = await uploadFiles(files, sessionId, user.id);
      console.log('Files uploaded successfully:', uploadedPaths);
      
      // Update session status to processing
      await updateAnalysisSession(sessionId, { 
        status: 'processing' 
      });

      setCurrentStep('zip');
      toast.info('Creating ZIP archive...');
      
      // Step 2: Create ZIP file
      const zipDownloadUrl = await createZip(sessionId, user.id);
      
      if (!zipDownloadUrl) {
        throw new Error('Failed to create ZIP file');
      }

      // Step 3: Update session with ZIP URL and send to backend
      const zipExpiresAt = new Date();
      zipExpiresAt.setHours(zipExpiresAt.getHours() + 24); // 24 hour expiry
      
      await updateAnalysisSession(sessionId, {
        zip_url: zipDownloadUrl,
        zip_expires_at: zipExpiresAt.toISOString()
      });

      setCurrentStep('process');
      toast.info('Processing analysis...');
      
      // Step 4: Send ZIP URL to backend for processing
      try {
        const backendResponse = await fetch('https://303a26ba156e.ngrok-free.app/parse-statements/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            zipUrl: zipDownloadUrl,
            userId: user.id
          })
        });
        
        if (!backendResponse.ok) {
          throw new Error(`Backend processing failed: ${backendResponse.status}`);
        }
        
        const result = await backendResponse.json();
        console.log('Backend response:', result);
        
        // Update session with backend response
        if (result.status === 'success' && result.url) {
          await updateAnalysisSession(sessionId, {
            status: 'completed',
            zip_url: result.url
          });
          console.log('Session updated with backend results');
        } else {
          throw new Error('Backend processing failed - invalid response');
        }
        
      } catch (backendError) {
        console.error('Backend processing failed:', backendError);
        
        // Update session status to failed
        await updateAnalysisSession(sessionId, {
          status: 'failed'
        });
        
        toast.error('Analysis processing failed. Please try again.');
        throw backendError;
      }
      
      setCurrentStep('complete');
      toast.success('Analysis request submitted successfully!');
      
      // Navigate to results page where polling will begin
      navigate(`/analysis/results/${sessionId}`);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast.error('Analysis failed. Please try again.');
      setCurrentStep('upload');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStepStatus = (step: string) => {
    const steps = ['upload', 'zip', 'process', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const BulkFileUploadField = () => (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors bg-primary/5">
        <input
          id="bulk-upload"
          type="file"
          accept=".pdf,.csv,.jpg,.jpeg,.png"
          onChange={(e) => handleMultipleFileSelection(e.target.files)}
          className="hidden"
          disabled={isAnalyzing}
          multiple
        />
        <label
          htmlFor="bulk-upload"
          className="cursor-pointer flex flex-col items-center space-y-4"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="text-lg font-semibold text-foreground">
              Upload Bank Statements
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">Click to select multiple files</span>
              <span className="block">or drag and drop files here</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Supports PDF, CSV, JPG, PNG (up to 10MB each)
            </div>
          </div>
        </label>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-foreground">Selected Files ({files.length})</h3>
          <div className="grid gap-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <div className="text-sm font-medium text-foreground truncate max-w-xs">
                      {file.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                  disabled={isAnalyzing}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const FileUploadField = ({ index }: { index: number }) => (
    <div className="space-y-2">
      <Label htmlFor={`file-${index}`}>Bank Statement {index + 1}</Label>
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors relative">
        <input
          id={`file-${index}`}
          type="file"
          accept=".pdf,.csv,.jpg,.jpeg,.png"
          onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
          className="hidden"
          disabled={isAnalyzing}
        />
        <label
          htmlFor={`file-${index}`}
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <Upload className="w-8 h-8 text-muted-foreground" />
          <div className="text-sm">
            <span className="font-medium text-primary">Click to upload</span>
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
              disabled={isAnalyzing}
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
    <div className="min-h-screen bg-gradient-to-br from-fintech-navy via-fintech-navy to-fintech-navy">
      <Navigation />
      
      <main className="pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton />
          
          <div className="cosmic-card rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Bank Statement
                <span className="text-primary">
                  {" "}Parser
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Upload bank statements for automated forensic analysis
              </p>
            </div>

            {/* Session Recovery Tools */}
            <SessionRecovery />

            {/* Progress Steps */}
            {isAnalyzing && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  {[
                    { key: 'upload', label: 'Upload Files', icon: Upload },
                    { key: 'zip', label: 'Create Archive', icon: FileText },
                    { key: 'process', label: 'Process Analysis', icon: Loader2 },
                    { key: 'complete', label: 'Complete', icon: CheckCircle }
                  ].map(({ key, label, icon: Icon }) => {
                    const status = getStepStatus(key);
                    return (
                      <div key={key} className="flex flex-col items-center space-y-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          status === 'completed' ? 'bg-green-500 text-white' :
                          status === 'active' ? 'bg-blue-500 text-white' :
                          'bg-gray-200 text-gray-500'
                        }`}>
                          <Icon className={`w-5 h-5 ${status === 'active' ? 'animate-spin' : ''}`} />
                        </div>
                        <span className={`text-xs ${
                          status === 'completed' ? 'text-green-600' :
                          status === 'active' ? 'text-blue-600' :
                          'text-gray-500'
                        }`}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* File Upload Methods Toggle */}
              <div className="flex items-center justify-center space-x-4 p-4 bg-card/50 rounded-lg border border-border">
                <span className="text-sm text-muted-foreground">Upload Method:</span>
                <div className="flex space-x-2">
                  <Button
                    variant={files.length === 0 ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setFiles([]);
                      setStatementCount(1);
                    }}
                    disabled={isAnalyzing}
                  >
                    Bulk Upload
                  </Button>
                  <Button
                    variant={files.length > 0 ? "outline" : "default"}
                    size="sm"
                    onClick={() => setFiles([])}
                    disabled={isAnalyzing}
                  >
                    Individual Upload
                  </Button>
                </div>
              </div>

              {files.length === 0 ? (
                /* Bulk Upload */
                <BulkFileUploadField />
              ) : (
                /* Show selected files and option to add more */
                <div className="space-y-6">
                  <BulkFileUploadField />
                  
                  {/* Statement Count for Individual Upload */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="count">Individual Upload Mode</Label>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="count" className="text-sm">Count:</Label>
                        <Input
                          id="count"
                          type="number"
                          min="1"
                          max="10"
                          value={statementCount}
                          onChange={(e) => setStatementCount(parseInt(e.target.value) || 1)}
                          className="h-8 w-20"
                          disabled={isAnalyzing}
                        />
                      </div>
                    </div>

                    {/* Individual File Upload Fields */}
                    <div className="space-y-4">
                      {Array.from({ length: Math.max(statementCount, files.length) }, (_, index) => (
                        <FileUploadField key={index} index={index} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

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

              {/* ZIP Creation Status */}
              {isCreatingZip && (
                <div className="flex items-center space-x-2 text-sm text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating ZIP archive...</span>
                </div>
              )}

              {zipError && (
                <div className="flex items-center space-x-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>ZIP creation failed: {zipError}</span>
                </div>
              )}

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || isUploading || files.length === 0}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentStep === 'upload' && 'Uploading Files...'}
                    {currentStep === 'zip' && 'Creating Archive...'}
                    {currentStep === 'process' && 'Processing Analysis...'}
                    {currentStep === 'complete' && 'Completing...'}
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
