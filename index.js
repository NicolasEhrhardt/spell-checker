/**
 * Module Dependencies
 */

var fs = require('fs'),
    filename = process.argv[2],
    out = process.argv[3],
    read = fs.readFileSync,
    ws = fs.createWriteStream(out),
    superagent = require('superagent');

/**
 * Read in file
 */

var words = read(filename, 'utf8').trim().split('\n');

/**
 * Header information
 */

var headers = {
  "Connection": "keep-alive",
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_2) AppleWebKit/537.30 (KHTML, like Gecko) Chrome/26.0.1406.0 Safari/537.30",
  "Accept": "*",
  "Referer": "http://translate.google.com/",
  "Accept-Encoding": "gzip,deflate,sdch",
  "Accept-Language": "en-US,en;q=0.8",
  "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.3"
};

/**
 * MAIN
 */


function run(words, lang) {
  if(!words.length) return 'hi';

  var word = words.shift(),
      delay = random(15, 30)*1000;

  request(word, lang, function(err, translation, type) {
    if(err) console.error('an error has occured', err);

    ws.write([word, translation, type].join(' ') + '\n');
    console.log('translated %s to %s. it\'s %s. waiting %d seconds', word, translation, type, delay/1000);
    setTimeout(function() {
      run(words, lang);
    }, delay);
  });
}

run(words, 'es');

/**
 * Request to google translate
 */

function request(word, lang, fn) {
  superagent
    .get(url(word, lang))
    .set(headers)
    .end(function(res) {
      if(!res.ok) return fn(new Error(res.text));
      var response = eval(res.text);
      var translation = response[0][0][0];
      var type = response[1][0][0];
      return fn(null, translation, type);
    });
}

/**
 * Get the url
 *
 * @param {String} str
 * @param {String} from from which lang
 * @param {String} to to which lang
 */

function url(str, to, from) {
  from = from || 'en';
  to = to || 'es';
  return 'http://translate.google.com/translate_a/t?client=t&text=' + str + '&hl=en&sl=' + from + '&tl=' + to;
}


/**
 * Random number between `min` and `max`
 */

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
