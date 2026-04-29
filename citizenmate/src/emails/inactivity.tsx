import * as React from 'react';
import { Html, Head, Body, Container, Text, Button, Preview, Section } from '@react-email/components';

interface InactivityEmailProps {
  userName: string;
}

export const InactivityEmail = ({ userName = 'Mate' }: InactivityEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>We miss you! Come back and practice for your Australian Citizenship test.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>G'day {userName},</Text>
          <Text style={paragraph}>
            It's been a few days since your last practice session. Consistent study is the key to passing your Australian Citizenship test!
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href="https://citizenmate.com.au/practice">
              Resume Practice
            </Button>
          </Section>
          <Text style={footer}>
            No worries if you're busy, but we'll be right here when you're ready to get back into it.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default InactivityEmail;

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
