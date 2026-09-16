import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { execFile } from 'child_process';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { SEEDED_STAFF_ADMINS } from './src/services/firestoreDbService';

dotenv.config();

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    });
  } catch (err) {
    console.error('Failed to initialize Firebase Admin', err);
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGIN || 'https://agriseva.gov.in' : '*',
  methods: ['GET', 'POST']
}));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Server misconfiguration: JWT_SECRET is not set in environment');
  return secret;
};

const authenticateSession = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.cookies.spo_session;
    if (!token) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    const decoded = jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired session' });
  }
};

const requireRole = (allowedRoles: string[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user;
    if (!user || !user.role) {
      return res.status(401).json({ success: false, error: 'Unauthorized: No valid role found' });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden: Insufficient privileges' });
    }
    next();
  };
};

const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 OTP requests per window
  message: { error: 'Too many OTP requests from this IP, please try again after 15 minutes' }
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 verification attempts per window
  message: { error: 'Too many verification attempts, please try again later' }
});

// In-memory OTP storage for SMTP authentication
interface OtpEntry {
  code: string;
  expiresAt: number;
  verified: boolean;
}
const emailOtpStore = new Map<string, OtpEntry>();

// Clean up expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, entry] of emailOtpStore.entries()) {
    if (entry.expiresAt < now) {
      emailOtpStore.delete(email);
    }
  }
}, 5 * 60 * 1000);

