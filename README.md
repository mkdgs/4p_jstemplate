4p_jstemplate
=============

test it:
http://jsfiddle.net/mkdgs/FvBnX/

i've made this template engine, with some idea similar to handlebar, but all presentational template logic is in javascript 
(we have don't need to learn a new template language again) and it's easy to mix html and javascript, like php with html.

I submit this to your eye and your terrible judgement (for the moment it's a proof of concept)


in template all data is mapped to a $4p.templateData object and has tree method is(), iterate(), v()

**$4p.templateData object**
can contain value mixed value scalar, array, or object 

**is('with','data','path')**
is used to traverse data tree, this return a $4p.templateData with null value

**iterate()** 
is used to make a loop throught $4p.templateData object if it's contain object or array value   

**v()**
return the data value passed in template contained in this object

give me a feedback  ;)


