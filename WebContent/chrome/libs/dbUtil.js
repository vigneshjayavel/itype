 var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
 var db;
 
 function insertObj(obj){
     var transaction = db.transaction("word", "readwrite");
     var objectStore = transaction.objectStore("word");
     var request = objectStore.add(obj);
     request.onsuccess = function (evt) {
         // do something after the add succeeded
     };
 }
 
 function deleteObj(objId){
     var id = objId;
     var transaction = db.transaction("word", "readwrite");
     var objectStore = transaction.objectStore("word");
     var request = objectStore.delete(id);
     request.onsuccess = function (evt) {
         // It's gone!  
         console.log("deleted id:" + id);
     };
 }
 
 function updateObj(objId,obj){
    
     var transaction = db.transaction("word", "readwrite");
     var objectStore = transaction.objectStore("word");
     var request = objectStore.put(obj);
     request.onsuccess = function (evt) {
         // do something after the add succeeded
     };
 }
 
 function getObj(objId){
     var id = objId;
     var output = document.getElementById("printOutput");
     output.textContent = "";

     var transaction = db.transaction("word", "readwrite");
     var objectStore = transaction.objectStore("word");
     var request = objectStore.get(id);

     request.onsuccess = function (evt) {
         console.log(evt);
         output.textContent = request.result;
         console.log(request.result);
     };
 }
 
 function getAllObjs(){
     var output = document.getElementById("printOutput");
     output.textContent = "";

     var transaction = db.transaction("word", "readwrite");
     var objectStore = transaction.objectStore("word");

     var request = objectStore.openCursor();
     request.onsuccess = function (evt) {
         var cursor = evt.target.result;
         if (cursor) {
             output.textContent += "id: " + cursor.key + " is " + cursor.value.name + " ";
             cursor.continue();
         } else {
             console.log("No more entries!");
         }
     };
 }
 
 
 (function () {
     var wordData = [{
         rootWord: "Hello",
         suffixWords: [{
             word: "world",
             frequency: 1
         }, {
             word: "dear",
             frequency: 2
         }]
     }, {
         rootWord: "Good",
         suffixWords: [{
             word: "morning",
             frequency: 22
         }, {
             word: "boy",
             frequency: 1
         }]
     }];

     function initDb() {
         var request = indexedDB.open("WordsDB", 1);
         request.onsuccess = function (evt) {
             db = request.result;
         };

         request.onerror = function (evt) {
             console.log("IndexedDB error: " + evt.target.errorCode);
         };

         //runs only when the db is first created.
         request.onupgradeneeded = function (evt) {
             var objectStore = evt.currentTarget.result.createObjectStore("word", {
                 keyPath: "id",
                 autoIncrement: true
             });

             // objectStore.createIndex("name", "name", { unique: false });
             // objectStore.createIndex("email", "email", { unique: true });
             for (i in wordData) {
                 console.log("adding " + wordData[i]);
                 objectStore.add(wordData[i]);
             }
         };
     }

     function contentLoaded() {
         initDb();
         var btnAdd = document.getElementById("btnAdd");
         var btnDelete = document.getElementById("btnDelete");
         var btnPrint = document.getElementById("btnPrint");

         btnAdd.addEventListener("click", function () {
             var name = document.getElementById("txtName").value;
             var email = document.getElementById("txtEmail").value;

             var transaction = db.transaction("word", "readwrite");
             var objectStore = transaction.objectStore("word");
             var request = objectStore.add({
                 name: name,
                 email: email
             });
             request.onsuccess = function (evt) {
                 // do something after the add succeeded
             };
         }, false);

         btnDelete.addEventListener("click", function () {

             var id = document.getElementById("txtID").value;
             console.log("Deleting id:" + id);
             var transaction = db.transaction("word", "readwrite");
             var objectStore = transaction.objectStore("word");
             var request = objectStore.delete(id);
             request.onsuccess = function (evt) {
                 // It's gone!  
                 console.log("deleted id:" + id);
             };
         }, false);

         btnPrint.addEventListener("click", function () {
             var output = document.getElementById("printOutput");
             output.textContent = "";

             var transaction = db.transaction("word", "readwrite");
             var objectStore = transaction.objectStore("word");

             var request = objectStore.openCursor();
             request.onsuccess = function (evt) {
                 var cursor = evt.target.result;
                 if (cursor) {
                     output.textContent += "id: " + cursor.key + " is " + cursor.value.name + " ";
                     cursor.
                     continue ();
                 } else {
                     console.log("No more entries!");
                 }
             };
         }, false);

         //                 TODO
         btnGet.addEventListener("click", function () {
             var id = document.getElementById("txtID").value;
             var output = document.getElementById("printOutput");
             output.textContent = "";

             var transaction = db.transaction("word", "readwrite");
             var objectStore = transaction.objectStore("word");
             var request = objectStore.get(id);

             request.onsuccess = function (evt) {
                 console.log(evt);
                 output.textContent = request.result;
                 console.log(request.result);
             };
         }, false);


         //                 TODO
         btnUpdate.addEventListener("click", function () {
             var name = document.getElementById("txtName").value;
             var email = document.getElementById("txtEmail").value;

             var transaction = db.transaction("word", "readwrite");
             var objectStore = transaction.objectStore("word");
             var request = objectStore.put({
                 name: name,
                 email: email
             });
             request.onsuccess = function (evt) {
                 // do something after the add succeeded
             };
         }, false);

     }

     window.addEventListener("DOMContentLoaded", contentLoaded, false);
 })();