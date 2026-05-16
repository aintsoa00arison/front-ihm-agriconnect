Voici une version entièrement révisée, professionnelle et structurée de ton fichier `README.md`. Elle intègre les instructions d'installation indispensables, détaille l'architecture globale de ton projet Next.js et met en lumière le rôle crucial de tes fichiers de services basés sur les mocks.

---

```markdown
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

Le projet est structuré selon les conventions modernes de l'App Router de Next.js. Voici une vue d'ensemble de l'arborescence :

📁 front-ihm/
└── 📁 app/
    ├── 📁 (auth)/
    │   ├── 📁 login/
    │   │   ├── 📁 _components/ ( composant de la page  de login ( AuthForm et AuthSide) les  formulaires sont celles de connexion, initialisation d'inscription , de verification d'email , et de renitialisation de mot de passe)
    │   │   ├── 📁 services/ (service d'authentification )
    │   │   ├── 📁 types/ ( interfaces de chaque  variables utilisées dans les compoasants)
    │   │   ├── 📄 layout.tsx
    │   │   └── 📄 page.tsx( parent)
    │   └── 📁 register/
    │       ├── 📁 _components/ ( compsant  pour l'inscription qui sont les 3 étapes)
    │       ├── 📁 services/ ( gerer l'envoie final des données et le check si emailutilisé)
    │       ├── 📄 page.tsx ( page parent)
    │       ├── 📄 registerStore.ts (pour le stocker les donnnées avant l'envoi( zustand))
    │       └── 📄 types.ts
    ├── 📁 (landing)/
    │   ├── 📁 components/ ( composant de la page et des elements affichés par le footer)
    │   ├── 📄 layout.tsx
    │   └── 📄 page.tsx
    ├── 📁 utils/
    │   └── 📄 validation.ts( fichier pour les expréssions régulières)
    └── 🔤 favicon.ico
    └── 📄 global.css( bibliotheque de coleur, input , font)

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

