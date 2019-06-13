 
let CREATE_USERS_TABLE = "CREATE TABLE USERS (ID INTEGER NOT NULL PRIMARY KEY,NAME Varchar, PASSWORD Varchar);"
let CREATE_PETS_TABLE = "CREATE TABLE PETS (ID INTEGER PRIMARY KEY, PET_NAME Varchar, PET_STATUS INTEGER, PET_IMAGE Varchar)"
let CREATE_ORDERS_TABLE = "CREATE TABLE ORDERS (ID INTEGER PRIMARY KEY, PET_ID INTEGER UNIQUE, ORDER_STATUS INTEGER, FOREIGN KEY(PET_ID) REFERENCES PETS(ID))"

let CREATE_PET = function(petName, petStatus){
    return new Promise ((resolve, reject)=>{
        if (petStatus){
            resolve("INSERT INTO PETS (PET_NAME, PET_STATUS) VALUES ('" +String(petName)+ "', "+String(petStatus)+");")
        }else{
            resolve("INSERT INTO PETS (PET_NAME, PET_STATUS) VALUES ('" +String(petName)+ "', 0);")
        }
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

let UPDATE_IMAGE = function(petID, imageLink){
    return new Promise ((resolve, reject)=>{
        resolve("UPDATE PETS SET PET_IMAGE = '"+String(imageLink)+"' WHERE ID = "+String(petID))
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
}