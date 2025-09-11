import express , {type Express} from 'express';
import productRoutes from './routes/product-routes';
import { errorHandler } from './middlewares/error-handler';

const app:Express = express();

app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;