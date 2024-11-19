const express = require('express');
const router = express.Router();
const adminRoutes = require('./api/admin');
const userRoutes = require('./api/user');

router.use("/admin", adminRoutes);
router.use("/mobileApi", userRoutes);

module.exports = router;