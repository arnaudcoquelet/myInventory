
/*
 * GET users listing.
 */

exports.list = function(req, res, model){
    var usergroupid = req.params.usergroupid;

    if(model) {
        model.findUserGroupById(usergroupid, function(err,usergroup){
            var breadcrumbs = [
                {name: 'User Group'    , url: '/admin/usergroup', class: ''},
                {name: usergroup.name , url: '', class: 'active'}
            ];

            res.render('userList',
                {
                    title: 'MyInventory',
                    usergroup: usergroup,
                    displayLevel: 4,
                    breadcrumbs: breadcrumbs
                });
        });
    }
    else {res.redirect('/admin/usergroup'); }
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


exports.details = function (req, res, model) {
    var id = req.params.userid;
    var breadcrumbs = [ {name: 'UserGroup', url: '/admin/usergroup', class: ''} ];

    if (id && model) {
        model.findUserById(id, function(err, user) {
            if (err) {
                res.redirect("/sitegroup");
            }
            if (user) {
                user.getAddresses().on('success', function(addresses){
                    breadcrumbs = [
                        {name: 'UserGroup', url: '/admin/usergroup', class: ''},
                        {name: user.name, url: '', class: 'active'}
                    ];

                    res.render('userDetails', { title: 'MyInventory',
                        user: user,
                        address: addresses,
                        telephone: [{id:1, title:'main',telephone:'123-456-7890'}],
                        email: [{id:1, title:'main',email:'nono@alcatel.com'}],
                        breadcrumbs: breadcrumbs });
                });
            }
        })
    }
    else {
        res.redirect("/sitegroup");
    }
};

exports.list_json = function (req, res, model) {
    if (model) {
        model.findUserAll(function (err, users) {
            if (err) {res.json([]);}
            if (users) { res.json(users); }
        })
    }
    else {
        res.json([]);
    }
};

exports.create = function (req, res, model) {
    var name = req.body.name;
    var role = req.body.role;
    var username = req.body.username;
    var error = '';
    res.method = 'get';

    if (!name || name === '') { error = 'Missing the User name'; }
    if (!role || role === '') { error = 'Missing the Role'; }
    if(model){
        model.createUser({name: name, role: role, username: username}, function (err, user) {
            res.redirect('/admin/usergroup');
        });
    }
    else { res.redirect('/admin/usergroup');}
};

exports.update = function (req, res, model) {
    var id   = req.body.id;
    var name = req.body.name;
    var role = req.body.role;
    var username = req.body.username;
    var error = '';
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the User Id'; }
    if (!name || name === '') { error = 'Missing the User'; }
    if (!role || role === '') { error = 'Missing the Role'; }
    if(model){
        model.updateUserById(id, {name:name, role:role, username: username} , function (err, user) {
            res.redirect('/admin/usergroup');
        });
    }
    else { res.redirect('/admin/usergroup');}
};

exports.delete = function (req, res, model) {
    var id = req.body.id;
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the User Id'; }
    if(id && model){
        model.deleteUserById(id, function(err, user){
            res.redirect('/admin/usergroup');
        })
    }
    else {
        res.redirect('/admin/usergroup');
    }
};