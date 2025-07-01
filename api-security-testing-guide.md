# API Security Testing Guide - Legal & Ethical Approaches

## 🎯 Setting Up Your Own Vulnerable API for Testing

### Option 1: Docker-based Vulnerable APIs
```bash
# DVWA (Damn Vulnerable Web Application)
docker run --rm -it -p 80:80 vulnerables/web-dvwa

# Juice Shop (Modern vulnerable web app)
docker run --rm -p 3000:3000 bkimminich/juice-shop

# WebGoat (OWASP Learning Platform)
docker run -p 8080:8080 -t webgoat/goatandwolf
```

### Option 2: Local API Security Testing Lab
```javascript
// Create a simple vulnerable Node.js API for testing
const express = require('express');
const app = express();

// Intentionally vulnerable endpoint for testing
app.get('/api/users/:id', (req, res) => {
    const userId = req.params.id; // Vulnerable to injection
    // This is intentionally vulnerable for testing purposes
    const query = `SELECT * FROM users WHERE id = ${userId}`;
    res.json({ query, warning: "This is intentionally vulnerable for testing" });
});

app.listen(3000, () => {
    console.log('Vulnerable test API running on port 3000');
});
```

## 🔍 Common API Vulnerabilities to Test For

### 1. SQL Injection
```bash
# Test payloads (only on your own systems!)
curl "http://localhost:3000/api/users/1' OR '1'='1"
curl "http://localhost:3000/api/users/1; DROP TABLE users--"
```

### 2. NoSQL Injection
```bash
# MongoDB injection examples
curl -X POST -H "Content-Type: application/json" \
-d '{"username": {"$ne": ""}, "password": {"$ne": ""}}' \
http://localhost:3000/api/login
```

### 3. API Rate Limiting
```bash
# Test rate limiting
for i in {1..1000}; do
    curl http://localhost:3000/api/users/1
done
```

### 4. Authentication Bypass
```bash
# Test JWT manipulation
curl -H "Authorization: Bearer invalid.jwt.token" \
http://localhost:3000/api/protected
```

## ⚖️ Ethical Testing Guidelines

### ✅ DO:
- Test only systems you own
- Use designated vulnerable applications
- Participate in legitimate bug bounty programs
- Follow responsible disclosure practices
- Obtain written permission before testing

### ❌ DON'T:
- Test systems without explicit permission
- Attempt to access unauthorized data
- Disrupt services or cause damage
- Share vulnerabilities publicly without proper disclosure
- Ignore terms of service

## 📚 Learning Resources

### Books:
- "The Web Application Hacker's Handbook" by Dafydd Stuttard
- "OWASP Testing Guide"
- "API Security in Action" by Neil Madden

### Online Courses:
- PortSwigger Web Security Academy (Free)
- OWASP WebGoat
- Cybrary API Security courses

### Tools for Legal Testing:
```bash
# Burp Suite Community (Free)
# OWASP ZAP (Free)
# Postman (API testing)
# curl/wget (Command line)
```

## 🎓 Professional Certifications
- **OSCP** (Offensive Security Certified Professional)
- **CEH** (Certified Ethical Hacker)
- **GWEB** (GIAC Web Application Penetration Tester)
- **OSWE** (Offensive Security Web Expert)

---

**Remember**: Always ensure you have explicit permission before testing any system. When in doubt, set up your own vulnerable environment or use designated learning platforms. 