
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.register = function(req, res){
    res.render('register', { title: 'MyInventory' });
};

exports.registration = function(req, res, model){
    var name = req.body.name,
        username = req.body.username,
        password = req.body.password,
        confirmationpassword = req.body.confirmationpassword,
        email = req.body.email;

    var error='';
    if(!name || name==='') { error = 'Missing the Name'; }
    if(!username || username==='') { error = 'Missing the Username'; }
    if(!password || password==='') { error = 'Missing the Password'; }
    if(!confirmationpassword || confirmationpassword==='') { error = 'Missing the Confirmation Password'; }
    if(confirmationpassword !== password) { error = 'The two passwords don\'t match'; }
    if(!email || email==='') { error = 'Missing the Email'; }

    if(error !== '') {
        console.log(error);
        res.method = 'get';
        res.redirect('/register');
    }
    //Try to create a user
    if(model){
        model.createUser(name, username,email, password,
            function(){
                res.method = 'get';
                res.redirect('/login');
            });
    }
};
