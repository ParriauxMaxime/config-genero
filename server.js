/**
 * Created by maxime on 18/04/17.
 */

const grunt = require('grunt')
const Parse = require('./server/parser').parser;

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

try {
    fs.statSync('dist')
    console.log('Serving static build from dist/')
    console.log('Run `npm run clean` to return to development mode')
    app.use('/', express.static(path.join(__dirname, 'dist')));
}
catch (e) {
    console.log('Serving development build with nwb middleware')
    console.log('Run `npm run build` to create a production build')
    app.use(require('nwb/express')(express, {entry: 'app/index.js'}))
}

app.get('/overview', function (req, res) {
    res.send()
});

app.post('/saveData', function (req, res) {
    Parse(req.body, () => {
        grunt.tasks(['__compile'], {}, function () {
            grunt.log.ok('Done running tasks.');
        });
        res.send('Ok');
    });
});

app.listen(3000, function () {
    console.log('Express server started on localhost:3000');
});