'use client'

import { useState, useEffect } from 'react'
import { getConfigDebugInfo } from '@/utils/env-checker'
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'

export function EnvDebugPanel() {
  const [debugInfo, setDebugInfo] = useState<ReturnType<typeof getConfigDebugInfo> | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setDebugInfo(getConfigDebugInfo())
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  if (!debugInfo) {
    return null
  }

  const { config, envVars, suggestions } = debugInfo

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          config.hasWorkerUrl
            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
            : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
        }`}
        title={config.hasWorkerUrl ? 'WHOIS Plugin Configured' : 'WHOIS Plugin Not Configured'}
      >
        {config.hasWorkerUrl ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <AlertCircle className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">
          WHOIS: {config.hasWorkerUrl ? 'ON' : 'OFF'}
        </span>
        {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>

      {isVisible && (
        <div className="absolute bottom-full right-0 mb-2 w-96 bg-black/90 border border-white/10 rounded-lg p-4 text-sm">
          <div className="space-y-4">
            {/* Configuration Status */}
            <div>
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                {config.hasWorkerUrl ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                )}
                Configuration Status
              </h3>
              <div className="space-y-1 text-white/70">
                <div>Platform: <span className="text-white">{config.platform}</span></div>
                <div>Source: <span className="text-white">{config.source}</span></div>
                <div>URL: <span className="text-white">{config.workerUrl || 'Not configured'}</span></div>
              </div>
            </div>

            {/* Environment Variables */}
            <div>
              <h4 className="font-semibold text-white mb-2">Environment Variables</h4>
              <div className="space-y-1 text-xs">
                {Object.entries(envVars).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-white/50">{key}:</span>
                    <span className={value ? 'text-green-400' : 'text-white/30'}>
                      {value ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <h4 className="font-semibold text-white mb-2">Suggestions</h4>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className="text-white/70 text-xs">
                      • {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {config.platform === 'local' && !config.hasWorkerUrl && (
              <div>
                <h4 className="font-semibold text-white mb-2">Quick Setup</h4>
                <div className="space-y-2">
                  <div className="bg-white/5 p-2 rounded text-xs font-mono">
                    NEXT_PUBLIC_WHOIS_PLUGIN_URL=http://localhost:3001/whois
                  </div>
                  <div className="text-white/60 text-xs">
                    Add this to your .env.local file
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}