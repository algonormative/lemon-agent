import { createFetch } from './surfaces.js';
import surfaces from './surfaces.generated.js';

export default { fetch: createFetch(surfaces) };
