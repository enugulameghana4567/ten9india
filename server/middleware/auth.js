// ─────────────────────────────────────────────────────────────────────────────
// server/middleware/auth.js
// ─────────────────────────────────────────────────────────────────────────────
const jwt    = require('jsonwebtoken');
const Helper = require('../models/Helper');

// ─────────────────────────────────────────────────────────────────────────────
//  protect  —  verifies JWT, attaches req.user and req.role
// ─────────────────────────────────────────────────────────────────────────────
exports.protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — please log in' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ten9secret');

    if (decoded.role === 'owner') {
      // ── Owner: no DB lookup needed — owner is defined in .env only ─────────
      req.user = {
        id:    'owner_static',
        name:  'Ten9 Owner',
        email: process.env.OWNER_EMAIL || 'ten9india@gmail.com',
        role:  'owner'
      };
    } else {
      // ── Helper: look up from database ──────────────────────────────────────
      const helper = await Helper.findById(decoded.id).select('-password');
      if (!helper) {
        return res.status(401).json({ message: 'Helper account not found' });
      }
      req.user = helper;
    }

    req.role = decoded.role;
    next();

  } catch (err) {
    console.error('❌ JWT verification error:', err.message);
    return res.status(401).json({ message: 'Session expired or invalid — please log in again' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  ownerOnly  —  use AFTER protect; blocks non-owner requests
// ─────────────────────────────────────────────────────────────────────────────
exports.ownerOnly = (req, res, next) => {
  if (req.role !== 'owner') {
    return res.status(403).json({ message: 'Access denied — Owner only' });
  }
  next();
};
