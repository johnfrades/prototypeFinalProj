var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');




app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));


//mongoose.connect('mongodb://localhost/sampledb');
mongoose.connect('mongodb://admin:admin@ds137197.mlab.com:37197/theproject');


var personSchema = new mongoose.Schema({
	courseOutline: String,
	course: String,
	level: Number,
	location: String,
	courseStart: Date,
	courseEnd: Date,
	studentID: Number,
	firstname: String,
	lastname: String,
	address: String,
	suburb: String,
	city: String,
	postCode: Number,
	mobilePhone: Number,
	email: String,
	visaStatus: String,
	employmentStatus: String
});

var courseSchema = new mongoose.Schema({
	thecourse: String,
	thesubjects: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'subject'
		}
	]
});


var subjectSchema = new mongoose.Schema({
	subjects: String
});






var Person = mongoose.model('person', personSchema);
var Course = mongoose.model('course', courseSchema);
var Subject = mongoose.model('subject', subjectSchema);



app.get('/', function(req, res){
	Course.find({}, function(err, theCourse){
		if(err){
			console.log(err);
		} else {
			res.render('addcourse', {theCourse: theCourse});
		}
	})
});



app.get('/addstudent', function(req, res){
	Course.find({}).populate('thesubjects').exec(function(err, course){
		if(err){
			console.log(err);
		} else {
			res.render('homepage', {theCourses: course});
		}
	});
});




app.post('/addcourse', function(req, res){
	var course = {
		thecourse: req.body.thecourse,
	}

	Course.create(course, function(err, newCourse){
		if(err){
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

app.post('/addsubject', function(req, res){
	var subject = {
		subjects: req.body.newSubject
	}

	Course.findById({_id: req.body.subjectadd}, function(err, updateCourseSubject){
		if(err){
			console.log(err);
		} else {
			Subject.create(subject, function(err, addingSubject){
				if(err){
					console.log(err);
				} else {
					updateCourseSubject.thesubjects.push(addingSubject);
					updateCourseSubject.save();
					res.redirect('/');
				}
			});
		}
	});
});





app.listen(process.env.PORT, function(req, res){
	console.log('Server started');
});