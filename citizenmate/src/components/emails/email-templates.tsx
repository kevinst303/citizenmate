interface EmailProps {
  userName?: string;
  unsubscribeUrl?: string;
  questionsCount?: number;
  daysLeft?: number;
  refereeName?: string;
}

export function InactivityEmail({
  userName = 'Mate',
  unsubscribeUrl = '#',
}: EmailProps) {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ background: '#006d77', padding: '24px', borderRadius: '12px 12px 0 0', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', margin: 0 }}>We miss you, mate!</h1>
      </div>
      <div style={{ background: '#fff', padding: '32px 24px', border: '1px solid #e5e7eb', borderRadius: '0 0 12px 12px' }}>
        <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.6 }}>
          Hey {userName}, it's been a few days since your last practice session. 
          The citizenship test is all about consistency — even 5 minutes a day makes a big difference.
        </p>
        <a
          href={process.env.NEXT_PUBLIC_SITE_URL || 'https://citizenmate.com.au'}
          style={{
            display: 'inline-block',
            background: '#006d77',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            marginTop: '16px',
          }}
        >
          Jump back in →
        </a>
        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '24px 0' }} />
        <p style={{ fontSize: '12px', color: '#9ca3af' }}>
          <a href={unsubscribeUrl} style={{ color: '#9ca3af' }}>Unsubscribe</a>
        </p>
      </div>
    </div>
  );
}

export function MilestoneEmail({
  userName = 'Mate',
  questionsCount = 100,
  unsubscribeUrl = '#',
}: EmailProps) {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ background: '#b45309', padding: '24px', borderRadius: '12px 12px 0 0', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', margin: 0 }}>Incredible work! {questionsCount} questions answered!</h1>
      </div>
      <div style={{ background: '#fff', padding: '32px 24px', border: '1px solid #e5e7eb', borderRadius: '0 0 12px 12px' }}>
        <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.6 }}>
          {userName}, you've just answered {questionsCount} questions in CitizenMate! 
          That's serious dedication. Keep this momentum going and you'll be test-ready in no time.
        </p>
        <a
          href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://citizenmate.com.au'}/practice`}
          style={{
            display: 'inline-block',
            background: '#b45309',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            marginTop: '16px',
          }}
        >
          Start a Practice Test →
        </a>
        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '24px 0' }} />
        <p style={{ fontSize: '12px', color: '#9ca3af' }}>
          <a href={unsubscribeUrl} style={{ color: '#9ca3af' }}>Unsubscribe</a>
        </p>
      </div>
    </div>
  );
}

export function ReferralEmail({
  userName = 'Mate',
  refereeName = 'a mate',
  unsubscribeUrl = '#',
}: EmailProps) {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ background: '#7c3aed', padding: '24px', borderRadius: '12px 12px 0 0', textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '24px', margin: 0 }}>Your mate just qualified! 🎉</h1>
      </div>
      <div style={{ background: '#fff', padding: '32px 24px', border: '1px solid #e5e7eb', borderRadius: '0 0 12px 12px' }}>
        <p style={{ fontSize: '16px', color: '#374151', lineHeight: 1.6 }}>
          Hey {userName}, {refereeName} signed up via your referral link and just qualified! 
          We've added 7 bonus days to your premium access.
        </p>
        <a
          href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://citizenmate.com.au'}/dashboard`}
          style={{
            display: 'inline-block',
            background: '#7c3aed',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 600,
            marginTop: '16px',
          }}
        >
          View Dashboard →
        </a>
        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '24px 0' }} />
        <p style={{ fontSize: '12px', color: '#9ca3af' }}>
          <a href={unsubscribeUrl} style={{ color: '#9ca3af' }}>Unsubscribe</a>
        </p>
      </div>
    </div>
  );
}
