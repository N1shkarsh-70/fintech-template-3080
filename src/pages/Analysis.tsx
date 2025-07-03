
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import AppFooter from '@/components/AppFooter';
import { Upload, FileText, Image, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Analysis = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statementCount, setStatementCount] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleFileChange = (index: number, file: File | null) => {
    const newFiles = [...files];
    if (file) {
      newFiles[index] = file;
    } else {
      newFiles.splice(index, 1);
    }
    setFiles(newFiles);
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      toast.error('Please upload at least one bank statement');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResults = {
      totalTransactions: 156,
      suspiciousAccounts: 23,
      fraudulentAmount: 2300000,
      riskLevel: 'High',
      analysisDate: new Date().toISOString()
    };
    
    setResults(mockResults);
    setIsAnalyzing(false);
    setAnalysisComplete(true);
    toast.success('Analysis completed successfully!');
  };

  const FileUploadField = ({ index }: { index: number }) => (
    <div className="space-y-2">
      <Label htmlFor={`file-${index}`}>Bank Statement {index + 1}</Label>
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-pink-500/50 transition-colors">
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
            <span>{files[index].name}</span>
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

            {!analysisComplete ? (
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
                  />
                </div>

                {/* File Upload Fields */}
                <div className="space-y-6">
                  {Array.from({ length: statementCount }, (_, index) => (
                    <FileUploadField key={index} index={index} />
                  ))}
                </div>

                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || files.length === 0}
                  className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white h-12"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Documents...
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
            ) : (
              /* Analysis Results */
              <div className="space-y-8">
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">Analysis Complete</h2>
                  <p className="text-muted-foreground">Your bank statements have been processed successfully</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-xl p-6 border border-pink-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Total Transactions</h3>
                    <p className="text-3xl font-bold text-pink-500">{results?.totalTransactions}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500/10 to-pink-500/10 rounded-xl p-6 border border-blue-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Suspicious Accounts</h3>
                    <p className="text-3xl font-bold text-blue-500">{results?.suspiciousAccounts}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl p-6 border border-red-500/20">
                    <h3 className="text-lg font-semibold text-foreground mb-2">Fraudulent Amount</h3>
                    <p className="text-3xl font-bold text-red-500">
                      ${results?.fraudulentAmount?.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-xl p-6 border border-yellow-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-500" />
                      <h3 className="text-lg font-semibold text-foreground">Risk Level</h3>
                    </div>
                    <p className="text-3xl font-bold text-yellow-500">{results?.riskLevel}</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={() => {
                      setAnalysisComplete(false);
                      setResults(null);
                      setFiles([]);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    New Analysis
                  </Button>
                  <Button
                    onClick={() => navigate('/history')}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white"
                  >
                    View History
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default Analysis;
