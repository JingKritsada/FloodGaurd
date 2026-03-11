const express = require("express");
const cors = require("cors");
const { serve, setup } = require('./configs/swaggerConfig');
const { errorHandler } = require('./middlewares/errorHandlerMiddleware');
const { requestLogger } = require('./middlewares/requestLoggerMiddleware');
const { apiLimiter, authLimiter } = require('./middlewares/rateLimitMiddleware');

const authRoutes = require("./routes/authRoutes");
const exampleRoutes = require("./routes/exampleRoutes");
const incidentRoutes = require("./routes/incidentRoutes");
const roadRoutes = require("./routes/roadRoutes");
const shelterRoutes = require("./routes/shelterRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

const app = express();

app.use('/api/docs', serve, setup);

if (process.env.ENABLE_REQUEST_LOGGING !== 'false') {
    app.use(requestLogger);
}

if (process.env.ENABLE_RATE_LIMITING !== 'false') {
    app.use(apiLimiter);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.ENABLE_CORS !== 'false') {
    app.use(cors({
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }));
}

if (process.env.ENABLE_RATE_LIMITING !== 'false') {
    app.use('/api/auth', authLimiter, authRoutes);
} else {
    app.use('/api/auth', authRoutes);
}

app.use('/api/examples', exampleRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/roads', roadRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/announcements', announcementRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        code: 404,
        message: 'Route not found',
        error: `Cannot ${req.method} ${req.originalUrl}`
    });
});

app.use(errorHandler);

module.exports = app;
