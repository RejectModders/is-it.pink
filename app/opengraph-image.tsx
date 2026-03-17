import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'is it pink? - The Color Guessing Game'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
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
          background: 'linear-gradient(135deg, #faf5f8 0%, #fce7f3 50%, #fbcfe8 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Color swatches in background */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            width: 120,
            height: 120,
            borderRadius: 24,
            background: '#ec4899',
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 100,
            right: 100,
            width: 80,
            height: 80,
            borderRadius: 16,
            background: '#a855f7',
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 150,
            width: 100,
            height: 100,
            borderRadius: 20,
            background: '#f472b6',
            opacity: 0.3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            right: 200,
            width: 140,
            height: 140,
            borderRadius: 28,
            background: '#ff6b9d',
            opacity: 0.3,
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              background: 'linear-gradient(135deg, #ec4899, #db2777)',
              boxShadow: '0 20px 60px rgba(236, 72, 153, 0.4)',
            }}
          />
          <div
            style={{
              fontSize: 90,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #ec4899, #db2777)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            is it pink?
          </div>
        </div>

        <div
          style={{
            fontSize: 36,
            color: '#a8687f',
            marginBottom: 50,
          }}
        >
          The Color Guessing Game
        </div>

        {/* Color preview boxes */}
        <div style={{ display: 'flex', gap: 20 }}>
          {['#ec4899', '#a855f7', '#f472b6', '#06b6d4', '#db2777'].map((color, i) => (
            <div
              key={i}
              style={{
                width: 80,
                height: 80,
                borderRadius: 16,
                background: color,
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              }}
            />
          ))}
        </div>

        {/* Bottom text */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#a8687f',
            fontSize: 24,
          }}
        >
          is-it.pink
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
