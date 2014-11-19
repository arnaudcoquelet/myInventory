
/*
 * GET users listing.
 */

exports.list = function(req, res, model){
    if(model) {
        model.findNotes( function(err,notes){
            var breadcrumbs = [
                {name: 'Note'    , url: '', class: 'active'}
            ];

            res.render('noteList',
                {
                    title: 'MyInventory',
                    notes: notes,
                    displayLevel: 4,
                    breadcrumbs: breadcrumbs
                });
        });
    }
    else {res.redirect('/note'); }
};

exports.details = function (req, res, model) {
    var id = req.params.noteid;
    var breadcrumbs = [ {name: 'Note', url: '/note', class: ''} ];

    if (id && model) {
        model.findNoteById(id, function(err, note) {
            if (err) {
                res.redirect("/note");
            }
            if (note) {
                    breadcrumbs = [
                        {name: 'Note', url: '/note', class: ''},
                        {name: note.title, url: '', class: 'active'}
                    ];

                    res.render('noteDetails', { title: 'MyInventory',
                        note: note,
                        breadcrumbs: breadcrumbs });
            }
        })
    }
    else {
        res.redirect("/note");
    }
};

exports.list_json = function (req, res, model) {
    if (model) {
        model.findNotes(function (err, notes) {
            if (err) {res.json([]);}
            if (notes) { res.json(notes); }
        })
    }
    else {
        res.json([]);
    }
};

exports.details_json = function (req, res, model) {
    var id = req.params.noteid;
    if (model) {
        model.findNoteById(id, function (err, note) {
            if (err) {res.json({});}
            if (note) { res.json(note); }
        })
    }
    else {
        res.json({});
    }
};

exports.author_json = function (req, res, model) {
    var id = req.params.noteid;
    res.json({});

    if (model) {
        model.findNoteById(id, function (err, note) {
            if (err) {res.json({});}
            if (note) { res.json(note); }
        })
    }
    else {
        res.json({});
    }
};

/*
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

*/