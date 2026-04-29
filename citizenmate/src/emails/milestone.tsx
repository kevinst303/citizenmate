import * as React from 'react';
import { Html, Head, Body, Container, Text, Button, Preview, Section } from '@react-email/components';

interface MilestoneEmailProps {
  userName: string;
  questionsCount: number;
}

export const MilestoneEmail = ({ userName = 'Mate', questionsCount = 100 }: MilestoneEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{`Congrats on answering ${questionsCount} questions!`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Bloody oath, {userName}!</Text>
          <Text style={paragraph}>
            You've just hit a massive milestone: answering {questionsCount} practice questions. 
            You're well on your way to acing the Australian Citizenship test.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href="https://citizenmate.com.au/practice">
              Keep Going
            </Button>
          </Section>
          <Text style={footer}>
            Keep up the great work. We're cheering for you!
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default MilestoneEmail;

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
