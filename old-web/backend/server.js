require('dotenv').config();
const app = require('./src/app');
const port = process.env.PORT ?? 3000;

const startServer = async () => {
    try {
        try {
            const sslOptions = {
                key: require('fs').readFileSync(process.env.SSL_KEY_PATH || './private.key'),
                cert: require('fs').readFileSync(process.env.SSL_CERT_PATH || './cert.crt')
            };

            const https = require('https');
            const server = https.createServer(sslOptions, app);

            server.listen(port, () => {
                console.log(`🚀 Production HTTPS server listening on port ${port}`);
            });

            server.on('error', (error) => {
                if (error.code === 'ENOENT') {
                    console.log('SSL certificates not found, starting HTTP server...');
                    startHttpServer();
                } else {
                    console.log('HTTPS server error', { error: error.message });
                    process.exit(1);
                }
            });

        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('SSL certificates not found, starting HTTP server...');
                startHttpServer();
            } else {
                console.log('SSL configuration error', { error: error.message });
                startHttpServer();
            }
        }

    } catch (error) {
        console.log('Server startup failed', { error: error.message });
        process.exit(1);
    }
};

const startHttpServer = () => {
    const server = app.listen(port, () => {
        console.log(`🚀 Development HTTP server listening on port ${port}`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(`Port ${port} is already in use. Please:`, {
                port,
                suggestions: [
                    `1. Stop the process using port ${port}: lsof -ti:${port} | xargs kill -9`,
                    `2. Or use a different port: PORT=3001 npm run dev`
                ]
            });
            process.exit(1);
        } else {
            console.log('HTTP server error', { error: error.message });
            process.exit(1);
        }
    });
};

try {
    const DB = require('./src/configs/database/Db');
    DB.connectDB().then(() => {
        console.log('Database connection established');
        startServer();
    }).catch((error) => {
        console.log('Failed to connect to database', { error: error.message });
        process.exit(1);
    });
} catch (error) {
    console.log('Server startup failed', { error: error.message });
    process.exit(1);
}

process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
