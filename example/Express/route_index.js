var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    
     var template_data = {
        bar : 'hello world',
        deep : { 'foo' : { 'bar' : 'this data is in deep.foo.bar' } },
        list : [ 'hop', 'hip', 'hap', 'yip' , 'yep']
    };
    res.render('index', template_data); // render html template + data
    
});

module.exports = router;
