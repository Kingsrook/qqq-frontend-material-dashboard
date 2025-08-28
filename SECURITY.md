# Security Policy

## Supported Versions

This repository contains the **frontend dashboard application** for the QQQ framework. Security updates are coordinated with the main QQQ framework releases.

| Version | Supported          |
| ------- | ------------------ |
| 0.26.x  | :white_check_mark: |
| 0.25.x  | :white_check_mark: |
| < 0.25  | :x:                |

## Reporting a Vulnerability

**⚠️ IMPORTANT: All security vulnerabilities should be reported to the main QQQ repository, not this frontend component repository.**

### Where to Report

**Please report security vulnerabilities here:**
👉 **[https://github.com/Kingsrook/qqq/security/advisories](https://github.com/Kingsrook/qqq/security/advisories)**

### Why Report to Main Repository?

This repository is a **frontend component** that runs on top of the QQQ framework. Security vulnerabilities may affect:
- The QQQ server and backend
- Core framework functionality
- API endpoints and data handling
- Authentication and authorization systems
- Database operations

The main QQQ repository coordinates security responses across all components.

### What to Include

When reporting a security vulnerability, please include:

1. **Description**: Clear description of the vulnerability
2. **Impact**: Potential impact on users or systems
3. **Steps to Reproduce**: Detailed steps to reproduce the issue
4. **Environment**: QQQ version, operating system, browser (if frontend-related)
5. **Proof of Concept**: Code or examples demonstrating the vulnerability
6. **Suggested Fix**: If you have ideas for fixing the issue

### Response Timeline

- **Initial Response**: Within 48 hours
- **Assessment**: Within 7 days
- **Fix Development**: Varies based on complexity
- **Public Disclosure**: Coordinated with security researchers

### Responsible Disclosure

We follow responsible disclosure practices:
- **No public disclosure** until a fix is available
- **Credit given** to security researchers
- **Coordinated release** of security updates
- **CVE assignment** for significant vulnerabilities

## Security Updates

### Frontend Security Updates

Security updates for this frontend component are released through:
- **NPM packages**: Regular security updates
- **GitHub releases**: Tagged security releases
- **Main QQQ releases**: Coordinated with framework updates

### Dependencies

This frontend component uses several dependencies that are regularly updated for security:
- **React**: Latest security patches
- **Material-UI**: Security updates from MUI team
- **Other packages**: Regular security audits and updates

## Best Practices

### For Developers

- **Keep dependencies updated**: Regular `npm audit` and updates
- **Follow security guidelines**: Use HTTPS, validate inputs
- **Report suspicious activity**: Contact security team immediately
- **Use security tools**: ESLint security rules, dependency scanning

### For Users

- **Keep updated**: Use latest stable versions
- **Monitor releases**: Watch for security announcements
- **Report issues**: Contact security team for vulnerabilities
- **Follow guidelines**: Use recommended security practices

## Contact Information

### Security Team

- **Email**: security@kingsrook.com
- **PGP Key**: Available upon request
- **Main Repository**: [https://github.com/Kingsrook/qqq](https://github.com/Kingsrook/qqq)

### Emergency Contacts

For critical security issues requiring immediate attention:
- **Company**: Kingsrook, LLC
- **Phone**: Available through company contact
- **Response Time**: Within 24 hours for critical issues

---

**Remember**: This is a frontend component. For security issues affecting the QQQ framework, report to: https://github.com/Kingsrook/qqq/security/advisories
