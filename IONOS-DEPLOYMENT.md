# Guide de déploiement IONOS pour ANATOUCH

## Options de déploiement

### Option 1: Déploiement Next.js (Recommandé)
IONOS supporte Node.js, vous pouvez déployer directement:

1. **Préparer le projet:**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Uploader sur IONOS:**
   - Connectez-vous à votre espace IONOS
   - Allez dans "Hébergement Web" > "Gestion des fichiers"
   - Uploadez tous les fichiers du projet

3. **Configuration Node.js:**
   - Dans IONOS, activez Node.js (version 18+)
   - Définir le point d'entrée: `server.js` ou `next start`

### Option 2: Export statique (Plus simple)
Si vous n'avez pas besoin de fonctionnalités serveur:

1. **Modifier next.config.mjs:**
   \`\`\`javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }
   export default nextConfig
   \`\`\`

2. **Build et export:**
   \`\`\`bash
   npm run build
   \`\`\`

3. **Upload du dossier `out/`:**
   - Uploadez tout le contenu du dossier `out/` vers votre espace web IONOS

## Configuration du domaine

1. **DNS:** Pointez votre domaine vers les serveurs IONOS
2. **SSL:** Activez le certificat SSL gratuit dans IONOS
3. **Redirections:** Configurez www vers non-www (ou inverse)

## Gestion des services

Vos services sont dans le fichier `data/services.ts`. Pour les modifier:

1. Éditez le fichier `data/services.ts`
2. Ajoutez/modifiez/supprimez des services
3. Ajoutez des mots-clés pour améliorer la recherche
4. Re-déployez le site

## Pas besoin de base de données pour l'instant
- Les services sont stockés dans le code (plus rapide)
- Si vous voulez une base de données plus tard, IONOS propose MySQL
- Pour l'instant, modifier le fichier `services.ts` suffit amplement
