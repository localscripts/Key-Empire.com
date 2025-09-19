"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Copy, Check, ExternalLink, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "./ui/alert"

export default function AffiliateGenerator() {
  const [affiliateCode, setAffiliateCode] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [passwordCopied, setPasswordCopied] = useState(false)

  const generateAffiliate = async () => {
    if (!affiliateCode.trim()) {
      setError("Please enter an affiliate code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/affiliate/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ affiliateCode: affiliateCode.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate affiliate link")
      }

      setGeneratedLink(data.affiliateUrl)
      setGeneratedPassword(data.password)
      setPasswordSaved(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`https://${generatedLink}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const copyPasswordToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword)
      setPasswordCopied(true)
      setTimeout(() => setPasswordCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy password:", err)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Your Affiliate Link</CardTitle>
          <CardDescription>
            Create a unique affiliate link to earn commissions on referrals. Each affiliate code can only be used once.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your affiliate code (e.g., myusername)"
              value={affiliateCode}
              onChange={(e) => setAffiliateCode(e.target.value)}
              className="flex-1"
              maxLength={20}
            />
            <Button onClick={generateAffiliate} disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate"}
            </Button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {generatedLink && generatedPassword && (
            <div className="space-y-4">
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 dark:text-red-300">
                  <strong>CRITICAL: Save your password immediately!</strong>
                  <br />
                  Your secure password is shown below. This is the ONLY time you'll see it. If you lose it, there's no
                  way to recover it. You'll need both your affiliate code and this password to access your stats.
                </AlertDescription>
              </Alert>

              <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
                <CardHeader>
                  <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Your Secure Password
                  </CardTitle>
                  <CardDescription className="text-yellow-700 dark:text-yellow-300">
                    Save this password in a secure location. You cannot recover it if lost.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded border">
                    <code className="flex-1 text-sm font-mono">
                      {showPassword ? generatedPassword : "•".repeat(32)}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowPassword(!showPassword)}
                      className="flex items-center gap-1"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyPasswordToClipboard}
                      className="flex items-center gap-1 bg-transparent"
                    >
                      {passwordCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {passwordCopied ? "Copied!" : "Copy"}
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="password-saved"
                      checked={passwordSaved}
                      onChange={(e) => setPasswordSaved(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="password-saved" className="text-sm text-yellow-700 dark:text-yellow-300">
                      I have saved my password in a secure location and understand it cannot be recovered if lost
                    </label>
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-700 dark:text-green-300 text-sm font-medium mb-2">
                  Your affiliate link has been generated!
                </p>
                <div className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded border">
                  <code className="flex-1 text-sm">https://{generatedLink}</code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                    className="flex items-center gap-1 bg-transparent"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://${generatedLink}`, "_blank")}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Test
                  </Button>
                </div>
              </div>

              {passwordSaved && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300 text-sm font-medium mb-2">
                    Ready to track your stats?
                  </p>
                  <Button onClick={() => window.open("/affiliate/login", "_blank")} className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Access Affiliate Dashboard
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
