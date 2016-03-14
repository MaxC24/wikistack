'use strict';
var express = require('express');
var router = express.Router();
var models = require('../models');
var Page = models.Page;
var User = models.User;

// function makeRouter(){

// }

// module.exports = makeRouter;



module.exports = function makeRouter() {

  router.get('/', retrieveAllPages);  // display all pages in the database

  router.post('/', retrieveAddPageForm);  //

  router.get('/add', function(req,res){    // show the addpage form
    res.render('addpage');
  });

  function retrieveAllPages (req,res,next){
    if(req.query.tags){
      console.log(req.query.tags.split(' '));
      var tags_arr = req.query.tags.split(' ');
      Page.find({tags: {$in: tags_arr}}, function(err, data){
        res.render('index', {pages: data});
      });
    } else{

      Page.find({}, function(err, data){
        res.render('index', {pages: data});
      });
      
    }
  }


  function retrieveAddPageForm(req,res,next){
    var page = new Page({
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags.split(' ')
    })
    page.save()
    .then(function(newPage){
      console.log(newPage.route);
      res.redirect(newPage.route);
    })
    .then(null, function(err){
      console.error(err);
    });
  }

  router.get('/search', function(req, res){
    //console.log(req.query);
    res.render('searchbytags');
  });

  router.get('/:page', function(req, res){
    var pageUrl = req.params.page;
    Page.findOne({urlTitle: pageUrl}, function(err, page){
      res.render('wikipage', { title: page.title, content: page.content, tags: page.tags});
    });
  });




  // // a reusable function
  // function respondWithAllTweets (req, res, next){
  //   var allTheTweets = tweetBank.list();
  //   res.render('index', {
  //     title: 'Twitter.js',
  //     tweets: allTheTweets,
  //     showForm: true
  //   });
  // }


  // // single-user page
  // router.get('/users/:username', function(req, res, next){
  //   var tweetsForName = tweetBank.find({ name: req.params.username });
  //   res.render('index', {
  //     title: 'Twitter.js',
  //     tweets: tweetsForName,
  //     showForm: true,
  //     username: req.params.username
  //   });
  // });

  // // single-tweet page
  // router.get('/tweets/:id', function(req, res, next){
  //   var tweetsWithThatId = tweetBank.find({ id: Number(req.params.id) });
  //   res.render('index', {
  //     title: 'Twitter.js',
  //     tweets: tweetsWithThatId // an array of only one element ;-)
  //   });
  // });

  // // create a new tweet
  // router.post('/tweets', function(req, res, next){
  //   var newTweet = tweetBank.add(req.body.name, req.body.text);
  //   io.sockets.emit('new_tweet', newTweet);
  //   res.redirect('/');
  // });


  return router;
}














