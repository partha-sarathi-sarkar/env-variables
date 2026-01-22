# GitHub Environment Variables Manager

**preview, create, update, and delete**
GitHub **Environment Variables** using **GitHub App authentication**.





# Create **.env** file and add below details 

GITHUB_APP_ID=123456 <br>
GITHUB_APP_INSTALLATION_ID=987654321 <br>
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----" <br>
OUTPUT_FORMAT=json



# Create **config.json** file and add below details 

`{
  "owner": "org-name",
  "repo": "repo-name"
}`

## Commands to run 

1. for DRY-RUN 

`npm run deploy:dev`

2. Apply (Create / Update only)

`set DRY_RUN=false && npm run deploy:dev`

3. Apply + Delete (GUARDED)

`set DRY_RUN=false && set ALLOW_ENV_DELETE=true && npm run deploy:dev`

## **.deploy-cache.json** auto generated

`{
  "dev": {
    "env": "development",
    "checksum": "a80120e4...",
    "lastUpdated": "2026-01-23T21:30:00.000Z",
    "variables": ["API_URL", "DB_HOST"]
  }
}`

