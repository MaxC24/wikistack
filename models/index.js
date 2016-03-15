var mongoose = require('mongoose');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles userbase requests and sends responses. It's async!
mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var pageSchema = new mongoose.Schema({
  title:    {type: String, required: true},
  urlTitle: {type: String, required: true},
  content:  {type: String, required: true},
  status:   {type: String, enum: ['open', 'closed']},
  date:     {type: Date, default: Date.now},
  author:   {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  tags:     {type: Array}
});

var userSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true}
});

pageSchema.virtual('route').get(function () {
  return '/wiki/' + this.urlTitle;
});

function generateUrlTitle (title) {
  if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}

pageSchema.pre('validate',function(next){
  this.urlTitle = generateUrlTitle(this.title);
  next();
});

userSchema.statics.findOrCreate = function (name, email) {
  var self = this
  return self.findOne({email: email}).exec().then(function(user){
    if(user) {return user;}
    else {
      return self.create({
        name: name,
        email: email
      })
    }
  });
}

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema)


module.exports = {
  Page: Page,
  User: User
};