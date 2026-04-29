import * as React from 'react';
import { Html, Head, Body, Container, Text, Button, Preview, Section } from '@react-email/components';

interface ReferralEmailProps {
  userName: string;
}

export const ReferralEmail = ({ userName = 'Mate' }: ReferralEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>A mate joined! We've added 7 days of Premium to your account.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Legend, {userName}!</Text>
          <Text style={paragraph}>
            A mate you referred just signed up. As a thank you, we've extended your Premium access by 7 days!
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href="https://citizenmate.com.au/dashboard">
              Check Dashboard
            </Button>
          </Section>
          <Text style={footer}>
            You can refer up to 5 friends. Keep sharing your link to earn more Premium time.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReferralEmail;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '400',
  color: '#484848',
  padding: '17px 0 0',
};

const paragraph = {
  margin: '0 0 15px',
  fontSize: '15px',
  lineHeight: '1.4',
  color: '#3c4149',
};

const btnContainer = {
  padding: '27px 0 27px',
};

const button = {
  backgroundColor: '#006d77',
  borderRadius: '3px',
  fontWeight: '600',
  color: '#fff',
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '11px 23px',
};

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px',
};
