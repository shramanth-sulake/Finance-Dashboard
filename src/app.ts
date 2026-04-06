import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Apply security headers
app.use(helmet());

// Apply CORS policy
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Apply global rate limiting to all requests
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Load Swagger document
const swaggerDocument = YAML.load(path.join(__dirname, './docs/swagger.yaml'));

// Expose API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// System API Routes
app.use('/api', routes);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../public')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });
}

// Global Error Handler
app.use(errorHandler);

export default app;
