"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Save, EyeOff } from "lucide-react"
import { affiliateHandler } from "@/lib/services/affiliate-handler"
import { GLOBAL_RESELLERS } from "@/lib/config/global-affiliate-config"

export default function AffiliateConfigurator() {
  const [currentCode, setCurrentCode] = useState("")
  const [newCode, setNewCode] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [testUrl, setTestUrl] = useState("https://robloxcheatz.com/product/example")
  const [processedUrl, setProcessedUrl] = useState("")

  useEffect(() => {
    setCurrentCode(affiliateHandler.getCurrentAffiliateCode())
    setNewCode(affiliateHandler.getCurrentAffiliateCode())
  }, [])

  const handleSave = async () => {
    if (!affiliateHandler.isValidAffiliateCode(newCode)) {
      alert("Invalid affiliate code format. Use 3-20 characters (letters, numbers, underscore, dash only)")
      return
    }

    setIsSaving(true)
    try {
      affiliateHandler.setAffiliateCode(newCode)
      setCurrentCode(newCode)

      // Update processed URL preview
      if (testUrl) {
        setProcessedUrl(affiliateHandler.processUrl(testUrl))
      }
    } catch (error) {
      alert("Error saving configuration")
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestUrl = () => {
    if (testUrl) {
      const processed = affiliateHandler.processUrl(testUrl, newCode)
      setProcessedUrl(processed)
    }
  }

  useEffect(() => {
    if (testUrl) {
      handleTestUrl()
    }
  }, [testUrl, newCode])

  if (!isVisible) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsVisible(true)} className="fixed bottom-4 right-4 z-50">
        <Settings className="h-4 w-4 mr-2" />
        Affiliate Config
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Affiliate Configuration
              </CardTitle>
              <CardDescription>Configure your default affiliate code for all reseller links</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Current Configuration */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Affiliate Code</label>
            <div className="flex items-center gap-2">
              <Input value={currentCode} disabled className="font-mono" />
              <Badge variant="secondary">Active</Badge>
            </div>
          </div>

          {/* New Configuration */}
          <div className="space-y-2">
            <label className="text-sm font-medium">New Affiliate Code</label>
            <div className="flex gap-2">
              <Input
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Enter your affiliate code"
                className="font-mono"
              />
              <Button onClick={handleSave} disabled={isSaving || newCode === currentCode}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
            <p className="text-xs text-gray-500">3-20 characters: letters, numbers, underscore, dash only</p>
          </div>

          {/* URL Tester */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Test URL Processing</label>
            <Input
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder="Enter a reseller URL to test"
            />
            {processedUrl && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Processed URL:</p>
                <p className="text-sm font-mono break-all">{processedUrl}</p>
              </div>
            )}
          </div>

          {/* Configured Resellers */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Configured Resellers</label>
            <div className="grid gap-2">
              {GLOBAL_RESELLERS.map((reseller, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{reseller.name}</p>
                    <p className="text-xs text-gray-500">
                      {reseller.domains.join(", ")} • {reseller.pattern.type === "path" ? "Path" : "Query"} pattern
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {reseller.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs font-mono">
                      keyempire
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Set your affiliate code above and click Save</li>
              <li>• All reseller links will automatically use your code</li>
              <li>• Different resellers use different URL patterns (path vs query)</li>
              <li>• Test URLs above to see how they'll be processed</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
