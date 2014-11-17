/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function (req, res, model) {
    var usergroupid = req.params.usergroupid;
    var breadcrumbs = [
        {name: 'UserGroup', url: '', class: ''}
    ];

    res.render('usergroupList',
        {
            title: 'MyInventory',
            displayLevel: 0,
            breadcrumbs: breadcrumbs
        }
    );
};

exports.list_json = function (req, res, model) {
    if (model) {
        model.findUserGroupAll(function (err, usergroups) {
            if (err) {res.json([]);}
            if (usergroups) { res.json(usergroups); }
        })
    }
    else {
        res.json([]);
    }
};

exports.listdetails_json = function (req, res, model) {
    var usergroupid = req.params.usergroupid;
    if (model) {
        model.findUserByUserGroupId(usergroupid, function (err, users) {
            if (err) {res.json([]);}
            var tmpUsers = [];
            if (! users instanceof Array){
                tmpUsers.push(users);
            }
            else{
                tmpUsers = users;
            }

            if (tmpUsers) { res.json(tmpUsers); }
        })
    }
    else {
        res.json([]);
    }
};

exports.details = function (req, res, model) {
    var id = req.params.id;
    var breadcrumbs = [ {name: 'SiteGroup', url: '/sitegroup', class: ''} ];

    if (id && model) {
        model.findSiteGroupById(id, function(err, sitegroup) {
            if (err) {
                res.redirect("/sitegroup");
            }
            if (sitegroup) {
                sitegroup.getSites().on('success', function(sites){
                    breadcrumbs = [
                        {name: 'Site Group', url: '/sitegroup', class: ''},
                        {name: sitegroup.name, url: '', class: 'active'}
                    ];

                    res.render('siteList', { title: 'MyInventory',
                        sitegroup: sitegroup,
                        sites: sites,
                        breadcrumbs: breadcrumbs });
                });
            }
        })
    }
    else {
        res.redirect("/sitegroup");
    }
};

exports.create = function (req, res, model) {
    var name = req.body.name;
    var role = req.body.role;
    var error = '';
    res.method = 'get';

    if (!name || name === '') { error = 'Missing the UserGroup'; }
    if (!role || role === '') { error = 'Missing the Role'; }
    if(model){
        model.createUserGroup({name: name, role: role}, function (err, usergroup) {
            res.redirect('/admin/usergroup');
        });
    }
    else { res.redirect('/admin/usergroup');}
};

exports.update = function (req, res, model) {
    var id   = req.body.id;
    var name = req.body.name;
    var role = req.body.role;
    var error = '';
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the UserGroup Id'; }
    if (!name || name === '') { error = 'Missing the UserGroup'; }
    if (!role || role === '') { error = 'Missing the Role'; }
    if(model){
        model.updateUserGroupById(id, {name:name, role:role} , function (err, usergroup) {
            res.redirect('/admin/usergroup');
        });
    }
    else { res.redirect('/admin/usergroup');}
};

exports.delete = function (req, res, model) {
    var id = req.body.id;
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the UserGroup Id'; }
    if(id && model){
        model.deleteUserGroupById(id, function(err, usergroup){
            res.redirect('/admin/usergroup');
        })
    }
    else {
        res.redirect('/admin/usergroup');
    }
};

exports.addUser = function (req, res, model) {
    var usergroupid = req.body.usergroupid;
    var userid = req.body.selectedUser;

    var error = '';
    //res.method = 'get';

    if (!usergroupid   ||   usergroupid === '') { error = 'Missing the UserGroup Id'; }
    if (!userid || userid === '') { error = 'Missing the User Id'; }

    if(model){
        model.addUserToUserGroupById({userid: userid, usergroupid: usergroupid}, function (err, usergroup) {
            console.log('Modified UserGroup:', usergroup);
            res.redirect('/admin/usergroup/' + usergroup.id);
        });
    }
    else { res.redirect('/admin/usergroup');}

};

exports.removeUser = function (req, res, model) {
    var usergroupid = req.body.usergroupid;
    var userid = req.body.id;

    var error = '';
    res.method = 'get';

    if (!usergroupid   ||   usergroupid === '') { error = 'Missing the UserGroup Id'; }
    if (!userid || userid === '') { error = 'Missing the User Id'; }

    if(model){
        model.removeUserFromUserGroupById({userid: userid, usergroupid: usergroupid}, function (err, usergroup) {
            console.log('Modified UserGroup:', usergroup);
            res.redirect('/admin/usergroup/' + usergroup.id);
        });
    }
    else { res.redirect('/admin/usergroup');}

};