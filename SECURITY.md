# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

1. **Do not** create a public GitHub issue
2. Email **hi@empoweryourcore.com** with details
3. Include steps to reproduce the vulnerability
4. Allow 48 hours for an initial response

## Security Measures

This project implements the following security practices:

- **No client-side secrets**: API keys are stored exclusively in server-side environment variables
- **Server-side API routes**: Contact form submissions are processed via Next.js API routes, never exposed to the client
- **Input sanitization**: All form inputs are validated and sanitized before processing
- **HTTPS only**: Enforced via Vercel's automatic SSL provisioning
- **Reduced attack surface**: Static content architecture avoids unnecessary database or session exposure
- **Cache control for critical runtime assets**: `translate.js` and static HTML entry points are served with no-cache headers
- **Dependency auditing**: Regular `yarn npm audit` checks for known vulnerabilities

## Environment Variables

The following environment variables contain sensitive data and must never be committed to version control:

| Variable | Purpose | Required |
|----------|---------|----------|
| `RESEND_API_KEY` | Email delivery for contact form | Yes |

These must be configured in the Vercel dashboard under **Settings > Environment Variables**.
