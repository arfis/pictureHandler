var express = require('express');
var router = express.Router();
var sizeOf = require('image-size');

const testFolder = 'public/images/photos';
const fs = require('fs');

/* GET users listing. */
router.get('/', function (req, res, next) {
    let photos = [];
    fs.readdirSync(testFolder).forEach(file => {
        var dimensions = sizeOf(testFolder + '/' + file);
        const {height, width} = dimensions;
        const fullFile = req.protocol + '://' + req.get('host') + '/' + file;
        photos.push({
            file: fullFile,
            height,
            width
        });
})
    res.json({files: photos});
});

module.exports = router;
