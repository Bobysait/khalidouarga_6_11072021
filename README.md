# khalidouarga_6_11072021
API So Pekocko pour le projet 6 de la formation Développeur web d'OpenClassroom

Installer les packages en utilisant npm build (paquets définis dans le fichier package.json) ou individuellement :
bcrypt (version 5.0.1)
dotenv (version 10.0.0)
express (version 4.17.1)
express-rate-limit (version 5.3.0)
helmet (version 4.6.0)
jsonwebtoken (version 8.5.1)
mongoose (version 5.13.2)
mongoose-sanitizer-plugin (version 1.1.0)
mongoose-type-email (version 1.1.2)
mongoose-unique-validator (version 2.0.3)
multer (version 1.4.2)
nodemon  (version 2.0.9)

l'API nécéssite un fichier .env à placer dans le dossier config.
Celui-ci contient les données de connexion à la base de donnée mongoDB

Vous pouvez créer le votre en utilisant et en complétant :

PORT=3000
DB_CLUSTER_NAME=Votre_Nom_De_Cluster
DB_USER_NAME=Votre_Identifiant_De_Connexion_A_la_DB
DB_USER_PASS=Votre_Password_De_Connexion_A_la_DB
DB_NAME=Nom_De_Votre_DB
TOKEN_SECRET=Un_Tolen_Unique_Que_Vous_Pouvez_Generer_Ou_Inventer
