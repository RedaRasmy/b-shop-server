import express , {type Express} from 'express';
import productsRoutes from './routes/product-routes';
import categoriesRoutes from './routes/categorie-routes'
import { errorHandler } from './middlewares/error-handler';
import { notFound } from './middlewares/not-found';

const app:Express = express();

app.use(express.urlencoded({extended:true}))
app.use(express.json());

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/categories',categoriesRoutes)

app.use(notFound)
// Global error handler (should be after routes)
app.use(errorHandler);

export default app;