var express 	= require('express');
var app 		= express();
var mongoose	= require('mongoose');
var morgan		= require('morgan');
var bodyParser	= require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://iwan:jvmdev-123@jello.modulusmongo.net:27017/enuz9irE');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());

var Todo = mongoose.model('Todo',{
	text : String
});

app.get('/api/todos',function(req, res){
	Todo.find(function(err, todos){
		if (err) 
			res.send(err);
		res.json(todos);
	});
});

//create todo and send back all todos after creation

app.post('/api/todos',function(req, res){
	Todo.create({
		text : req.body.text,
		done : false
	}, function(err, todo){
		if (err)
			res.send(err);
		//get and return all the todos after you create another
		Todo.find(function(err, todos){
			if (err)
				res.send(err)
			res.json(todos);
		});
	});
});

//delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
        Todo.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
});


app.get('*', function(req, res){
	res.sendfile('./public/index.html'); //load the single view file (angular with handle the page changes on the front-end)
});


app.listen(8080);
console.log("App listening on port 8080");