# Projet React M2 - API

Ce projet est réalisé par avotra-saotra-serge-tafita-zoulfikar.

## Installation

1. **Cloner le dépôt** :

```bash
git clone git@github.com:Tafita007/student_management.git
```

2. **Installer les dépendances** :

```bash
npm install
```

## Configuration

Le projet utilise des variables d'environnement pour fonctionner.

1. Copier le fichier `.env.example` pour créer un fichier `.env` :

```bash
cp .env.example .env
```

2. Compléter les variables dans le fichier `.env` :

```
PORT=8010
MONGO_DB_URL=url-de-votre-instance-mongodb-atlas
CLIENT_URL=url-du-frontend
```

## Démarrage du projet

Pour démarrer le serveur en mode développement :

```bash
npm start
```

Le serveur sera accessible à l'adresse : `http://localhost:<PORT>`

## Déploiement

Le projet est déployé sur **Render** (Free Tier).

### URL du serveur

👉 [https://student-management-lkg7.onrender.com](https://student-management-lkg7.onrender.com)

**Remarque :**

- Comme Render utilise un **free tier**, le serveur peut être temporairement en veille.
- En cas d'indisponibilité, merci de patienter 5 à 10 minutes et de rafraîchir la page.