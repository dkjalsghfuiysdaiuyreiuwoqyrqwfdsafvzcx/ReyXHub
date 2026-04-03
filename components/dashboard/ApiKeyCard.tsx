"use client"

import { Copy, Eye, EyeClosed } from "lucide-react"
import { useMemo, useState } from "react"

type ApiKeyCardProps = {
  apiKey: string
}

export default function ApiKeyCard({ apiKey }: ApiKeyCardProps) {
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)

  const maskedKey = useMemo(() => {
    return "*".repeat(apiKey.length)
  }, [apiKey])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(apiKey)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 1500)
    } catch (error) {
      console.error("Failed to copy API key:", error)
    }
  }

  return (
    <div className="mt-4 border border-slate-200 p-4 rounded-lg gap-2">
      <div className="flex items-center gap-2">
        <h1 className="font-semibold">API Key</h1>

        <button
          type="button"
          onClick={handleCopy}
          className="cursor-pointer text-slate-500 hover:text-black transition"
          aria-label="Copy API key"
          title="Copy API key"
        >
          <Copy size={15} className={copied ? "text-green-500" : ""} />
        </button>

        <button
          type="button"
          onClick={() => setShowKey((prev) => !prev)}
          className="cursor-pointer text-slate-500 hover:text-black transition"
          aria-label={showKey ? "Hide API key" : "Show API key"}
          title={showKey ? "Hide API key" : "Show API key"}
        >
          {showKey ? <Eye size={15} /> : <EyeClosed size={15} />}
        </button>

        {copied && (
          <span className="text-xs font-medium text-green-500">Copied!</span>
        )}
      </div>

      <p className="truncate font-mono">
        {showKey ? apiKey : maskedKey}
      </p>
    </div>
  )
}