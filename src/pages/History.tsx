
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import AppFooter from '@/components/AppFooter';
import { Calendar, FileText, TrendingUp, Eye, AlertCircle } from 'lucide-react';

interface AnalysisHistory {
  id: string;
  date: string;
  statementCount: number;
  totalTransactions: number;
  suspiciousAccounts: number;
  fraudulentAmount: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

const History = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState<AnalysisHistory[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Mock history data
    const mockHistory: AnalysisHistory[] = [
      {
        id: '1',
        date: '2024-01-15',
        statementCount: 3,
        totalTransactions: 156,
        suspiciousAccounts: 23,
        fraudulentAmount: 2300000,
        riskLevel: 'High'
      },
      {
        id: '2',
        date: '2024-01-12',
        statementCount: 2,
        totalTransactions: 89,
        suspiciousAccounts: 5,
        fraudulentAmount: 450000,
        riskLevel: 'Medium'
      },
      {
        id: '3',
        date: '2024-01-08',
        statementCount: 1,
        totalTransactions: 34,
        suspiciousAccounts: 1,
        fraudulentAmount: 15000,
        riskLevel: 'Low'
      },
      {
        id: '4',
        date: '2024-01-05',
        statementCount: 4,
        totalTransactions: 203,
        suspiciousAccounts: 12,
        fraudulentAmount: 1200000,
        riskLevel: 'High'
      }
    ];

    setHistoryData(mockHistory);
  }, [user, navigate]);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'High':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'Medium':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Low':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-pink-950/20 dark:via-background dark:to-blue-950/20">
      <Navigation />
      
      <main className="pt-20 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton />
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Analysis
              <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                {" "}History
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              View all your previous financial analysis reports
            </p>
          </div>

          {historyData.length === 0 ? (
            <div className="bg-background/80 backdrop-blur-xl rounded-2xl p-12 border border-white/20 shadow-2xl text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">No Analysis History</h2>
              <p className="text-muted-foreground mb-6">
                You haven't run any financial analysis yet. Start by uploading your first bank statement.
              </p>
              <Button
                onClick={() => navigate('/analysis')}
                className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white"
              >
                Start Analysis
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {historyData.map((analysis) => (
                <div
                  key={analysis.id}
                  className="bg-background/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-pink-500" />
                        <span className="text-lg font-semibold text-foreground">
                          {formatDate(analysis.date)}
                        </span>
                        <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getRiskLevelColor(analysis.riskLevel)}`}>
                          <AlertCircle className="w-3 h-3 inline mr-1" />
                          {analysis.riskLevel} Risk
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{analysis.statementCount} statements</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{analysis.totalTransactions} transactions</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">{analysis.suspiciousAccounts}</div>
                        <div className="text-xs text-muted-foreground">Suspicious Accounts</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">
                          ${(analysis.fraudulentAmount / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-muted-foreground">Fraudulent Amount</div>
                      </div>
                      
                      <div className="col-span-2 lg:col-span-1 flex justify-center lg:justify-end">
                        <Button
                          variant="outline"
                          className="border-pink-500/30 hover:bg-pink-500/10 hover:border-pink-500/50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-8">
                <Button
                  onClick={() => navigate('/analysis')}
                  className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white"
                >
                  Run New Analysis
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default History;
