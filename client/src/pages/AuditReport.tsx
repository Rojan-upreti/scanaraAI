import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApps } from '../contexts/AppContext';
import { CheckCircle, XCircle, Download, Copy, ArrowLeft, CheckCircle2, AlertCircle, FileText, Loader2 } from 'lucide-react';

const AuditReport = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { audits, updateAudit, loading } = useApps();
  const [copied, setCopied] = useState(false);
  const [audit, setAudit] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (reportId) {
      const foundAudit = audits.find(a => a.id === reportId);
      if (foundAudit && foundAudit.status === 'completed') {
        setAudit(foundAudit);
      } else {
        // If audit not found or not completed, redirect to dashboard
        navigate('/dashboard');
      }
    }
  }, [reportId, audits, navigate]);

  if (loading || !audit) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-apple-blue mx-auto mb-4" />
          <p className="text-apple-gray-600 dark:text-apple-gray-400">Loading audit report...</p>
        </div>
      </div>
    );
  }

  if (!audit.findings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-apple-gray-600 dark:text-apple-gray-400">No findings available for this audit.</p>
        </div>
      </div>
    );
  }

  const findings = audit.findings || [];
  const isCompliant = audit.isCompliant || false;
  const score = audit.score || 0;
  const criticalCount = findings.filter((f: any) => f.severity === 'critical' && !f.resolved).length;
  const warningCount = findings.filter((f: any) => f.severity === 'warning' && !f.resolved).length;
  const infoCount = findings.filter((f: any) => f.severity === 'info' && !f.resolved).length;
  const totalIssues = findings.filter((f: any) => !f.resolved).length;

  const handleResolve = async (findingId: string) => {
    if (!reportId) return;
    setIsUpdating(true);
    try {
      const updatedFindings = findings.map((f: any) => 
        f.id === findingId ? { ...f, resolved: !f.resolved } : f
      );
      await updateAudit(reportId, { findings: updatedFindings });
      setAudit({ ...audit, findings: updatedFindings });
    } catch (error) {
      console.error('Failed to update audit:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyMarkdown = () => {
    const markdown = `# Compliance Audit Report

## Overall Status: ${isCompliant ? '✅ Compliant' : '❌ Not Compliant'}

## Score: ${score}%

## Summary
Detected ${totalIssues} issue(s) across ${findings.length} finding(s).

${findings.map((f: any) => `
### ${f.category} - ${f.file}:${f.line}
- **Severity**: ${f.severity}
- **Description**: ${f.description}
- **Suggestion**: ${f.suggestion}
${f.nextSteps && f.nextSteps.length > 0 ? `- **Next Steps**:\n${f.nextSteps.map((step: string, i: number) => `  ${i + 1}. ${step}`).join('\n')}` : ''}
`).join('\n')}
`;
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    // Mock PDF download
    alert('PDF download initiated! (Mocked)');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-apple-red bg-apple-red/10 dark:bg-apple-red/20 border-apple-red/20 dark:border-apple-red/30';
      case 'warning':
        return 'text-apple-orange bg-apple-orange/10 dark:bg-apple-orange/20 border-apple-orange/20 dark:border-apple-orange/30';
      case 'info':
        return 'text-apple-blue bg-apple-blue/10 dark:bg-apple-blue/20 border-apple-blue/20 dark:border-apple-blue/30';
      default:
        return 'text-apple-gray-600 dark:text-apple-gray-400 bg-apple-gray-100 dark:bg-apple-gray-800/50 border-apple-gray-200 dark:border-apple-gray-700';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      case 'info':
        return <FileText size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 text-apple-gray-600 dark:text-apple-gray-400 hover:text-apple-gray-900 dark:hover:text-apple-gray-100 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Dashboard</span>
        </Link>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCopyMarkdown}
            className="apple-button-secondary"
          >
            {copied ? (
              <>
                <CheckCircle2 size={18} className="text-apple-green mr-2" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={18} className="mr-2" />
                <span>Copy Markdown</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="apple-button-primary shadow-apple-lg"
          >
            <Download size={18} className="mr-2" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`apple-card p-8 lg:p-10 shadow-apple-xl border-2 ${
        isCompliant
          ? 'bg-apple-green/5 dark:bg-apple-green/10 border-apple-green/30 dark:border-apple-green/40'
          : 'bg-apple-red/5 dark:bg-apple-red/10 border-apple-red/30 dark:border-apple-red/40'
      }`}>
        <div className="flex items-center space-x-6">
          {isCompliant ? (
            <CheckCircle size={56} className="text-apple-green flex-shrink-0" />
          ) : (
            <XCircle size={56} className="text-apple-red flex-shrink-0" />
          )}
          <div>
            <h1 className="text-3xl lg:text-4xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-2 tracking-tight">
              Overall Status: {isCompliant ? '✅ HIPAA Compliant' : '❌ Not Compliant'}
            </h1>
            <p className="text-xl text-apple-gray-700 dark:text-apple-gray-300 mb-1">
              Score: <span className="font-semibold text-3xl">{score}%</span>
            </p>
            <p className="text-base text-apple-gray-600 dark:text-apple-gray-400 mt-2">
              Detected {totalIssues} unresolved issue{totalIssues !== 1 ? 's' : ''} requiring attention.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="apple-card p-6 shadow-apple-lg bg-apple-red/5 dark:bg-apple-red/10 border border-apple-red/20 dark:border-apple-red/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 font-medium mb-1">Critical Issues</p>
              <p className="text-3xl font-semibold text-apple-red tracking-tight">{criticalCount}</p>
            </div>
            <XCircle size={32} className="text-apple-red opacity-50" />
          </div>
        </div>
        <div className="apple-card p-6 shadow-apple-lg bg-apple-orange/5 dark:bg-apple-orange/10 border border-apple-orange/20 dark:border-apple-orange/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 font-medium mb-1">Warnings</p>
              <p className="text-3xl font-semibold text-apple-orange tracking-tight">{warningCount}</p>
            </div>
            <AlertCircle size={32} className="text-apple-orange opacity-50" />
          </div>
        </div>
        <div className="apple-card p-6 shadow-apple-lg bg-apple-blue/5 dark:bg-apple-blue/10 border border-apple-blue/20 dark:border-apple-blue/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-apple-gray-600 dark:text-apple-gray-400 font-medium mb-1">Info</p>
              <p className="text-3xl font-semibold text-apple-blue dark:text-apple-blueLight tracking-tight">{infoCount}</p>
            </div>
            <FileText size={32} className="text-apple-blue dark:text-apple-blueLight opacity-50" />
          </div>
        </div>
      </div>

      {/* Findings List */}
      <div className="apple-card p-8 lg:p-10 shadow-apple-lg">
        <h2 className="text-2xl font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-6 tracking-tight">Findings</h2>
        <div className="space-y-4">
          {findings.map((finding: any) => (
            <div
              key={finding.id}
              className={`p-6 rounded-apple-lg border-2 transition-all duration-200 ${
                finding.resolved
                  ? 'bg-apple-gray-100 dark:bg-apple-gray-800/50 border-apple-gray-300 dark:border-apple-gray-700 opacity-60'
                  : getSeverityColor(finding.severity)
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2.5 rounded-[14px] ${getSeverityColor(finding.severity)}`}>
                    {getSeverityIcon(finding.severity)}
                  </div>
                  <div>
                    <span className="font-semibold text-lg text-apple-gray-900 dark:text-apple-gray-100 tracking-tight">{finding.category}</span>
                    <span className="text-apple-gray-500 dark:text-apple-gray-500 mx-2">•</span>
                    <span className="text-sm text-apple-gray-600 dark:text-apple-gray-400 font-mono">
                      {finding.file}:{finding.line}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleResolve(finding.id)}
                  className={`px-4 py-2 rounded-apple text-sm font-semibold transition-all duration-200 ${
                    finding.resolved
                      ? 'bg-apple-green/10 text-apple-green dark:bg-apple-green/20 hover:bg-apple-green/20 dark:hover:bg-apple-green/30'
                      : 'apple-button-secondary'
                  }`}
                >
                  {finding.resolved ? (
                    <span className="flex items-center space-x-2">
                      <CheckCircle2 size={16} />
                      <span>Resolved</span>
                    </span>
                  ) : (
                    'Mark as Resolved'
                  )}
                </button>
              </div>
              <p className="text-apple-gray-700 dark:text-apple-gray-300 mb-4 text-base leading-relaxed">{finding.description}</p>
              <div className="bg-apple-blue/5 dark:bg-apple-blue/10 border border-apple-blue/20 dark:border-apple-blue/30 rounded-apple-lg p-4 mb-4">
                <p className="text-sm font-semibold text-apple-blue dark:text-apple-blueLight mb-2 tracking-tight">Fix Suggestion:</p>
                <p className="text-sm text-apple-gray-700 dark:text-apple-gray-300 leading-relaxed">{finding.suggestion}</p>
              </div>
              {finding.nextSteps && finding.nextSteps.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-3 tracking-tight">Next Steps:</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-apple-gray-700 dark:text-apple-gray-300 leading-relaxed pl-3">
                    {finding.nextSteps.map((step: string, index: number) => (
                      <li key={index} className="pl-1">{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Report Metadata */}
      <div className="apple-card p-6 shadow-apple-lg">
        <h3 className="text-lg font-semibold text-apple-gray-900 dark:text-apple-gray-100 mb-4 tracking-tight">Report Information</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-apple-gray-600 dark:text-apple-gray-400">Report ID:</span>
            <span className="ml-2 font-mono text-apple-gray-900 dark:text-apple-gray-100">{reportId}</span>
          </div>
          <div>
            <span className="text-apple-gray-600 dark:text-apple-gray-400">Generated:</span>
            <span className="ml-2 text-apple-gray-900 dark:text-apple-gray-100">
              {new Date(audit.completedAt || audit.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditReport;
