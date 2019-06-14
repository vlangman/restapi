const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database(':memory:');
const express = require('express')
const Tables = require('./tables')
const app = express()
const port = 3000

LoggedIn = false
// init db
class SQL_DB {

    constructor() {
        this.getInstance().then((db)=>{
            this.createTables()
        }, (error)=>{
            throw error
        }
        )
        
    }

    createInstance() {
        return new Promise((resolve, reject)=>{
            db = new sqlite3.Database(':memory:', (err) => {
                if (err) {
                    reject(err);
                }
                console.log('Connected to the in-memory SQlite database.');
                resolve(db);
            });
           
        })
    }

    createTables(){
       this.execute(Tables.CREATE_USERS_TABLE).then(success=>{
            this.execute(Tables.CREATE_ADMIN)
       },err=>{
           throw error
       })
       this.execute(Tables.CREATE_PETS_TABLE)
       this.execute(Tables.CREATE_ORDERS_TABLE)

    }

    getInstance() {
        return new Promise((resolve, reject)=>{
            if (!this.instance) {
                this.createInstance().then((db)=>{
                    this.instance = db
                    resolve(this.instance)
                });
            }else{
                resolve(this.instance);
            }
        })
    }

    
    destroyInstance(){
        db.close((err) => {
            if (err) {
                throw err;
            }
            console.log('Closing the database connection.');
        });
    }

    destroy(){
        this.destroyInstance
    }

    execute(_sql){
        return new Promise((resolve, reject)=>{
            this.getInstance().then((db)=>{
                db.all(_sql, (err, success)=>{
                    if (err){
                        reject(err);
                    }

                    console.log(`${_sql}`)
                    resolve(success)
                })
            }, (err)=>{
                reject(err)
            }).catch((err)=>{
                    reject(err)
                }
              
            )
        })
        
    }
   
}
const sql = new SQL_DB

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/new/pet/', (req, res)=>{
    if (req.query.petName){
        Tables.CREATE_PET(req.query.petName, req.query.petStatus).then((query)=>{
            sql.execute(query).then(res=>{
                console.log(res)
            })
            sql.execute("SELECT * FROM PETS").then((result)=>{
                res.send(result)
            })
            
        })
    }else{
        res.send("MISSING PETNAME")
    }
   
})

app.get('/logout/', (req, res)=>{
    LoggedIn = false
    res.send({200: "LOGOUT WAS SUCCESSFUL"})
})

app.post('/delete/user', (req, res)=>{
    if (!req.query.userID){
        res.send({404:"ERROR: MISSING USER ID"})
    }
    if (!req.query.password){
        res.send({404:"ERROR: MISSING PASSWORD"})
    }
    Tables.DELETE_USER(req.query.userID, req.query.password).then(query=>{
        sql.execute(query).then(success=>{
            res.send({200:"USER " + String(req.query.userID) + " HAS BEEN DELETED"})
        }, err=>{
            res.send({500:err})
        })
    })
})

app.post('/create/user',(req, res)=>{
    if (!req.query.userName){
        res.send({404:"ERROR: MISSING USERNAME"})
    }
    if (!req.query.password){
        res.send({404:"ERROR: MISSING PASSWORD"})
    }
    Tables.CREATE_USER(req.query.userName,req.query.password).then(query=>{
        sql.execute(query).then(success=>{
            res.send({200:"USER "+ String(req.query.userName)+" CREAION SUCCESS"})
        }, fail=>{
            res.send({500:fail})
        })
    })
})

app.get('/update/user/', (req, res)=>{
    if (!req.query.userName){
        res.send({404:"ERROR: MISSING USERNAME"})
    }
    if (!req.query.password){
        res.send({404:"ERROR: MISSING PASSWORD"})
    }
    if (!req.query.userID){
        res.send({404:"ERROR: MISSING USERID"})
    }
    Tables.UPDATE_USER(req.query.userID, req.query.userName, req.query.password).then(query=>{
        sql.execute(query).then(success=>{
            res.send({200:"USER " +String(req.query.userID)+ " UPDATE SUCCESS "})
        }, err=>{
            res.send({500:err})
        })
    })
})

app.get('/get/user' , (req, res)=>{
    if (!req.query.userName){
        res.send({404:"ERROR: MISSING USERNAME"})
    }
    Tables.GET_USER(req.query.userName).then(query=>{
        sql.execute(query).then(success=>{
            res.send({200:success})
        }, err=>{
            res.send({500:error})
        })

    })
})

