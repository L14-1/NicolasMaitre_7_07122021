# Groupomania social network

## Introduction

Bienvenue sur mon 7ème projet de la fromation développeur Web.
Groupomania est un réseau social d'entreprise où vous pouvez créer votre compte pour ensuite discuter avec les autres membres de votre entreprise au travers d'un système de message sur un mur géant.

Pour ce projet j'ai utilisé les technologies suivantes :

- Frontend : 
    - Vue.js
    - Vuex
- Backend :
    - Node.js
    - Express
    - sequelize
    - Multer
- Base de données :
    - Mysql

## Backend

Accédez au dossier backend pour créer un fichier ".env" que vous remplirez comme suit :

USER=(votre username)
PASSWORD=(votre mot de passe)

puis exécutez, dans votre terminal, la commande :
```console
    npm install
```
et ensuite :
```console
    nodemon server
```

et enfin pour initialiser la base de donnée :
```console
    sequelize db:create
```
```console
    sequelize db:migrate
```

## Frontend

Accédez au dossier Groupomania puis exécutez, dans votre terminal, la commande :
```console
    npm install
```

puis :
```console
    npm run serve
```

enfin accédez au réseau social via : <http://localhost:8080/>

## Fonctionnement

### Connexion
Connectez vous à l'aide de vos identifiants ou cliquez sur ***créer un compte*** puis renseignez vos informations.
L'adresse mail doit être une adresse mail valide et le mot de passe doit contenir 4 à 8 caractères dont au moins 1 chiffre.

### Votre profil
Une fois connecté vous serez redirigé sur votre profil.
Vous pouvez modifier depuis cette page : 
- Votre photo de profil
- Votre prénom, nom
- votre bio

et supprimer votre compte (définitivement).

Cliquez sur le logo ***Groupomania*** pour accéder au fil d'actualité.

### Fil d'actu

Sur cette page vous pouvez créer et publier un nouveau post en cliquant sur le ***crayon***.
- Le message posté sera visible de tout les utilisateurs sur le fil d'actu.
- Vous pouvez modifier ou supprimer votre post.

Sur tout les posts présents sur le fil d'actu vous pouvez :
- Commenter et/ou liker
- supprimer/modifier votre commentaite et enlever votre mention like

### L'administrateur

Pour donner des droits administrateur à un utilisateur, munissez vous de l'id de l'utilisateur en question puis dans votre terminal MySql connecté à votre base de donnée saisissez :

```console
    UPDATE users SET isAdmin = 1 WHERE id=(id de l'utilisateur);
```

L'administrateur peut supprimer n'importe quel utilisateur, post et commentaire.