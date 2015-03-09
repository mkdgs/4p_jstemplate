var express = require('express');
var router = express.Router();
var fs = require('fs'); // requires the fs module
var $4p_template = require('4p_template');

/* GET home page. */
router.get('/', function(req, res) {
    var file = 'views/index.html'; // our template file template
    fs.readFile(file, function (err, content) {
        if (err) throw err;
       
        // init template
        var tpl = $4p_template.template(content.toString()); 
        
        // some data
        var template_data = { 
            bar: 'hello world',
            deep: {'foo': {'bar': 'this data is in deep.foo.bar'}},
            list: ['hop', 'hip', 'hap', 'yip', 'yep']
        };     
        
        t = tpl.element.html(tpl.render(template_data)); // render to dom
        
        // tpl.element is a jquery instance of our template element
        tpl.element.find('li').css('color', 'red'); // play with it !

        // handle more complex structure and play with dom
        tpl.renderAfter('table', ''); // render <table>
        for (i = 1; i <= 11; i++) {
            tpl.renderAfter('table-line', {cell: [i, i * i]});  // push rendered data in table                
        }
        
        var rendered = t.html(); // get html
        res.send(t.html()); // send output     
    });
});

module.exports = router;