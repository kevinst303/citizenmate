import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'CitizenMate — Pass Your Australian Citizenship Test';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 80,
          background: 'linear-gradient(to right, #0C2340, #044569)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', marginBottom: 20 }}>
          <div style={{ backgroundColor: '#fff', color: '#0C2340', fontWeight: 'bold', padding: '10px 40px', borderRadius: 20 }}>
            CM
          </div>
        </div>
        <div style={{ fontWeight: 800 }}>CitizenMate</div>
        <div style={{ fontSize: 40, marginTop: 20, color: '#A3ADC2' }}>
          Pass Your Australian Citizenship Test
        </div>
      </div>
    ),
    { ...size }
  );
}
