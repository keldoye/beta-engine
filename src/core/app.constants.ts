import { AuthConstants } from "src/auth/auth.constants";

export class AppConstants {
	private constructor() { }

	static readonly APP_GLOBAL_PREFIX = 'api';

	// Swagger
	static readonly SWAGGER_TITLE = 'Supernova backend API';
	static readonly SWAGGER_DESCPTION = `API pour l'utilisation du backend de l'application de gestion des opérations de l'entreprise fictive Construction Supernova. Utilisé dans le cadre de la simulation de stage du groupe 1071.`;
	static readonly SWAGGER_VERSION = process.env.npm_package_version as string;
	static readonly SWAGGER_ACCES_TOKEN = AuthConstants.ACCESS_TOKEN_TYPE;
	static;
}
