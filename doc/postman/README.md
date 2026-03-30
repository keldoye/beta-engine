# Documentation API Postman

Cette documentation contient une collection Postman pour tester l'API Supernova.

## Configuration

1. Importez la collection `supernova-api.postman_collection.json` dans Postman
2. Importez les environnements depuis le dossier `environments/`
    - `development.postman_environment.json` pour le développement local
    - `production.postman_environment.json` pour la production
3. Les variables nécessaires sont déjà configurées :
    - `base_url` : URL de base de l'API
    - `jwt_token` : Token JWT (sera automatiquement rempli après authentification)

## Authentification

1. Utilisez d'abord l'endpoint `Auth/Sign In` pour vous connecter avec vos identifiants
    - Le token est automatiquement sauvegardé dans les variables d'environnement après une connexion réussie.

## Endpoints disponibles

### Auth

- `POST /auth` : Connexion utilisateur Sauvegarde automatiquement le token dans la variable d'environnement `jwt_token`
- `GET /auth/profile` : Obtenir le profil de l'utilisateur connecté

### User

- `GET /user` : Obtenir la liste de tous les utilisateurs
- `GET /user/:id` : Obtenir un utilisateur par son ID
- `GET /user/:email` : Obtenir un utilisateur par son email
- `POST /user` : Créer un nouvel utilisateur
- `PUT /user/:id` : Mettre à jour un utilisateur
- `DELETE /user/:id` : Supprimer un utilisateur

## Modèles de données

### SignInDTO

```json
{
	"email": "string",
	"password": "string"
}
```

### CreateUserDTO

```json
{
	"title": "string (optional)",
	"firstName": "string",
	"lastName": "string",
	"email": "string",
	"phone": "string (optional)",
	"dateOfBirth": "date (optional)",
	"role": "string (User, Admin, SU)",
	"password": "string"
}
```

### UpdateUserDTO

```json
{
	"title": "string (optional)",
	"firstName": "string",
	"lastName": "string",
	"email": "string",
	"phone": "string (optional)",
	"dateOfBirth": "date (optional)",
	"role": "string (User, Admin, SU)"
}
```

## Notes importantes

1. Tous les endpoints (sauf `/auth`) nécessitent un token JWT valide
2. Le token est automatiquement inclus dans le header `Authorization` de chaque requête
