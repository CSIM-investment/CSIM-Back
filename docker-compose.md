# Docker compose instruction
### Run docker compose
```shell
$> docker compose up
```
OU
```shell
$> docker-compose up
```
En fonction de la version de docker

#### Now your postgres database run on 192.168.3.2:5432

## PgAdmin4
### Connect to pgadmin
- Go to url : http://localhost:5050
- Connect with :

```json
{
  "email": "admin@admin.com",
  "pwd": "postgres"
}
```
### Connect to database with pgadmin
1. Right clic on "Server";
2. Click on "Register" > "Server";
3. Set name : "csim"
4. Go to "Connection" tab
5. Set Host name/address : "192.168.3.2"
6. Set username : postgres
7. Set password : postgres
8. Click on save


### Check tables
At pgAdmin4 develop tree structure :
```
Servers
│  
└── Your serveur database name
    │  
    └── Databases
        │  
        └── csim
            │  
            └── Schemas
                │  
                └── public
                    │  
                    └── Tables
                        │  
                        ├── crypto_stock_markets
                        │
                        ├── markets
                        │
                        └── [...]
```

### Query tool
1. Right click on "Schemas" in tree structure
2. Choose "Query tool"

#
