
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import AppFooter from '@/components/AppFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DownloadButton } from '@/components/ui/download-button';
import { PersonsOfInterestTable } from '@/components/PersonsOfInterestTable';
import { AlertCircle, CheckCircle, Loader2, FileText, Users } from 'lucide-react';
import { useAnalysisPolling } from '@/hooks/useAnalysisPolling';
import { useZipFileExtraction } from '@/hooks/useZipFileExtraction';
import { toast } from 'sonner';

const AnalysisResults = () => {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { session, isPolling, error: pollingError, startPolling } = useAnalysisPolling();
  const { 
    extractedFiles, 
    isExtracting, 
    error: extractionError, 
    extractFilesFromZip, 
    downloadFile,
    clearFiles 
  } = useZipFileExtraction();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!sessionId) {
      navigate('/analysis');
      return;
    }

    // Start polling for session status
    startPolling(sessionId);
    setIsInitialLoad(false);
  }, [user, sessionId, navigate, startPolling]);

  useEffect(() => {
    // When session is completed and has a ZIP URL, extract files
    if (session?.status === 'completed' && session.zip_url && extractedFiles.length === 0) {
      // Check if this is a backend-generated ZIP (Google Cloud Storage) or our own ZIP
      const isBackendZip = session.zip_url.includes('storage.googleapis.com');
      
      if (isBackendZip) {
        toast.success('Analysis completed! Extracting results...');
        extractFilesFromZip(session.zip_url);
      } else {
        // Handle our own ZIP creation (fallback)
        toast.info('Analysis completed. ZIP file ready for download.');
      }
    }
  }, [session, extractFilesFromZip, extractedFiles.length]);

  const getUploadedFiles = () => {
    return extractedFiles.filter(file => 
      file.type === 'summary' || file.type === 'raw_transactions'
    );
  };

  const getGroupedFiles = () => {
    const uploadedFiles = getUploadedFiles();
    const grouped: { [key: string]: { summary?: any; raw?: any } } = {};
    
    uploadedFiles.forEach(file => {
      const key = file.originalFileName || 'unknown';
      if (!grouped[key]) grouped[key] = {};
      
      if (file.type === 'summary') {
        grouped[key].summary = file;
      } else if (file.type === 'raw_transactions') {
        grouped[key].raw = file;
      }
    });
    
    return grouped;
  };

  const handleDownloadPOI = (beneficiaryName: string) => {
    const poiFile = extractedFiles.find(file => 
      file.type === 'poi' && 
      file.beneficiaryName?.toLowerCase() === beneficiaryName.toLowerCase()
    );
    
    if (poiFile) {
      downloadFile(poiFile);
      toast.success(`Downloaded POI data for ${beneficiaryName}`);
    } else {
      toast.error(`POI data not found for ${beneficiaryName}`);
    }
  };

  const handleDownloadZip = () => {
    if (session?.zip_url) {
      window.open(session.zip_url, '_blank');
      toast.success('ZIP file download started');
    }
  };

  if (!user) return null;

  // Show loading while initial session fetch
  if (isInitialLoad) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fintech-navy via-fintech-navy to-fintech-navy">
        <Navigation />
        <main className="pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading analysis session...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error if session not found
  if (!session && !isPolling) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fintech-navy via-fintech-navy to-fintech-navy">
        <Navigation />
        <main className="pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BackButton />
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Analysis Session Not Found</h1>
              <p className="text-muted-foreground">
                The requested analysis session could not be found or may have expired.
              </p>
              <Button 
                onClick={() => navigate('/analysis')} 
                className="mt-4"
              >
                Start New Analysis
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const poiFile = extractedFiles.find(file => file.type === 'persons_of_interest');
  const poiFiles = extractedFiles.filter(file => file.type === 'poi');
  const groupedFiles = getGroupedFiles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-fintech-navy via-fintech-navy to-fintech-navy">
      <Navigation />
      
      <main className="pt-20 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton />
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Analysis
                  <span className="text-primary">
                    {" "}Results
                  </span>
                </h1>
                <p className="text-muted-foreground">
                  Session ID: {sessionId} • {session && new Date(session.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-3">
                {session?.zip_url && (
                  <DownloadButton
                    onDownload={handleDownloadZip}
                    variant="secondary"
                  >
                    Original ZIP
                  </DownloadButton>
                )}
                <Button
                  variant="outline"
                  onClick={() => navigate('/analysis')}
                >
                  New Analysis
                </Button>
              </div>
            </div>
          </div>

          {/* Status Display */}
          {session && (
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  {session.status === 'processing' && (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                      <div>
                        <p className="font-medium text-foreground">Analysis in Progress</p>
                        <p className="text-sm text-muted-foreground">
                          Your files are being processed. This may take a few minutes...
                        </p>
                      </div>
                    </>
                  )}
                  {session.status === 'completed' && extractedFiles.length > 0 && (
                    <>
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      <div>
                        <p className="font-medium text-foreground">Analysis Complete</p>
                        <p className="text-sm text-muted-foreground">
                          {extractedFiles.length} files extracted and ready for download
                        </p>
                      </div>
                    </>
                  )}
                  {session.status === 'completed' && extractedFiles.length === 0 && isExtracting && (
                    <>
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                      <div>
                        <p className="font-medium text-foreground">Extracting Results</p>
                        <p className="text-sm text-muted-foreground">
                          Processing analysis results from backend...
                        </p>
                      </div>
                    </>
                  )}
                  {session.status === 'failed' && (
                    <>
                      <AlertCircle className="h-6 w-6 text-red-500" />
                      <div>
                        <p className="font-medium text-foreground">Analysis Failed</p>
                        <p className="text-sm text-muted-foreground">
                          There was an error processing your files. Please try again.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Display */}
          {(pollingError || extractionError) && (
            <Card className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-400">Error</p>
                    <p className="text-sm text-red-600 dark:text-red-300">
                      {pollingError || extractionError}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* File Downloads Section */}
          {extractedFiles.length > 0 && (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Uploaded Files Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    Download summary and raw transaction data for each uploaded file
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.keys(groupedFiles).length > 0 ? (
                    Object.entries(groupedFiles).map(([fileName, files]) => (
                      <div key={fileName} className="border rounded-lg p-6 bg-muted/30">
                        <h3 className="text-lg font-semibold mb-4 text-foreground">
                          {fileName}
                        </h3>
                        <div className="flex flex-wrap gap-4">
                          {files.summary && (
                            <DownloadButton
                              onDownload={() => downloadFile(files.summary)}
                              variant="primary"
                            >
                              Download Summary
                            </DownloadButton>
                          )}
                          {files.raw && (
                            <DownloadButton
                              onDownload={() => downloadFile(files.raw)}
                              variant="subtle"
                            >
                              Download Raw
                            </DownloadButton>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No file analysis data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Persons of Interest Table */}
              <PersonsOfInterestTable
                poiFile={poiFile}
                poiFiles={poiFiles}
                onDownloadFile={downloadFile}
                onDownloadPOI={handleDownloadPOI}
              />
            </>
          )}

          {/* No Results Yet */}
          {session?.status !== 'failed' && extractedFiles.length === 0 && !isExtracting && (
            <Card>
              <CardContent className="p-12">
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Analysis Results Pending</h3>
                  <p className="text-muted-foreground mb-4">
                    {session?.status === 'processing' 
                      ? 'Your analysis is currently being processed. Results will appear here once complete.'
                      : 'Waiting for analysis results...'
                    }
                  </p>
                  {isPolling && (
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Checking for updates...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default AnalysisResults;
