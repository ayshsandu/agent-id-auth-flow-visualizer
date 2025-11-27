import React, { useState } from 'react';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import { FlowType } from './types';

const App: React.FC = () => {
  const [activeFlow, setActiveFlow] = useState<FlowType>(FlowType.DIRECT);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              E
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              EduTech Identity <span className="text-slate-400 font-normal">| Architect</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-800 font-medium">Documentation</a>
            <div className="w-px h-4 bg-slate-300"></div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-xs font-medium text-slate-600">System Operational</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col gap-6">
            
          {/* Control Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Architecture Flow</h2>
              <p className="text-sm text-slate-500">Visualize token propagation and AI interactions.</p>
            </div>
            
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveFlow(FlowType.DIRECT)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeFlow === FlowType.DIRECT
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Direct User
              </button>
              <button
                onClick={() => setActiveFlow(FlowType.AGENT)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeFlow === FlowType.AGENT
                    ? 'bg-white text-violet-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Agent Flow
              </button>
                <button
                onClick={() => setActiveFlow(FlowType.OBO)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeFlow === FlowType.OBO
                    ? 'bg-white text-pink-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                OBO Flow
              </button>
            </div>
          </div>

          {/* Diagram Viewport */}
          <ArchitectureDiagram activeFlow={activeFlow} />

          {/* Explainer Text */}
          <div className={`border rounded-xl p-6 ${
              activeFlow === FlowType.OBO ? 'bg-pink-50 border-pink-100' : 'bg-blue-50 border-blue-100'
          }`}>
            <h3 className={`font-semibold mb-2 flex items-center gap-2 ${
                activeFlow === FlowType.OBO ? 'text-pink-900' : 'text-blue-900'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              System Logic
            </h3>
            <p className={`text-sm leading-relaxed ${
                activeFlow === FlowType.OBO ? 'text-pink-800' : 'text-blue-800'
            }`}>
              {activeFlow === FlowType.DIRECT && (
                <>
                    In <strong>Direct Mode</strong>, the Student logs into the <strong>LMS Portal</strong>.
                    The portal obtains a <strong>User Token</strong> which is passed directly to the 
                    <strong> MCP 1 (Research Server)</strong> and 
                    <strong> MCP 2 (Student Workspace Server)</strong>.
                    This represents a standard secure interaction where the student accesses their own courses, assignments, and materials.
                </>
              )}
              {activeFlow === FlowType.AGENT && (
                <>
                  In <strong>Agent Mode</strong>, the student interacts with the <strong>Smart Agent (AI Assistant)</strong> embedded in the LMS.
                  The Smart Agent authenticates with WSO2 IAM to obtain an <strong>Agent Token</strong>.
                  It uses this token to access university resources via the <strong>MCP 1 - Research Server </strong>, 
                  ensuring the AI's actions are audited separately from the student's direct actions.
                </>
              )}
              {activeFlow === FlowType.OBO && (
                <>
                  In <strong>OBO Flow Mode</strong>, the Smart Agent needs to perform a sensitive action on the student's behalf.
                  It initiates a reverse flow, asking the Student for explicit permission via the LMS.
                  The Student approves via WSO2 IAM, which issues a specialized <strong>OBO Token</strong>
                  directly to the Agent. This allows the AI Assistant to access the <strong>MCP 2 - Student Workspace Server</strong> with delegated authority.
                </>
              )}
            </p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;