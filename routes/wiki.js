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
    var name = req.body.name;
    var email = req.body.email;
    User.findOrCreate(name, email)
    .then(function(user){
      page.author = user._id;
      return page.save();
    })
    .then(function(newPage){
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

  router.get('/users/:id', function(req, res){
    var id = req.params.id;
    if(!id){
      User.find({}, function(err, users){
        res.render('users', { users: users});
      })
    } else {
      User.find({})
      res.render('users', { users: id});
    }
  });

  return router;
}














