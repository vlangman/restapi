 
let CREATE_USERS_TABLE = "CREATE TABLE USERS (ID INTEGER NOT NULL PRIMARY KEY,NAME Varchar UNIQUE, PASSWORD Varchar);"
let CREATE_PETS_TABLE = "CREATE TABLE PETS (ID INTEGER PRIMARY KEY, PET_NAME Varchar, PET_STATUS INTEGER, PET_IMAGE Varchar)"
let CREATE_ORDERS_TABLE = "CREATE TABLE ORDERS (ID INTEGER PRIMARY KEY, PET_ID INTEGER UNIQUE, ORDER_STATUS INTEGER, FOREIGN KEY(PET_ID) REFERENCES PETS(ID))"

let CREATE_ADMIN = "INSERT INTO USERS (NAME, PASSWORD) VALUES('Admin','123');"

let CREATE_USER = function(userName, password){
    return new Promise((resolve, reject)=>{
        resolve ("INSERT INTO USERS (NAME, PASSWORD) VALUES('"+String(userName)+"','"+ String(password)+"');")
    })
}

let CREATE_PET = function(petName, petStatus){
    return new Promise ((resolve, reject)=>{
        if (petStatus){
            resolve("INSERT INTO PETS (PET_NAME, PET_STATUS) VALUES ('" +String(petName)+ "', "+String(petStatus)+");")
        }else{
            resolve("INSERT INTO PETS (PET_NAME, PET_STATUS) VALUES ('" +String(petName)+ "', 0);")
        }
    })
}


let UPDATE_USER = function(userID,username, pass){
    return new Promise((resolve, reject)=>{
        resolve("UPDATE USERS SET NAME = '"+ String(username)+"', PASSWORD = '"+String(pass)+"' WHERE ID = "+String(userID))
        
    })
}

let UPDATE_PET = function(petID, petName, petStatus, imageLink){
    return new Promise ((resolve, reject)=>{
        if(imageLink){
            resolve("UPDATE PETS SET PET_NAME = '"+ String(petName)+"',PET_STATUS = "+String(petStatus)+", PET_IMAGE = '"+String(imageLink)+"' WHERE ID = "+String(petID))
        }
        else{
            resolve("UPDATE PETS SET PET_NAME = '"+ String(petName)+"',PET_STATUS = "+String(petStatus) +" WHERE ID = "+String(petID))
        }
    })
   
}
let DELETE_PET_ORDER = function(petID){
    return new Promise((resolve, reject)=>{
        resolve ("DELETE FROM ORDERS WHERE PET_ID = " + String(petID))
    })
}



let CREATE_PET_ORDER = function(petID){
    return new Promise((resolve, reject)=>{
        resolve ("INSERT INTO ORDERS (PET_ID , ORDER_STATUS) VALUES (" +String(petID)+",1)")
    })
}

let GET_PET_BY_ID = function(petID){
    return new Promise((resolve, reject)=>{
        resolve("SELECT * FROM PETS WHERE ID = "+String(petID)+";")
    })
}

let GET_PET_BY_STATUS = function(petID){
    return new Promise((resolve, reject)=>{
        resolve("SELECT * FROM PETS WHERE PET_STATUS = "+String(petID)+";")
    })
}

let GET_PET_ORDER = function(orderID){
    return new Promise((resolve, reject)=>{
        resolve("SELECT * FROM ORDERS WHERE ID = "+String(orderID)+";")
    })
}

let LOGIN_USER = function(userName, pass){
    return new Promise((resolve, reject)=>{
        resolve("SELECT * FROM USERS WHERE NAME = '"+String(userName)+"' AND PASSWORD = '"+String(pass)+"';")
    })
}

let DELETE_USER = function(usID, pass){
    return new Promise((resolve, reject)=>{
        resolve("DELETE FROM USERS WHERE ID = '"+String(usID)+"' AND PASSWORD = '"+String(pass)+"';")
    })
}


let GET_USER = function(userName, pass){
    return new Promise((resolve, reject)=>{
        resolve("SELECT * FROM USERS WHERE NAME = '"+String(userName)+"';")
    })
}



let UPDATE_IMAGE = function(petID, imageLink){
    return new Promise ((resolve, reject)=>{
        resolve("UPDATE PETS SET PET_IMAGE = '"+String(imageLink)+"' WHERE ID = "+String(petID))
    })
}

let GET_STATUS = function(){
    return new Promise((resolve, reject)=>{
        resolve("SELECT DISTINCT PET_STATUS FROM PETS")
    })
}



module.exports = {
    CREATE_USERS_TABLE,
    CREATE_PETS_TABLE,
    CREATE_ORDERS_TABLE,
    CREATE_PET,
    UPDATE_PET,
    GET_PET_BY_ID,
    GET_PET_BY_STATUS,
    UPDATE_IMAGE,
    CREATE_PET_ORDER,
    DELETE_PET_ORDER,
    GET_PET_ORDER,
    CREATE_ADMIN,
    LOGIN_USER,
    GET_USER,
    GET_STATUS,
    CREATE_USER,
    DELETE_USER,
    UPDATE_USER
}