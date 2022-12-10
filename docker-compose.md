# Docker compose instruction
### Run docker compose
```shell
$> docker compose up
```

#### Now your postgres database run on 192.168.3.2:5432

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
1.  Right clic on "Server";
2. Click on "Register" > "Server";
3. Set name : "csim-database" for example
4. Go to "Connection" tab
5. Set Host name/address : "192.168.3.2"
6. Set username : postgres
7. password : postgres
8. Click on save

Now you can check data in table in :
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