
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  accountFrom: string;
  accountTo: string;
  category: string;
  flagged: boolean;
  confidence: number;
}

export interface FileAnalysis {
  fileName: string;
  fileId: string;
  transactionCount: number;
  suspiciousTransactions: number;
  totalAmount: number;
  flaggedAmount: number;
  confidence: number;
  graph: {
    type: 'flow' | 'timeline' | 'network';
    data: any[];
  };
  flags: Flag[];
}

export interface Flag {
  id: string;
  type: 'error' | 'warning' | 'suspicious';
  message: string;
  severity: 'low' | 'medium' | 'high';
  transactionId?: string;
  details?: string;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'failed';
  summary: {
    totalFiles: number;
    totalTransactions: number;
    suspiciousAccounts: number;
    fraudulentAmount: number;
    overallConfidence: number;
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  };
  files: FileAnalysis[];
  rawTransactions: Transaction[];
  globalFlags: Flag[];
  summaryFile?: {
    url: string;
    fileName: string;
  };
}
