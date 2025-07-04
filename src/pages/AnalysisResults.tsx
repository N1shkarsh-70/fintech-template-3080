
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import AppFooter from '@/components/AppFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Download, FileText, TrendingUp, Users, DollarSign, Shield } from 'lucide-react';
import { AnalysisResult } from '@/types/analysis';
import { toast } from 'sonner';

const AnalysisResults = () => {
  const { analysisId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Mock data - in real app, fetch from API using analysisId
    const mockAnalysisData: AnalysisResult = {
      id: analysisId || '1',
      userId: user.id,
      uploadDate: new Date().toISOString(),
      status: 'completed',
      summary: {
        totalFiles: 3,
        totalTransactions: 247,
        suspiciousAccounts: 23,
        fraudulentAmount: 2300000,
        overallConfidence: 0.87,
        riskLevel: 'High'
      },
      files: [
        {
          fileName: 'bank_statement_1.pdf',
          fileId: 'file1',
          transactionCount: 89,
          suspiciousTransactions: 12,
          totalAmount: 890000,
          flaggedAmount: 340000,
          confidence: 0.92,
          graph: { type: 'flow', data: [] },
          flags: [
            { id: '1', type: 'suspicious', message: 'Large cash withdrawals detected', severity: 'high' },
            { id: '2', type: 'warning', message: 'Unusual transaction pattern', severity: 'medium' }
          ]
        },
        {
          fileName: 'bank_statement_2.csv',
          fileId: 'file2',
          transactionCount: 78,
          suspiciousTransactions: 6,
          totalAmount: 450000,
          flaggedAmount: 120000,
          confidence: 0.85,
          graph: { type: 'timeline', data: [] },
          flags: [
            { id: '3', type: 'warning', message: 'Multiple small transactions to same account', severity: 'medium' }
          ]
        },
        {
          fileName: 'bank_statement_3.pdf',
          fileId: 'file3',
          transactionCount: 80,
          suspiciousTransactions: 5,
          totalAmount: 960000,
          flaggedAmount: 1840000,
          confidence: 0.78,
          graph: { type: 'network', data: [] },
          flags: [
            { id: '4', type: 'suspicious', message: 'Transactions to known high-risk accounts', severity: 'high' }
          ]
        }
      ],
      rawTransactions: [],
      globalFlags: [
        { id: '5', type: 'error', message: 'Some transactions could not be processed', severity: 'low' },
        { id: '6', type: 'suspicious', message: 'Potential money laundering pattern detected', severity: 'high' }
      ],
      summaryFile: {
        url: '/mock-summary.xlsx',
        fileName: 'Analysis_Summary.xlsx'
      }
    };

    setTimeout(() => {
      setAnalysisData(mockAnalysisData);
      setIsLoading(false);
    }, 1000);
  }, [analysisId, user, navigate]);

  const handleDownloadSummary = () => {
    if (analysisData?.summaryFile) {
      toast.success('Summary file downloaded successfully');
      // In real app: window.open(analysisData.summaryFile.url, '_blank');
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'High': return 'text-orange-500';
      case 'Critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getFlagColor = (type: string) => {
    switch (type) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      case 'suspicious': return 'default';
      default: return 'outline';
    }
  };

  if (!user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-pink-950/20 dark:via-background dark:to-blue-950/20">
        <Navigation />
        <main className="pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading analysis results...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-pink-950/20 dark:via-background dark:to-blue-950/20">
        <Navigation />
        <main className="pt-20 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BackButton />
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Analysis Not Found</h1>
              <p className="text-muted-foreground">The requested analysis could not be found.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-pink-950/20 dark:via-background dark:to-blue-950/20">
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
                  <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                    {" "}Results
                  </span>
                </h1>
                <p className="text-muted-foreground">
                  Analysis completed on {new Date(analysisData.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleDownloadSummary}
                  className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Summary
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/analysis')}
                >
                  New Analysis
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysisData.summary.totalTransactions}</div>
                <p className="text-xs text-muted-foreground">
                  Across {analysisData.summary.totalFiles} files
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suspicious Accounts</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{analysisData.summary.suspiciousAccounts}</div>
                <p className="text-xs text-muted-foreground">
                  Flagged for review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fraudulent Amount</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">
                  ${analysisData.summary.fraudulentAmount.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Potentially fraudulent
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getRiskColor(analysisData.summary.riskLevel)}`}>
                  {analysisData.summary.riskLevel}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Progress value={analysisData.summary.overallConfidence * 100} className="flex-1" />
                  <span className="text-xs text-muted-foreground">
                    {Math.round(analysisData.summary.overallConfidence * 100)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis */}
          <Tabs defaultValue="files" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="files">File Analysis</TabsTrigger>
              <TabsTrigger value="transactions">Raw Transactions</TabsTrigger>
              <TabsTrigger value="flags">Flags & Issues</TabsTrigger>
            </TabsList>

            <TabsContent value="files" className="space-y-6">
              {analysisData.files.map((file, index) => (
                <Card key={file.fileId}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{file.fileName}</span>
                      <Badge variant="outline">
                        Confidence: {Math.round(file.confidence * 100)}%
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {file.transactionCount} transactions • {file.suspiciousTransactions} flagged
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Total Amount</div>
                        <div className="text-lg font-bold">${file.totalAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Flagged Amount</div>
                        <div className="text-lg font-bold text-red-500">${file.flaggedAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Graph Type</div>
                        <div className="text-lg font-bold capitalize">{file.graph.type}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Issues</div>
                        <div className="text-lg font-bold">{file.flags.length}</div>
                      </div>
                    </div>
                    
                    {file.flags.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">File-specific Issues:</h4>
                        <div className="space-y-2">
                          {file.flags.map((flag) => (
                            <div key={flag.id} className="flex items-center space-x-2">
                              <Badge variant={getFlagColor(flag.type) as any}>
                                {flag.type}
                              </Badge>
                              <span className="text-sm">{flag.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Transaction Data</CardTitle>
                  <CardDescription>
                    Complete transaction records from all uploaded files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Transaction data would be displayed here in a searchable table format.</p>
                    <p className="text-sm mt-2">This feature requires backend integration to process the raw transaction data.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="flags">
              <Card>
                <CardHeader>
                  <CardTitle>Global Flags & Issues</CardTitle>
                  <CardDescription>
                    System-wide issues and suspicious patterns detected across all files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisData.globalFlags.map((flag) => (
                      <div key={flag.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                        <div className="mt-1">
                          {flag.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                          {flag.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                          {flag.type === 'suspicious' && <Shield className="w-5 h-5 text-orange-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant={getFlagColor(flag.type) as any}>
                              {flag.type}
                            </Badge>
                            <Badge variant="outline">
                              {flag.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground">{flag.message}</p>
                          {flag.details && (
                            <p className="text-xs text-muted-foreground mt-1">{flag.details}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default AnalysisResults;
