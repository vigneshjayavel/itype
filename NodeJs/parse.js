//run this script in nodejs.

(function () {
    'use strict';


    // ---------- Dependencies ----------

    var fs = require('fs');


    var words = [];
  


    Array.prototype.toString = function () {
        var string = '';
        this.forEach(function (word) {
            string += word.toString() + ' ';
        });
        return string;
    };


    // Read file from filesystem ("app" entry point)

    var time = new Date().getTime();
    console.log('Reading dictionary file...');

    fs.readFile(process.argv[2], function (error, data) {
        console.log('Done. [' + (new Date().getTime() - time).toString() + 'ms]');

        if (error) {
            console.log(error + '\n');
            console.log('Error reading dictionary file, ' + usage);
            return;
        }

        time = new Date().getTime();
        console.log('Parsing dictionary contents...');
        words = data.toString();
        words = words.replace(/[:;!?",'\*\[\]\d\$]/g, '');
        words = words.replace(/\-\-/g, ' ');
	words = words.replace(/[^a-zA-Z0-9\. :]/g, "");
        words = words.split(/\s+/g);
        console.log('Done. [' + (new Date().getTime() - time).toString() + 'ms]');

        console.log(words);


        fs.writeFile("words-arr.txt", words.toString(), function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log("The file was saved with "+words.length+" words!!");

            }
	        });
    });
}());
