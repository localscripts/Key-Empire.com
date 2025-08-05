import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json()

    if (!title || !description) {
      return new NextResponse(JSON.stringify({ error: "Title and description are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const externalReportEndpoint = "https://api.voxlis.net/report"

    const externalResponse = await fetch(externalReportEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    })

    // Check if the external response was successful
    if (!externalResponse.ok) {
      let errorDetails = "Failed to forward report to external backend."
      const contentType = externalResponse.headers.get("content-type")

      // Try to parse error as JSON if content type is JSON
      if (contentType && contentType.includes("application/json")) {
        try {
          const errorData = await externalResponse.json()
          errorDetails = errorData.error || JSON.stringify(errorData)
        } catch (jsonError) {
          // If JSON parsing fails, treat as plain text
          const errorBody = await externalResponse.text()
          errorDetails = `External API returned non-JSON error: ${errorBody.substring(0, 100)}...`
        }
      } else {
        // If not JSON, read as text
        const errorBody = await externalResponse.text()
        errorDetails = `External API returned non-JSON error: ${errorBody.substring(0, 100)}...`
      }

      console.error(`Error forwarding to external API: Status=${externalResponse.status}, Details=${errorDetails}`)
      return new NextResponse(
        JSON.stringify({
          error: `Failed to send report. ${errorDetails}`,
          status: externalResponse.status,
        }),
        { status: externalResponse.status, headers: { "Content-Type": "application/json" } },
      )
    }

    // If external response is OK, parse its JSON and return it
    const externalData = await externalResponse.json()
    return NextResponse.json(externalData)
  } catch (error: any) {
    console.error("Error in /report route:", error)
    return new NextResponse(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
