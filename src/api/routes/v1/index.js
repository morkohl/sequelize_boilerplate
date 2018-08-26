const express = require('express');
const indexRoute = require('./index.route');
const userRoutes = require('./user.route');
const taskRoutes = require('./task.route');
const authRoutes = require('./auth.route');

const router = express.Router();

router.use('/', indexRoute);
router.use('/users', userRoutes);
router.use('/tasks', taskRoutes);
router.use('/auth', authRoutes);

module.exports = router;