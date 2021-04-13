module.exports = function(app, passport, db, uniqid) {
  // console.log(db)

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('letters').find().toArray((err, result) => {
          // console.log(result.filter(letter=>letter.id=="1")[0])
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            communityLetters: result,
            userLetters: result.filter(letter=>{letter.authorID===req.user.id}),
            selectedReference: null,
            prefill: result.filter(letter=>letter.id==1)[0],
            og: result.filter(letter=>letter.id==1)[0]

          })

        })
    });

    // app.get('/communityReference', isLoggedIn, function(req, res) {
    //     db.collection('letters').find().toArray((err, result) => {
    //       if (err) return console.log(err)
    //       let referenceArticle = result.filter(letter=>{letter.id === req.body.selectID})[0]
    //       res.render('profile.ejs', {
    //         user : req.user,
    //         communityLetters: result,
    //         userLetters: result.filter(letter=>{letter.authorID===req.user.id}),
    //         selectedReference: referenceArticle,
    //         prefill: referenceArticle,
    //         og: result.filter(letter=>letter.id==1)[0]
    //       })
    //     })
    // });




    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// Letter routes ===============================================================

    app.post('/communityReference', isLoggedIn, function(req, res) {
    db.collection('letters').findOne({id:req.body.id}, (err, result) => {
      if (err) return res.send(500, err)
      res.send(result)
    })
    });

    app.post('/newArticle', (req, res) => {
      db.collection('letters').save({
        title: req.body.title,
        id: uniqid(),
        referenceArticleID: req.body.referenceArticleID,
        authorID: req.user._id,
        authorName: req.user.local.email,
        language: req.body.language,
        body: req.body.body,
        nice: 0
      }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.put('/nice', (req, res) => {
      console.log('Nice!')
      console.log(req.body)
      console.log(`New Nice: ${parseInt(req.body.nice)+1}`)
      db.collection('letters')
      .findOneAndUpdate({
        'id':req.body.id
      },
      {$set:
        {
          nice:parseInt(req.body.nice) + 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
      })
    })

    // app.put('/tDown', (req, res) => {
    //   db.collection('recipes')
    //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //     $set: {thumbUp:req.body.thumbUp - 1}},
          // {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

    app.delete('/letter', (req, res) => {
      console.log(`Deleting: ${req.body.id}`)
      console.log(`There are:`)
      console.log(db.collection('recipes').countDocuments())
      db.collection('recipes').findOneAndDelete({
        "id": `${req.body.id}`
      }, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
