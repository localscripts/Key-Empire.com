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

    // The report will now be sent directly to api.voxlis.net/report
    const externalReportEndpoint = "https://api.voxlis.net/report"

    const externalResponse = await fetch(externalReportEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    })

    if (!externalResponse.ok) {
      const externalErrorText = await externalResponse.text()
      console.error(`Error forwarding to external API: Status=${externalResponse.status}, Body=${externalErrorText}`)
      return new NextResponse(
        JSON.stringify({
          error: `Failed to forward report to external backend: ${externalResponse.statusText}`,
          details: externalErrorText,
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
