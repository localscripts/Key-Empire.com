import { NextResponse } from "next/server"

export const maxDuration = 30 // Allow streaming responses up to 30 seconds

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json()

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required." }, { status: 400 })
    }

    const externalApiUrl = "https://api.voxlis.net/report" // Changed to the new endpoint

    const response = await fetch(externalApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    })

    if (!response.ok) {
      let errorData: any
      try {
        errorData = await response.json()
      } catch (e) {
        // If response is not JSON (e.g., HTML error page), read as text
        errorData = await response.text()
      }

      console.error("External API error:", response.status, errorData)

      return NextResponse.json(
        {
          error: errorData.message || errorData || `Failed to send report to external API. Status: ${response.status}`,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("Error in /api/report:", error)
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 })
  }
}
