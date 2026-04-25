import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { domain, days = 30 } = await request.json()

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 })
    }

    console.log('Analyzing domain:', domain, 'for days:', days)

    // Call the Python FastAPI endpoint
    const response = await fetch('http://127.0.0.1:8000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain, days }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.detail || 'Failed to analyze domain' },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Analysis successful:', data.message)

    return NextResponse.json(data)
  } catch (error) {
    console.error('Analysis error:', error)
    
    // Check if it's a connection error (Python API not running)
    if ((error as Error).message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { 
          error: 'Python API server is not running. Please start the FastAPI server with: python api_server.py' 
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Analysis failed: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
