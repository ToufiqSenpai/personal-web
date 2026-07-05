import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
} from '@react-email/components'
import * as React from 'react'

interface ContactEmailProps {
  name: string
  email: string
  subject: string
  message: string
}

export const ContactEmail = ({ name, email, subject, message }: ContactEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>New contact message: {subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Contact Form Submission</Heading>
          <Text style={text}>
            You have received a new message from the contact form on your personal website.
          </Text>
          <Section style={section}>
            <Text style={label}>From</Text>
            <Text style={value}>
              {name} ({email})
            </Text>

            <Text style={label}>Subject</Text>
            <Text style={value}>{subject}</Text>

            <Text style={label}>Message</Text>
            <Text style={messageText}>{message}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>This email was sent from the contact form on your website.</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333333',
  fontSize: '22px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
}

const text = {
  color: '#555555',
  fontSize: '15px',
  lineHeight: '24px',
  padding: '0 48px',
}

const section = {
  padding: '0 48px',
}

const label = {
  color: '#888888',
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  fontWeight: 'bold',
  marginTop: '16px',
  marginBottom: '4px',
}

const value = {
  color: '#333333',
  fontSize: '15px',
  marginTop: '0',
  marginBottom: '16px',
}

const messageText = {
  color: '#333333',
  fontSize: '15px',
  lineHeight: '22px',
  whiteSpace: 'pre-wrap' as const,
  backgroundColor: '#f9f9f9',
  padding: '12px',
  borderRadius: '4px',
  border: '1px solid #eeeeee',
  marginTop: '0',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const footer = {
  color: '#888888',
  fontSize: '11px',
  textAlign: 'center' as const,
  padding: '0 48px',
}
