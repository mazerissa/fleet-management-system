# Système de gestion de flotte

[![Licence : MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Statut Build](https://img.shields.io/badge/build-development-orange.svg)]()
[![PRs Bienvenues](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)]()
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)]()

> Une plateforme moderne de gestion de flotte pour surveiller les véhicules, les employés, le kilométrage, les permissions et les rapports opérationnels.

---

#  Table des matières

- [Présentation](#-présentation)
- [ Fonctionnalités](#-fonctionnalités)
- [ Architecture](#-architecture)
- [ Stack technique](#-stack-technique)
- [ Démarrage](#-démarrage)
- [ Installation](#-installation)
- [ Variables d'environnement](#-variables-denvironnement)
- [ Utilisation](#-utilisation)
- [ Structure du projet](#-structure-du-projet)
- [ Rôles et permissions](#-rôles-et-permissions)
- [ Système de rapports](#-système-de-rapports)
- [ Tests](#-tests)
- [ Contribution](#-contribution)
- [ Licence](#-licence)

---

#  Présentation

Le Système de gestion de flotte est une application full-stack conçue pour aider les entreprises à gérer leurs véhicules, les affectations des employés, le suivi du kilométrage et les rapports opérationnels.

La plateforme propose la gestion des véhicules et des employés, des permissions personnalisables, le suivi des usages, l'import de données et des outils de reporting.

Ce dépôt sépare clairement le frontend et le backend pour faciliter la maintenance et l'extension.

---

#  Fonctionnalités

##  Gestion des véhicules

- Ajouter, modifier et supprimer des véhicules
- Stocker les informations de plaque, modèle et statut
- Suivre l'historique d'affectation et la disponibilité
- Surveiller l'entretien et les réparations

##  Gestion des employés

- Créer et gérer des comptes employés
- Affecter des véhicules aux employés
- Suivre l'utilisation et l'activité
- Contrôler les niveaux d'accès par rôle

##  Contrôle d'accès basé sur les rôles

- Configurer des rôles et des permissions
- Restreindre les actions selon le rôle
- Sécuriser l'accès aux véhicules, utilisateurs et rapports

Rôles typiques :

- Administrateur
- Manager
- Opérateur de flotte
- Employé
- Lecteur

##  Suivi du kilométrage

- Surveiller les limites kilométriques hebdomadaires
- Détecter les excès et l’utilisation le week-end
- Générer des alertes d'utilisation et des estimations de coûts
- Suivre les tendances dans le temps

##  Reporting

- Générer des rapports d'utilisation des véhicules
- Consulter les synthèses d'activité des employés
- Analyser les statistiques de kilométrage
- Exporter les données en PDF, CSV ou Excel

##  Import de données

- Importer des fichiers CSV et Excel
- Créer des enregistrements en masse
- Valider automatiquement les données importées

##  Recherche et filtrage

- Rechercher véhicules, employés, utilisateurs et rapports
- Filtrer par statut, date ou affectation
- Accéder rapidement aux informations de flotte

##  Support multilingue

- Anglais
- Français

Langues prévues : allemand, hongrois et autres.

---

#  Architecture

Ce dépôt utilise une architecture full-stack standard :

```text
Utilisateurs
  └─ Frontend (Next.js)
        └─ Backend (FastAPI)
              └─ PostgreSQL
```

- `frontend/` contient l'application Next.js.
- `backend/` contient le service FastAPI.
- `docker-compose.yml` orchestre la base de données et les services.

---

# 🛠 Stack technique

## Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- Axios
- React Query

## Backend

- Python
- FastAPI
- SQLAlchemy
- Alembic

## Base de données

- PostgreSQL

## Infrastructure

- Docker
- Docker Compose

---

#  Démarrage

## Prérequis

- Node.js 18+
- Python 3.11+
- Docker Desktop
- Git

---

## Cloner le dépôt

```bash
git clone https://github.com/mazerissa/fleet-management-system.git
cd fleet-management
```

---

#  Installation

## Configuration du backend

```bash
cd backend
python -m venv venv
```

Activer l'environnement virtuel :

Windows :

```bash
venv\\Scripts\\activate
```

Installer les dépendances :

```bash
pip install -r requirements.txt
```

Lancer le serveur backend :

```bash
uvicorn main:app --reload
```

Ouvrir :

- http://localhost:8000
- http://localhost:8000/docs

---

## Configuration du frontend

```bash
cd frontend
npm install
npm run dev
```

Ouvrir :

- http://localhost:3000

---

#  Variables d'environnement

## Backend

Créer `backend/.env` avec :

```env
DATABASE_URL=postgresql://fleet_user:fleet_password@localhost:5432/fleet_db
SECRET_KEY=change_this_secret
```

## Frontend

Créer `frontend/.env.local` avec :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

#  Utilisation

1. Démarrez la base de données et les services backend.
2. Lancez l'application frontend.
3. Ouvrez le frontend sur `http://localhost:3000`.
4. Gérez les véhicules, les employés et les rapports.

---

#  Structure du projet

```text
fleet-management/

├── backend/
│   ├── auth/
│   ├── users/
│   ├── employees/
│   ├── vehicles/
│   ├── reports/
│   ├── database/
│   ├── core/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
   ├── app/
   │   ├── dashboard/
   │   ├── vehicles/
   │   ├── employees/
   │   ├── reports/
   │   └── settings/
   ├── components/
   │   ├── Sidebar.tsx
   │   ├── Navbar.tsx
   │   ├── DataTable.tsx
   │   ├── Button.tsx
   │   └── Modal.tsx
   └── package.json
│
├── docker-compose.yml
├── LICENSE
└── README.md
```

---

#  Rôles et permissions

Le système prend en charge le contrôle d'accès basé sur les rôles avec des permissions configurables.

Les permissions peuvent inclure :

- Voir les véhicules
- Modifier les véhicules
- Supprimer les véhicules
- Gérer les employés
- Voir les rapports
- Configurer les paramètres

Les administrateurs peuvent modifier les définitions de rôles depuis le tableau de bord.

---

#  Système de rapports

Les rapports prennent en charge la surveillance opérationnelle et l'analyse à long terme :

- Utilisation des véhicules
- Comportement de conduite des employés
- Violations du kilométrage
- Estimation des coûts
- Efficacité de la flotte

---

#  Tests

## Backend

```bash
cd backend
pytest
```

## Frontend

```bash
cd frontend
npm run test
```

---

#  Contribution

Les contributions sont les bienvenues !

1. Forkez le dépôt.
2. Créez une branche de fonctionnalité : `git checkout -b feature/ma-modification`
3. Commitez vos modifications : `git commit -m "Ajouter la description de la fonctionnalité"`
4. Poussez votre branche : `git push origin feature/ma-modification`
5. Ouvrez une pull request.

---

# 📄 Licence

Ce projet est sous licence MIT.
