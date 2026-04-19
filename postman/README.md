# Documentation API Postman

Cette documentation contient une collection Postman pour tester l'API Supernova.

## Configuration

1. Importez la collection `supernova-api.postman_collection.json` dans Postman
2. Importez l'environnements `development.postman_environment.json` dans Postman
   - `development.postman_environment.json` pour le développement local
3. Les variables nécessaires sont déjà configurées :
   - `base_url` : URL de base de l'API
   - `jwt_token` : Token JWT (sera automatiquement rempli après authentification)

## Authentification

Utilisez d'abord l'endpoint `Auth/Sign In` pour vous connecter avec vos identifiants

- Le token est automatiquement sauvegardé dans les variables d'environnement après une connexion réussie.