app.get('/login/', (req, res)=>{
    if (!req.query.userName){
        res.send({404:"ERROR: MISSING USERNAME"})
    }
    if (!req.query.password){
        res.send({404:"ERROR: MISSING PASSWORD"})
    }
    Tables.LOGIN_USER(req.query.userName, req.query.password).then(query=>{
        sql.execute(query).then(success=>{
            console.log(success.length)
            if (success.length == 1){
                LoggedIn = success
                res.send({200: "LOGIN WAS SUCCESSFUL"})
            }else{
                res.send({404:"ACCOUNT "+ req.query.userName + " NOT FOUND "})
            }
        }, error=>{
            console.log(error)
            res.send({500:error})
        })
    })
})

app.get('/update/pet/', (req, res)=>{
    petStatus = 0
    imageLink = ""
    if (!req.query.petID){
        res.send({404:"MISSING PETNAME"})
    }
    if (!req.query.petName){
        res.send({404:"MISSING PETNAME"})
    }
    if (req.query.petStatus){
        petStatus = req.query.petStatus
    }
    if(req.query.imageLink){
        imageLink = req.query.imageLink
    }
    
    Tables.UPDATE_PET(req.query.petID, req.query.petName,petStatus,imageLink).then((query)=>{
        sql.execute(query).then((result)=>{
            Tables.GET_PET_BY_ID(req.query.petID).then(query2=>{
                sql.execute(query2).then(success=>{
                    res.send(success)
                }, err=>{
                    res.send({500:err})
                })
            })
        }, (err)=>{
            console.log(err)
            res.send(err)
        })
    })
})

app.get('/list/pets/', (req, res)=>{
    Tables.GET_STATUS().then(query=>{
        sql.execute(query).then(success=>{
            console.log(success)
            list = {}
            for (i = 0; i < success.length; i++) {
                status = success[i]["PET_STATUS"]
                Tables.GET_PET_BY_STATUS(status).then(query=>{
                    sql.execute(query).then(result=>{
                        list[status] = result.length
                        console.log(list)
                    })
                })
            }
            res.send({200:list})
        }, err=>{
            res.send({500:err})
        })
    })
})

app.get('/get/pet/', (req, res)=>{
    if (req.query.petID){
        Tables.GET_PET_BY_ID(req.query.petID).then((query)=>{
            sql.execute(query).then((rows)=>{
                console.log(rows)
                res.send({200:rows})
            })
        })
    }else if(req.query.petStatus){
        Tables.GET_PET_BY_STATUS(req.query.petStatus).then((query)=>{
            sql.execute(query).then((rows)=>{
                console.log(rows)
                res.send({200:rows})
            })
        })
    }
})

app.post("/update/pet/", (req, res)=>{
    if (!req.query.petID){
        res.send({404:"ERROR: MISSINGG PET ID"})
    }
    if (!req.query.imageLink){
        res.send({404:"ERROR: MISSING IMAGE LINK"})
    }
    Tables.UPDATE_IMAGE(req.query.petID, req.query.imageLink).then((query)=>{
        sql.execute(query).then(result=>{
            console.log(result)
            res.send({200:result})
        }, err=>{
            console.log(err)
            res.send({500:err})
        })
    })
})

app.post("/pet/order/", (req, res)=>{
    if (!req.query.petID){
        res.send({404:"ERROR: MISSINGG PET ID"})
    }
    Tables.GET_PET_BY_ID(req.query.petID).then((query)=>{
        sql.execute(query).then((data)=>{
            if (data.length > 0){
                console.log(data.length)
                Tables.CREATE_PET_ORDER(req.query.petID).then((query)=>{
                    sql.execute(query).then((result)=>{
                        console.log(result)
                    }, (err)=>{
                        throw err
                    }).catch((err)=>{
                        console.log(err)
                        res.send({500:err})
                    })
                })
            }else{
                res.send({404:"PET ID NOT FOUND"})
            }
        }, (err)=>{
            res.send({500:err})
    })
})
    
})

app.get("/get/order/", (req, res)=>{
    if (req.query.orderID){
        Tables.GET_PET_ORDER(req.query.orderID).then(query=>{
            sql.execute(query).then(result=>{

            },err=>{
                res.send({500:err})
            })
        })
    }
    Tables.GET_PET_ORDER()
})


app.post("/pet/order/delete", (req, res)=>{
    if (!req.query.petID){
        res.send("ERROR: MISSINGG PET ID")
    }
    Tables.DELETE_PET_ORDER(req.query.petID).then(query=>{
        console.log(query)
        sql.execute(query).then(result =>{
            res.send("DELETED")
        }, err=>{
            console.log(err)
            res.send(err)
        })
    })
    
})