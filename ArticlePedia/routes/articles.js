var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/articlepedia')
var ObjectId = require('mongodb').ObjectID;

/* GET users listing. */
router.get('/', function(req, res) {
  var collection = db.get('articles');
  collection.find({}, function(err,articles){
    if(err) throw err;
    res.json(articles);
  });
});

router.delete('/:articleid', function(req, res){
  var collection = db.get('articles');
  collection.remove({ _id: req.params.articleid }, function(err, article){
      if (err) throw err;
      res.json(article);
  });
});

router.post('/', function(req, res){
  var collection = db.get('articles');
  console.log(req.body);
  collection.insert({
      title: req.body.title,
      URL: req.body.URL,
      votes: 0,
      user: "Admin",
      comments: [],
  }, function(err, article){
      if (err) throw err;
      res.json(article);
  });
});

router.get('/:articleid', function(req, res) {
  var collection = db.get('articles');
  collection.findOne({ _id: req.params.articleid }, function(err, article){
      if (err) throw err;
      res.json(article);
  });
});

router.put('/:articleid', function(req, res) {
    console.log(req.body.articleid);
    console.log(req.body.votes);
    var collection = db.get('articles');
    collection.findOneAndUpdate({ _id: req.params.articleid },{ $set: { "votes" : req.body.votes } },function(err, article){
      if (err) throw err;
      res.json(article);
  });
});

//TODO: Update comments
router.post('/:articleid/:commentid', function(req, res) {
    console.log(req.body.comments);
    var collection = db.get('articles');
    collection.findOneAndUpdate({ _id: req.params.articleid },{ $set: { "comments" : req.body.comments } },function(err, article){
      if (err) throw err;
      res.json(article);
  });
});

router.delete('/:articleid/:commentid', function(req, res){
  var collection = db.get('articles');
  console.log(req.body.comments);
  collection.findOneAndUpdate({ _id: req.params.articleid },{ $set: { "comments" : req.body.comments } },function(err, article){
    if (err) throw err;
    res.json(article);
  });
});

//db.getCollection('articles').update({'title': 'Why AngularJS?', 'comments.commentid' : 1}, {$set:{'comments.$.votes':1}})
//db.getCollection('articles').update({_id: ObjectId("5ad3b49c84eea2c3d997c400"), 'comments.commentid' : 1}, {$set:{'comments.$.votes':1}})
router.put('/:articleid/:commentid', function(req, res) {
  var collection = db.get('articles');
  var id = new ObjectId(req.params.articleid);
  var commentid = parseInt(req.params.commentid);
  collection.update({ _id: id, 'comments.commentid': commentid },{ $set: { 'comments.$.votes' : req.body.votes } },function(err, article){
    console.log(article);
    if (err) throw err;
    res.json(article);
});
});

module.exports = router;
