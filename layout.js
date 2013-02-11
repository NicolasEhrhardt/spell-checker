// ------------------
// -- dependencies --
// ------------------

var fs = require('fs'),
    read = fs.readFileSync,
    sets = require('simplesets'),
    express = require('express'),
    superagent = require('superagent');


// ----------------------
// -- global variables --
// ----------------------

var filename = process.argv[2];


// ----------
// -- MAIN --
// ----------

// reading file

var list = arrayFromFile(filename);

// defining getters

function typeTrans(translation) {
    return translation[2];
}

function inTrans(translation) {
    return translation[0];
}

function outTrans(translation) {
    return translation[1];
}

// sorting list (useles)

/*
console.log(list.sort(function(elem1, elem2) {
    return typeTrans(elem1) < typeTrans(elem2)}
));
*/

// generating number of columns

var setWordType = new sets.Set();

list.forEach(function(trans) {
    setWordType.add(typeTrans(trans));
});

// generating page

var output = '<table>\n';

setWordType.array().forEach(function(wordType) {
    output += '<tr>\n';

    list.filter(function(trans) { 
        return typeTrans(trans) == wordType})
        
        .forEach(function(trans) {
            output += '<td>' + inTrans(trans) + ' : ' + outTrans(trans) + ' (' + typeTrans(trans) + ')</td>\n';})

    output += '</tr>\n';
});

output += '</table>';

// -- serve file

var app = express();

app.listen(3000);

app.get('/test', function(req, res){
  res.send(output);
});

// ----------
// -- libs --
// ----------

function arrayFromFile(path, separator) {
    if (typeof separator === 'undefined') {
        separator = ';'
    }

    if(!path.length)
        return new Error('Bad file type');

    var lineArray = read(path, 'utf8').trim().split('\n');
    var result = [];    

    lineArray.forEach(function(line) {
        var columnArray = line.split(separator);        
        result.push(columnArray);
    });
    
    return result;
}


