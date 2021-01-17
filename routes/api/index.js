const router = require('express').Router();

const thoughtRoutes = require('./thoughts-routes');
const userRoutes = require('./users-routes');

// add prefix of `/comments` to routes created in `comment-routes.js`
router.use('/thought', thoughtRoutes);
// add prefix of `/pizzas` to routes created in `pizza-routes.js`
router.use('/user', userRoutes);

module.exports = router;