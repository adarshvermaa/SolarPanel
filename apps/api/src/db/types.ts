import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export type DrizzleDB = NeonHttpDatabase<typeof schema>;
