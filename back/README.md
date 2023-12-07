## Technologies Utilisées

- [Express](https://expressjs.com/): Framework web pour Node.js.
- [MongoDB](https://www.mongodb.com/): Base de données NoSQL.
- [Mongoose](https://mongoosejs.com/): ODM (Object Data Modeling) pour MongoDB.
- [bcrypt](https://www.npmjs.com/package/bcrypt): Pour le hachage des mots de passe.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): Pour la gestion des tokens JWT.

## Installation

1. Clonez ce dépôt.
2. Exécutez `npm install` pour installer les dépendances.
3. Configurez les variables d'environnement, le cas échéant.

## Configuration

Créez un fichier `.env` à la racine du projet et configurez les variables suivantes :

``` Dotenv
SECRET_KEY=your_secret_key_for_jwt

## Routes

### GET /api/users

Récupère tous les utilisateurs.

### GET /api/users/:id

Récupère un utilisateur par ID.

### POST /api/users

Crée un nouvel utilisateur.

### PUT /api/users/:id

Met à jour un utilisateur par ID.

### DELETE /api/users/:id

Supprime un utilisateur par ID.

### POST /api/login

Authentification de l'utilisateur et renvoie un JWT token.

### POST /api/register

Inscription d'un nouvel utilisateur et renvoie un JWT token.
