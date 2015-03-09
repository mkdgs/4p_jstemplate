var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    var template_data = {
        bar: 'hello world',
        deep: {'foo': {'bar': 'this data is in deep.foo.bar'}},
        list: ['hop', 'hip', 'hap', 'yip', 'yep']
    };

    // handle more complex structure
    res.renderAfter('table', ''); // render <table>
    for (i = 1; i <= 11; i++) {
        res.renderAfter('table-line', {cell: [i, i * i]});  // push rendered data in table                
    }

    res.render('example', template_data); // render html template + data
});

module.exports = router;
