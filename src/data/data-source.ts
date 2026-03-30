import 'dotenv/config';
import { DataSource } from 'typeorm';
import { DatabaseEntities } from './db.entities';
import { DataConstants as C } from './data.constants';

export const AppContextDataSource = new DataSource({
	type: C.DB_TYPE,
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PROXY_PORT),
	database: process.env.DB_NAME,
	entities: { ...DatabaseEntities },
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	synchronize: true
});
