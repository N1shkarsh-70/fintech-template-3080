import React, { useState } from 'react';
import { FileText, Download, Eye, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingSampleOutput = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const sampleData = {
    totalAmount: '₹45,67,890',
    transactions: 1247,
    flaggedItems: 23,
    accounts: 8,
    timeRange: 'Jan 2024 - Mar 2024'
  };

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/3 to-background"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Sample
            <span className="text-primary">
              {" "}Output
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how our platform transforms raw bank statements into professional, audit-ready analysis reports.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-card/60 backdrop-blur-sm rounded-lg p-1 border border-border">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Dashboard View
            </button>
            <button
              onClick={() => setActiveTab('excel')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
                activeTab === 'excel'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Excel Report
            </button>
          </div>
        </div>

        {/* Dashboard Preview */}
        {activeTab === 'dashboard' && (
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Bank Statement Analysis Report
                </h3>
                <p className="text-muted-foreground">{sampleData.timeRange}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold text-foreground">{sampleData.totalAmount}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                    <p className="text-2xl font-bold text-foreground">{sampleData.transactions}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="bg-red-500/5 rounded-lg p-4 border border-red-500/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Flagged Items</p>
                    <p className="text-2xl font-bold text-red-500">{sampleData.flaggedItems}</p>
                  </div>
                  <PieChart className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Accounts</p>
                    <p className="text-2xl font-bold text-foreground">{sampleData.accounts}</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>

            {/* Sample Chart Area */}
            <div className="bg-secondary/20 rounded-lg p-6 border border-border">
              <h4 className="text-lg font-semibold text-foreground mb-4">Transaction Flow Analysis</h4>
              <div className="h-48 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Interactive charts showing transaction patterns,</p>
                  <p className="text-muted-foreground">cash flow analysis, and anomaly detection</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Excel Preview */}
        {activeTab === 'excel' && (
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Excel Export Preview</h3>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Download className="w-4 h-4 mr-2" />
                Download Sample
              </Button>
            </div>
            
            {/* Excel Table Preview */}
            <div className="bg-secondary/20 rounded-lg border border-border overflow-hidden">
              <div className="bg-primary/10 p-3 border-b border-border">
                <div className="grid grid-cols-6 gap-4 text-sm font-semibold text-foreground">
                  <div>Date</div>
                  <div>Description</div>
                  <div>Debit</div>
                  <div>Credit</div>
                  <div>Balance</div>
                  <div>Category</div>
                </div>
              </div>
              <div className="divide-y divide-border">
                {[
                  { date: '15/03/2024', desc: 'NEFT CR-SALARY', debit: '', credit: '₹85,000', balance: '₹2,45,000', category: 'Salary' },
                  { date: '16/03/2024', desc: 'UPI P2A-RENT PMT', debit: '₹25,000', credit: '', balance: '₹2,20,000', category: 'Rent' },
                  { date: '17/03/2024', desc: 'CASH DEP', debit: '', credit: '₹50,000', balance: '₹2,70,000', category: 'Cash Deposit' },
                  { date: '18/03/2024', desc: 'CHEQUE DR', debit: '₹15,000', credit: '', balance: '₹2,55,000', category: 'Other' }
                ].map((row, index) => (
                  <div key={index} className="grid grid-cols-6 gap-4 p-3 text-sm">
                    <div className="text-foreground">{row.date}</div>
                    <div className="text-foreground truncate">{row.desc}</div>
                    <div className="text-red-500">{row.debit}</div>
                    <div className="text-green-500">{row.credit}</div>
                    <div className="text-foreground font-medium">{row.balance}</div>
                    <div className="text-primary">{row.category}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Clean, categorized data ready for forensic analysis and audit compliance
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LandingSampleOutput;