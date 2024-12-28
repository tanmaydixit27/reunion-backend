const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret'; // Ensure the secret matches

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' }); // Handle missing token
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET); // Ensure the same secret key used during sign-in
    req.user = decoded; // Attach the user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('JWT verification failed:', err.message); // Log error for debugging
    res.status(401).json({ message: 'Invalid token' }); // Handle invalid token
  }
};

module.exports = authMiddleware;
