4p_jstemplate
=============
[![4p Logo](https://oupla.bienla.com/mkdgs/4p_logo.png)](http://mkdgs.fr/)

test it:
http://jsfiddle.net/mkdgs/FvBnX/

```html
    <h1>{{=data.bar.v()}}</h1>
    <ul>
        {{ while ( item = data.list.iterate() ) { }}
        <li>
            {{=item}}               
        </li>        
        {{ } }}
    </ul>
```



```javascript
    var template_data = { // define some data
        bar: 'hello world',       
        list: ['hop', 'hip', 'hap', 'yip', 'yep']
    };

    var my_tpl = $4p.template($('#template').html()); // get your template
    // or something like 
    // var my_tpl = $4p.template('http://urlOfYour.com/templateFile.html'); 
    
    $('#template').html(my_tpl.render(template_data)); // render with data
```

see example/example.html

- you can reuse your template and define repetitive subpart of it.
- in template all data is mapped to a $4p.templateData object and has three method is(), iterate(), v()

**$4p.templateData object**
can contain value mixed value scalar, array, or object 

**is('with','data','path')**
is used to traverse data tree, this return a $4p.templateData. 
that's return the data object corresponding to the data path.
if the data path not exist he return a $4p.templateData with null value,
so if there no value your code is not breaking and you have not to worry about he data was or was not defined. 

**iterate()** 
is used to make a loop throught $4p.templateData object if it's contain object or array value   

**v()**
return the data value passed in template contained in this object


i've made this template engine, with some idea similar to handlebar, but all presentational template logic is in javascript 
(we have don't need to learn a new template language again) and it's easy to mix html and javascript, like php with html.

give me a feedback  ;)


**working with Express/NodeJs**
https://www.npmjs.com/package/4p_template

find npm package in node_js/
see example/Express/
```javascript
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
```

The templating part is inspired, like many other, from our Guru:
http://ejohn.org/blog/javascript-micro-templating/