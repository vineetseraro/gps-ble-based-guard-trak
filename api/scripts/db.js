"use strict";

let fs = require('fs');
let mongo = require('mongodb').MongoClient;

class database {
    constructor(fs, mongo, database) {
        //this._database = database;
        this._dbUri = 'mongodb://127.0.0.1:27017/' + database;
        this._mongoClient = mongo;
        this._mappingFile = "./../config/database-structure/db.json";
        this._mapping = null;
        this._fs = fs;

        let Server = require('mongodb').Server;

        this._mc = new mongo(new Server("localhost", 27017), { native_parser: true });
    }

    dbOpen() {

    }

    // load json
    load() {
        try {
            let content = this._fs.readFileSync(this._mappingFile, {
                encoding: 'utf8'
            });
            this.execute(content);
        } catch (err) {

        }
    }

    // iterate through json for loading different collections
    execute(data) {
        // console.log('asdada');
        this._mc.open().then((db) => {
            // console.log(db);
        }).catch((err) => {
            // console.log(err);
        });


        /*

        // create database
        this._mongoClient.connect(this._dbUri).then((db) => {
            // console.log('database created');

            let obj = JSON.parse(data);
            //// console.log(db);
            //// console.log(obj.collections[0]);

            db.collectionNames().then((cols) => {
                // console.log(cols);
            }).catch((err) => {
                // console.log(err);
            });

            for (let i = 0; i < obj.collections.length; i++) {

                //// console.log(db.collection(obj.collections[0].name));

                //db.createCollection(obj.collections[0].name).then((db) => {}).catch((err) => {
                // // console.log(err);
                //});
            }

            //// console.log(obj);
            // obj.collections.forEach(this.buildCollection, this);

            //db.close();
        }).catch((err) => {
            // console.log(err);
        });

*/
    }

    /*
    // create individual collection
    buildCollection(details) {
        //// console.log(element);
        this.createCollection(details.name);
        this.loadData(details.name, details.rows);
    }

    createCollection(cName) {
        // console.log(cName);
        this._mongoClient.connect(this._dbUri).then((db) => {
            db.createCollection(cName);
            // console.log('collection created');
            db.close();
        }).catch((err) => {
            //// console.log(err);
        });
    }

    loadData(cName, data) {

        // console.log(data);
    }


    addCoreFields(data) {
        //data
        //return data;
    }

    */

}


let db = new database(fs, mongo, 'akwa1');
db.load();