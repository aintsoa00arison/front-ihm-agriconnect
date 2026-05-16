
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🚀 Avant de commencer (Installation)

Avant de lancer le serveur de développement, vous devez installer les dépendances du projet, y compris les bibliothèques d'icônes nécessaires et la gestion d'état :

```bash
# 1. Installer les dépendances de base du projet
npm install

# 2. Installer les bibliothèques d'icônes requises (Lucide React & React Icons)
npm install lucide-react react-icons

# 3. Installer Zustand pour la gestion d'état globale
npm install zustand

```

Une fois les packages installés, lancez le serveur de développement :

```bash
npm run dev

```

Ouvrez [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) dans votre navigateur pour voir le résultat.

---
## 📁 Architecture de l'Arborescence

Le projet est structuré selon les conventions modernes de l'App Router de Next.js. Voici une vue d'ensemble détaillée de l'arborescence :

```text
📁 front-ihm/
└── 📁 app/
    ├── 📁 (auth)/                               # Groupe de routes pour l'authentification (sans impact sur l'URL)
    │   ├── 📁 login/                            # Branche de connexion et gestion de compte
    │   │   ├── 📁 _components/                  # Éléments de l'IHM (AuthForm, AuthSide) gérant : connexion, init inscription, vérif email et reset MDP
    │   │   ├── 📁 services/                     # Couche logique et appels d'authentification (Mocks actuels)
    │   │   ├── 📁 types/                        # Interfaces TypeScript typant chaque variable des composants
    │   │   ├── 📄 layout.tsx                    # Structure structurelle de la vue de connexion
    │   │   └── 📄 page.tsx                      # Page parente principale de la route /login
    │   └── 📁 register/                         # Branche dédiée à la création de compte
    │       ├── 📁 _components/                  # Composants spécifiques au tunnel d'inscription découpé en 3 étapes
    │       ├── 📁 services/                     # Logique de validation (check si email déjà utilisé) et envoi final des données
    │       ├── 📄 registerStore.ts              # Store Zustand gérant l'état temporaire des données entre les étapes avant envoi
    │       ├── 📄 types.ts                      # Déclarations des types et modèles de données pour l'inscription
    │       └── 📄 page.tsx                      # Page parente principale de la route /register
    ├── 📁 (landing)/                            # Groupe de routes pour la vitrine publique du site
    │   ├── 📁 components/                       # Sections de la Landing Page (Hero, Features...) et pages secondaires gérées par le Footer
    │   ├── 📄 layout.tsx                        # Layout global gérant l'affichage dynamique (Navbar/Footer conditionnels)
    │   └── 📄 page.tsx                          # Point d'entrée de la Landing Page
    ├── 📁 utils/                                # Fonctions d'aide transversales et utilitaires
    │   └── 📄 validation.ts                     # Centralisation des expressions régulières (Regex) et règles de validation de formulaires
    ├── 📄 global.css                            # Styles globaux, variables du design system (colors, inputs, fonts)
    └── 🔤 favicon.ico                           # Icône de l'application affichée dans le navigateur
## ⚙️ Couche Services : Architecture centrée sur les Mocks

Le dossier `services/` joue un rôle capital dans l'architecture technique de l'application :

### 1. Utilisation actuelle (Mocks & Tests)

Pour l'instant, **tous nos fichiers de services sont centrés sur des données simulées (Mocks)**.

* **Pourquoi ?** Cela permet de développer, de tester l'ergonomie (CQFD), de valider les interfaces utilisateurs et de simuler des comportements dynamiques complexes sans dépendre d'une infrastructure backend active.
* **Pour les tests :** Référez-vous à ces fichiers pour comprendre la structure des données attendues par l'interface et valider vos scénarios de tests unitaires ou d'intégration.

### 2. Évolution future (Migration vers le Backend)

Ces fichiers de services constituent la fondation exacte de notre future intégration technique. À terme, les fonctions de simulation actuelles (Mocks) seront remplacées par des requêtes HTTP réelles (via `fetch` ou `axios`) pointant vers les **routes d'API de notre backend**.

> ⚠️ **Règle d'or :** Toute nouvelle logique métier ou manipulation de données doit obligatoirement transiter par un fichier du dossier `services/` afin de garantir une séparation stricte entre l'interface visuelle (UI) et la logique de données.



## Learn More

To learn more about Next.js, take a look at the following resources:

* [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
* [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