// API 1: Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API 2: Send SMTP OTP
app.post('/api/auth/send-smtp-otp', otpSendLimiter, async (req, res) => {
  try {
    const { email, fullName } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    // Generate 6-digit numeric OTP code cryptographically
    const otpCode = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes validity

    emailOtpStore.set(cleanEmail, {
      code: otpCode,
      expiresAt,
      verified: false
    });

    let smtpSent = false;
    let smtpError: string | null = null;

    // Check if SMTP environment credentials are configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpFrom = process.env.SMTP_FROM || 'AgriSeva Mandi Portal <noreply@agriseva.gov.in>';

    if (smtpHost && smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: process.env.SMTP_SECURE === 'true' || smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        await transporter.sendMail({
          from: smtpFrom,
          to: cleanEmail,
          subject: 'कृषि सेवा - लॉगिन सत्यापन कोड (AgriSeva OTP Verification)',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; border: 1px solid #c7dcd1; border-radius: 12px; background: #fbfdfc;">
              <h2 style="color: #063b2a; margin-top: 0;">राष्ट्रीय ई-मंडी कृषि उपार्जन पोर्टल</h2>
              <p style="color: #333; font-size: 14px;">नमस्ते <strong>${fullName || 'किसान भाई'}</strong>,</p>
              <p style="color: #4a6e5e; font-size: 13px;">आपके कृषि सेवा पोर्टल में लॉगिन अथवा खाता सत्यापन हेतु आपका 6-अंकीय ओटीपी (One-Time Password) निम्न है:</p>
              <div style="text-align: center; margin: 24px 0;">
                <span style="display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 12px 28px; background: #e7f7ef; color: #0b5d3b; border: 2px dashed #168a5b; border-radius: 8px;">
                  ${otpCode}
                </span>
              </div>
              <p style="color: #666; font-size: 12px; margin-bottom: 0;">यह कोड अगले 10 मिनट तक मान्य है। कृपया इसे किसी के साथ साझा न करें।</p>
              <hr style="border: none; border-top: 1px solid #e2ece7; margin: 20px 0;" />
              <p style="color: #888; font-size: 11px;">AgriSeva • National e-Governance Plan • Government of India</p>
            </div>
          `
        });
        smtpSent = true;
      } catch (err: any) {
        console.warn('SMTP Send Warning:', err.message);
        smtpError = err.message;
      }
    }

    res.json({
      success: true,
      message: smtpSent 
        ? `Verification code dispatched to ${cleanEmail} via SMTP` 
        : `Verification code generated for ${cleanEmail}`,
      smtpConfigured: Boolean(smtpHost && smtpUser && smtpPass),
      smtpDelivered: smtpSent,
      ...(process.env.NODE_ENV === 'development' ? { previewOtp: otpCode } : {}),
      expiresInMinutes: 10
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// API 3: Verify SMTP OTP
app.post('/api/auth/verify-smtp-otp', otpVerifyLimiter, (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: 'Email and verification code are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();
    const record = emailOtpStore.get(cleanEmail);

    if (!record) {
      return res.status(400).json({ success: false, error: 'No active OTP request found for this email. Please request a new code.' });
    }

    if (Date.now() > record.expiresAt) {
      emailOtpStore.delete(cleanEmail);
      return res.status(400).json({ success: false, error: 'The verification code has expired. Please request a fresh code.' });
    }

    if (record.code !== cleanCode) {
      return res.status(400).json({ success: false, error: 'Invalid verification code. Please check and try again.' });
    }

    record.verified = true;
    emailOtpStore.delete(cleanEmail);

    const token = jwt.sign(
      { email: cleanEmail, role: 'farmer' },
      getJwtSecret(),
      { expiresIn: '12h' }
    );

    res.cookie('spo_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 12 * 60 * 60 * 1000 // 12 hours
    });

    return res.json({
      success: true,
      message: 'Email successfully verified',
      email: cleanEmail
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Verification failed' });
  }
});

// API 4: Python + Pandas + Scikit-Learn Dynamic Queue Reallocation & Service Time Predictor
app.post('/api/ml/reallocate-and-predict', authenticateSession, requireRole(['supervisor', 'superadmin']), (req, res) => {
  try {
    const { tokens, counters } = req.body;
    
    // Strict Input Validation
    if (!tokens || !Array.isArray(tokens)) {
      return res.status(400).json({ error: 'Invalid input: tokens must be an array' });
    }
    if (tokens.length > 1000) {
      return res.status(400).json({ error: 'Payload too large: maximum 1000 tokens allowed' });
    }
    const safeCounters = Number.isInteger(counters) && counters > 0 && counters <= 50 ? counters : 4;

    const pythonScriptPath = path.join(process.cwd(), 'ml', 'dynamic_allocator.py');
    const inputPayload = JSON.stringify({
      tokens: tokens,
      counters: safeCounters
    });

    execFile('python3', [pythonScriptPath, inputPayload], { maxBuffer: 1024 * 1024 * 5 }, (error, stdout, stderr) => {
      if (error) {
        // Safe server-side logging without exposing stack traces to client
        console.error('Python ML execution error:', error.message);
        return res.status(500).json({
          status: 'error',
          message: 'Prediction service temporarily unavailable due to internal error.'
        });
      }

      try {
        const parsed = JSON.parse(stdout.trim());
        return res.json(parsed);
      } catch (parseErr) {
        console.error('Failed to parse Python ML stdout');
        return res.status(500).json({
          status: 'error',
          message: 'Invalid response from prediction engine.'
        });
      }
    });
  } catch (err: any) {
    console.error('ML endpoint error:', err.message);
    return res.status(500).json({ error: 'ML prediction request failed unexpectedly' });
  }
});

// API 5: Verify Session
app.get('/api/auth/verify-session', authenticateSession, (req, res) => {
  const user = (req as any).user;
  res.json({ 
    success: true, 
    authenticated: true,
    user: {
      userId: user.userId || user.email,
      role: user.role,
      email: user.email
    } 
  });
});

// API 6: Logout
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('spo_session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

// API 7: Staff Login
const staffLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Too many login attempts' }
});

app.post('/api/auth/staff-login', staffLoginLimiter, async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(401).json({ error: 'Missing token' });

    if (!getApps().length) {
      return res.status(500).json({ error: 'Server authentication misconfigured' });
    }

    const decodedToken = await getAuth().verifyIdToken(idToken);
    const email = decodedToken.email;
    if (!email) return res.status(401).json({ error: 'Token missing email' });

    const staffRecord = SEEDED_STAFF_ADMINS.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (!staffRecord) {
      return res.status(403).json({ error: 'Unauthorized staff identity' });
    }

    const token = jwt.sign(
      { email: staffRecord.email, role: staffRecord.role, userId: staffRecord.staffId },
      getJwtSecret(),
      { expiresIn: '12h' }
    );

    res.cookie('spo_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 12 * 60 * 60 * 1000
    });

    return res.json({ success: true, role: staffRecord.role, email: staffRecord.email });
  } catch (err: any) {
    return res.status(401).json({ error: 'Invalid staff token' });
  }
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriSeva Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
