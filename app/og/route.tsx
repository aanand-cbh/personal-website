import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'My Blog'
    
    // Font
    const inter = await fetch(
      new URL('https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap', request.url)
    ).then((res) => res.arrayBuffer())

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            backgroundImage: 'linear-gradient(to bottom right, #f59e0b, #10b981)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: '20px',
              margin: '20px',
              padding: '40px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              width: '80%',
              maxWidth: '1200px',
            }}
          >
            <h1
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #f59e0b, #10b981)',
                backgroundClip: 'text',
                color: 'transparent',
                lineHeight: 1.2,
                textAlign: 'center',
                fontFamily: 'Inter',
                padding: '20px',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '24px',
                color: '#4b5563',
                marginTop: '20px',
                fontFamily: 'Inter',
              }}
            >
              Kaivlya's Blog
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error(error)
    return new Response(`Failed to generate image`, {
      status: 500,
    })
  }
} 