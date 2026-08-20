# Plants Module — Backend (Spring Boot)

**Stack** : Java 21 + Spring Boot 3.3.4 + PostgreSQL 17 + Swagger/OpenAPI (springdoc)

## Prérequis

- **Java 21** (`C:\Program Files\Java\jdk-21`)
- **PostgreSQL** (service `postgresql-x64-17` actif)
- Maven n'est **pas** nécessaire — le projet embarque le Maven Wrapper (`mvnw`)

## Première installation

1. **Créer la base et les tables** :
   ```powershell
   & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE plantsdb"
   & "C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -d plantsdb -f "../database/init.sql"
   ```

2. **Configurer la connexion** (si nécessaire) :
   Éditez `src/main/resources/application.properties` :
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/plantsdb
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   ```

3. **Lancer le serveur** :
   ```powershell
   # Via le script PowerShell helper :
   .\run.ps1

   # Ou manuellement :
   $JAVA = "C:\Program Files\Java\jdk-21\bin\java.exe"
   & $JAVA "-Dmaven.multiModuleProjectDirectory=$PWD" -classpath ".mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain spring-boot:run
   ```

4. Le serveur démarre sur **http://localhost:8080**

## Endpoints

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/` | Healthcheck |
| GET | `/v1/varieties` | Liste des variétés (filtres optionnels `?id_ferme=` `?bloc_parcelle=`) |
| GET | `/v1/varieties/{id}` | Détail d'une variété |
| — | `/swagger-ui.html` | Documentation interactive (Swagger UI) |

> **Note** : API en **lecture seule** — aucun POST/PUT/DELETE à cette étape (Task 1 par design).

## CORS

CORS est ouvert (`*`) **de manière provisoire** — à restreindre une fois la politique inter-modules tranchée en équipe (cf. `CorsConfig.java`).
