# Demande de serveur
Dans le cadre du développement de CSIM, nous avons besoin d'un serveur avec différentes spécifications bien précises.

## Objet du document
Ce document a pour objectif de présenter toutes les spécifications du serveur nécessaire à l'hébergement de CSIM (Projet d'année au sein de Lyon Ynov Campus).

## Spécifications
Concernant les différentes spécifications.

### Système d'exploitation
Le système d'exploitation installé sur la machine doit être une distribution linux. 
**Un ubuntu fera totalement l'affaire.**

### Droits
En termes de droit, il nous faut un serveur avec les droits de root/superuser. Aucune restriction ne doit être présente.

### SSH
L'accès SSH est important dès lors que nous devons nous connecter depuis n'importe quel réseau externe ! Avec VPN si possible.

### Stockage
Concernant le stockage, 
- Pour la base de données, nous avons établi une simulation. Celle-ci nous a donné un rendu de 45Go.
- Pour le Front et le back nous estimons qu'il faudra quelques Giga de stockage (5Go de quoi être large).

Au total, cela nous fait un stockage de 100Go si l'on part du principe qu'il nous faut une marge de 20% en comptant l'os et les dépendances à installer sur le serveur. Sans oublier les stratégie de déploiement qui seront peut être mise en place avec le temps.

### Nom de domaine
Cela n'est pas urgent, mais il nous faudra un nom de domaine comportant le nom **CryptoStockInvestmentManager.com** ou **CSIM-Finance.com**

### Objectifs à atteindre
- Avoir un environnement automatisé de façon à avoir un déploiement continue.
- Une étape vers une stratégie DevOps.
