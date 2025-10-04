import logger from 'src/logger';
import app from './app';
import config from './config/config';

app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`)
});