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

  // Check if the response is OK and if it's JSON
  const contentType = externalResponse.headers.get("content-type")
  if (!externalResponse.ok || !contentType || !contentType.includes("application/json")) {
    const errorBody = await externalResponse.text() // Read as text if not JSON or not OK
    console.error(`Error forwarding to external API: Status=${externalResponse.status}, Body=${errorBody}`)
    return new NextResponse(
      JSON.stringify({
        error: `Failed to forward report to external backend. Received unexpected response.`,
        details: externalResponse.statusText || "Unknown Error",
      }),
      { status: externalResponse.status, headers: { "Content-Type": "application/json" } },
    )
  }

  const externalData = await externalResponse.json()
  return NextResponse.json(externalData)
} catch (error: any) {
  console.error("Error in /api/report route:", error)
  return new NextResponse(JSON.stringify({ error: "Internal Server Error", details: error.message }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  })
}
}
