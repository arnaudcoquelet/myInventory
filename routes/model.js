var Sequelize = require('sequelize');
var sequelize = new Sequelize('inventory', 'inventory', 'inventory', {
    //host: "localhost",
    host: "10.118.204.235",
    port: 3306,
    dialect: 'mysql'
});

var User = sequelize.define('user',{
        name: { type: Sequelize.STRING, allowNull: false},
        username: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
        password: { type: Sequelize.STRING, defaultValue: "password", allowNull: false},
        role: { type: Sequelize.STRING, defaultValue: "read"},
        position: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
        deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
},{paranoid: true});

var UserGroup = sequelize.define('usergroup',{
    name: { type: Sequelize.STRING, allowNull: false},
    role: { type: Sequelize.STRING, defaultValue: "read"}
},{paranoid: true});

var Log = sequelize.define('log', {
    action: { type: Sequelize.STRING, defaultValue: "unknown", allowNull: false},
    model: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    text: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
},{paranoid: true});

var Comment = sequelize.define('comment', {
    text: { type: Sequelize.STRING,defaultValue: "", allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
},{paranoid: true});

var Note = sequelize.define('note', {
    title: { type: Sequelize.STRING,defaultValue: "", allowNull: false},
    text: { type: Sequelize.TEXT,defaultValue: "", allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
},{paranoid: true});

var Device = sequelize.define('device', {
    name: { type: Sequelize.STRING, allowNull: false},
    serial: { type: Sequelize.STRING, allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
},{paranoid: true});

var ProductCategory = sequelize.define('ProductCategory', {
    name: { type: Sequelize.STRING, allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
},{paranoid: true});

var Product = sequelize.define('product', {
    name: { type: Sequelize.STRING, allowNull: false},
    part: { type: Sequelize.STRING, defaultValue: "unknown", allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
},{paranoid: true});

var Closet = sequelize.define('closet', {
    name: { type: Sequelize.STRING, allowNull: false},
    spare: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
    canbedeleted: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
},{paranoid: true});

var Floor = sequelize.define('floor', {
    name: { type: Sequelize.STRING, allowNull: false},
    canbedeleted: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
},{paranoid: true});

var Building = sequelize.define('building', {
    name: { type: Sequelize.STRING, allowNull: false},
    canbedeleted: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
},{paranoid: true});

var Address = sequelize.define('address', {
    address1: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    address2: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    city: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    state: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    zipcode: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
},{paranoid: true});

var Telephone = sequelize.define('telephone', {
    title: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    telephone: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
},{paranoid: true});

var Email = sequelize.define('email', {
    title: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    email: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
},{paranoid: true});

var Site = sequelize.define('site', {
    name: { type: Sequelize.STRING, allowNull: false},
    code: { type: Sequelize.STRING, allowNull: false},
    canbedeleted: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false},
    category: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
},{paranoid: true});

var SiteGroup = sequelize.define('sitegroup', {
    name: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    code: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
},{paranoid: true});

//Association
SiteGroup.hasMany(Site, {as: 'Sites'});
SiteGroup.hasMany(Comment, {as:'Comments'});

Site.hasMany(User, {as: 'Contacts', through: 'SitesUsers'});
Site.hasMany(UserGroup, {as: 'UserGroups', through: 'SitesUserGroups'});
Site.hasMany(Address, {as: 'Addresses'});
Site.hasMany(Building, {as: 'Buildings'});
Site.hasMany(Comment, {as:'Comments'});
Site.hasMany(Note, {as:'Notes'});

Building.hasMany(Floor, {as: 'Floors'});
Building.hasMany(Comment, {as:'Comments'});

Floor.hasMany(Closet, {as: 'Closets'});
Floor.hasMany(Comment, {as:'Comments'});

Closet.hasMany(Device, {as: 'Devices'});
Closet.hasMany(Comment, {as:'Comments'});

Device.hasMany(Device, {as:'SubDevices'});
Device.hasMany(Comment, {as:'Comments'});
Device.belongsTo(Product);

ProductCategory.hasMany(Product, {as:'Products'});
ProductCategory.hasMany(Comment, {as:'Comments'});

Product.hasMany(Comment, {as:'Comments'});

UserGroup.hasMany(User, {as: 'Users'});
UserGroup.hasMany(Site, {as: 'Sites', through: 'SitesUserGroups'});

User.hasMany(Address, {as: 'Addresses'});
User.hasMany(Email, {as: 'Emails'});
User.hasMany(Telephone, {as: 'Telephones'});
User.hasMany(Comment, {as: 'Comments'});
User.hasMany(Note, {as: 'Notes'});
User.hasMany(Site, {as: 'Sites', through: 'SitesUsers'});

Comment.belongsTo(User, {as:'Author'});
Note.belongsTo(User, {as:'Author'});

Log.hasMany(Comment, {as:'Comments'});
Log.belongsTo(User, {as:'Author'});

/*
sequelize
    .sync({force:true})
    .on('success', function() {
        console.log("Model Create in DB");
        _createUnassignedSiteGroup();
        _createDefaultProductCategory();
        _createAdminUserGroup();
        _createAdminUser();
        _createDefaultProducts();
        //_createViews();
    })
    .on('failure', function(err) {console.log(err); });
*/


sequelize
    .sync({force:false})
    .on('success', function() {
    })
    .on('failure', function(err) {console.log(err); });


exports.sequelize = sequelize;
exports.User = User;
exports.UserGroup = UserGroup;
exports.SiteGroup = SiteGroup;
exports.Site = Site;
exports.Building = Building;
exports.Floor = Floor;
exports.Closet = Closet;
exports.Device = Device;
exports.ProductCategory = ProductCategory;
exports.Product = Product;
exports.Address = Address;
exports.Emails = Email;
exports.Telephones = Telephone;
exports.Comments = Comment;
exports.Notes = Note;




//****************************************//
// USERGROUP
//****************************************//
var _createUserGroup = function (usergroup, next) {
    var newUserGroup = UserGroup.build(usergroup);
    newUserGroup
        .save()
        .on('success', function() {if(next) next(newUserGroup);})
        .on('failure', function(err) {console.log(err); if(next) next(null);});
};
exports.createUserGroup = _createUserGroup;

var _findUserGroupByUserGroupName = function (name, next) {
    console.log("_findUserGroupByUserGroupName(): name=" + name);
    UserGroup
        .find({ where: {name: name} })
        .success(function(usergroup) {
            console.log("usergroup found");
            if(next){
                if(!user){ next("UserGroup " + name + " not found", false);}
                else { next(null,usergroup); }
            }
        })
        .error(function(error){ console.error(error); if(next) next(error,false);});
};
exports.findUserByUserGroupName = _findUserGroupByUserGroupName;

var _findUserGroupById = function(usergroupid, next) {
    UserGroup
        .find(usergroupid)
        .success(function(usergroup) {
            if(next) {
                if(!usergroup){ return next ("UserGroupId " + usergroupid + " not found", false);}
                return next(null,usergroup);
            };
        })
        .error(function(error){
            console.error(error);
            if(next) next(error,false);}
    );
};
exports.findUserGroupById = _findUserGroupById;

var _findUserGroupAll = function(next){
    UserGroup.findAll({}).success(function(usergroups) {
        var tmpUserGroups = [];
        if (! usergroups instanceof Array){ tmpUserGroups.push(usergroups); }
        else{ tmpUserGroups = usergroups; }

        if(next) next(null, tmpUserGroups);
    })
};
exports.findUserGroupAll = _findUserGroupAll;

var _createAdminUserGroup = function(){
    var chainer = new Sequelize.Utils.QueryChainer;
    var usergroup = UserGroup.build( { name: 'Administrators', role: 'Admin' } );

    chainer
        .add(usergroup.save())
        .run()
        .on('success', function() {

        })
        .on('failure', function(err) {
        });
};
exports.createAdminUserGroup=_createAdminUserGroup;

var _updateUserGroupById = function(id,usergroup, next){
    _findUserGroupById(id, function(err, newUserGroup){
        if(err){ if(next) next(err, false);}
        if(!newUserGroup){ if(next) next("UserGroup not found", false);}

        newUserGroup.updateAttributes(usergroup).success(function() {
            //*** Add log
            _createLog("UPDATE",'USERGROUP','Update usergroup(' + id + '): name=' + newUserGroup.name + " role=" + newUserGroup.role, null, function(err, log){
                if(next) return next(null, newUserGroup);
            });
        });
    });
};
exports.updateUserGroupById = _updateUserGroupById;

var _deleteUserGroupById = function (id, next) {
    UserGroup.find(id).success(function(usergroup) {
        if (!usergroup){ if(next) next("UserGroup  not found", false);}
        var name = usergroup.name;
        var role = usergroup.role;
        usergroup.deleted = true;
        usergroup.destroy().success(function() {
            //*** Add log
            _createLog("DELETE",'USERGROUP','Delete usergroup(' + id + ') ' + name, null, function(err, log){
                if(next) return next(null, null);
            });
        });
    });
};
exports.deleteUserGroupById = _deleteUserGroupById;

var _addUserToUserGroupById = function (info, next){
    console.log('Assign User(', info.userid, ') to UserGroup:', info.usergroupid)
    var usergroupid = info.usergroupid;
    var userid = info.userid;

    _findUserGroupById(usergroupid, function(err, usergroup){
        console.log('Seaching UserGroup:', usergroup);
        if (!usergroup){ next("usergroup not found", false); }

        _findUserById(userid, function(err, user){
            console.log('Seaching User:', user);
            if (!user){ next("user not found", false); }

            usergroup.addUser(user).success(function() {
                if(next) next(null, usergroup);
            });
        });
    });
};
exports.addUserToUserGroupById = _addUserToUserGroupById;

var _removeUserFromUserGroupById = function (info, next){
    console.log('Assign User(', info.userid, ') to UserGroup:', info.usergroupid)
    var usergroupid = info.usergroupid;
    var userid = info.userid;

    _findUserGroupById(usergroupid, function(err, usergroup){
        console.log('Seaching UserGroup:', usergroup);
        if (!usergroup){ next("usergroup not found", false); }

        _findUserById(userid, function(err, user){
            console.log('Seaching User:', user);
            if (!user){ next("user not found", false); }

            usergroup.removeUser(user).success(function() {
                if(next) next(null, usergroup);
            });
        });
    });
};
exports.removeUserFromUserGroupById = _removeUserFromUserGroupById;

//****************************************//
// USER
//****************************************//
var _createUser = function (user, next) {
    var newUser = User.build(user);
    newUser
        .save()
        .on('success', function() {if(next) next(newUser);})
        .on('failure', function(err) {console.log(err); if(next) next(null);});
};
exports.createUser = _createUser;

var _findUserByUsername = function (username, next) {
    console.log("_findUserByUsername(): username=" + username);
    User
        .find({ where: {username: username} })
        .success(function(user) {
            console.log("user found");
            if(next){
                if(!user){ next("User " + username + " not found", false);}
                else { next(null,user); }
            }
        })
        .error(function(error){ console.error(error); if(next) next(error,false);});
};
exports.findUserByUsername = _findUserByUsername;

var _findUserById = function(userid, next) {
    User
        .find(userid)
        .success(function(fuser) {
            console.log("user found");

            if(next) {
                if(!fuser){ return next ("UserId " + userid + " not found", false)}
                return next(null,fuser)
            };
        })
        .error(function(error){ console.error(error); if(next) next(error,false);});
};
exports.findUserById = _findUserById;

var _findUserByUserGroupId = function(usergroupid, next) {
    UserGroup.find(usergroupid).success(function(usergroup) {

        var tmpUsers = [];
        usergroup.getUsers().success(function(users) {
            if (! users instanceof Array){
                tmpUsers.push(users);
            }
            else{
                tmpUsers = users;
            }
            if(next) next(null, tmpUsers);
        }).error(function(error){ console.error(error); if(next) next(error,false);});

    }).error(function(error){ console.error(error); if(next) next(error,false);});

    /*
    User
        .find({usergroupId: usergroupid})
        .success(function(users) {
            var tmpUsers = [];
            if (! users instanceof Array){
                tmpUsers.push(users);
            }
            else{
                tmpUsers = users;
            }

            if(next) next(null, tmpUsers);
        })
      */
};
exports.findUserByUserGroupId = _findUserByUserGroupId;


var _createAdminUser = function(){
    var chainer = new Sequelize.Utils.QueryChainer;
    var user = User.build( { name: 'admin', username: 'admin', password: 'admin', role: 'Admin' } );

    chainer
        .add(user.save())
        .run()
        .on('success', function() {

        })
        .on('failure', function(err) {
                    });
};
exports.createAdminUser=_createAdminUser;

var _findUserAll = function(next){
    User.findAll({}).success(function(users) {
        var tmpUsers = [];
        if (! users instanceof Array){ tmpUsers.push(users); }
        else{ tmpUsers = users; }

        if(next) next(null, tmpUsers);
    })
};
exports.findUserAll = _findUserAll;

var _updateUserById = function(id,user, next){
    _findUserById(id, function(err, newUser){
        if(err){ if(next) next(err, false);}
        if(!newUser){ if(next) next("User not found", false);}

        newUser.updateAttributes(user).success(function() {
            //*** Add log
            _createLog("UPDATE",'USER','Update user(' + id + '): name=' + newUser.name + " role=" + newUser.role, null, function(err, log){
                if(next) return next(null, newUser);
            });
        });
    });
};
exports.updateUserById = _updateUserById;

var _deleteUserById = function (id, next) {
    User.find(id).success(function(user) {
        if (!user){ if(next) next("User not found", false);}
        var name = user.name;
        var role = user.role;
        user.destroy().success(function() {
            //*** Add log
            _createLog("DELETE",'USER','Delete user(' + id + ') ' + name, null, function(err, log){
                if(next) return next(null, null);
            });
        });
    });
};
exports.deleteUserById = _deleteUserById;



var _addAddressToUserById = function(id, address, next){
    _findUserById(id, function(err, user){
        if(err){ if(next) next(err, false);}
        if(!user){ if(next) next("User not found", false);}

        Address.build(address).save()
            .on('success', function(newAddress) {
                _createLog("CREATE",'ADDRESS','Create address(' + newAddress.id + '): adress=' + newAddress.address1, null, function(err, log){});

                user.addAddress(newAddress)
                    .on('success', function(user) {
                        _createLog("UPDATE",'USER','Update user(' + id + ') with new address=' + newAddress.id, null, function(err, log){
                            if(next) return next(null, user);
                        });
                    })
                    .on('failure', function(err) { if(next) next(err,false); });
            })
            .on('failure', function(err) { if(next) next(err,false); });
    });
};
exports.addAddressToUserById = _addAddressToUserById;

var _removeAddressToUserById = function(id, addressid, next){
    _findSiteById(id, function(err, user){
        if(err){ if(next) next(err, false);}
        if(!user){ if(next) next("User not found", false);}

        Address.find(addressid)
            .on('success', function(newAddress) {
                user.removeAddress(newAddress)
                    .on('success', function(user) {
                        _createLog("UPDATE",'USER','Update user(' + id + ') remove address=' + addressid, null, function(err, log){
                            if(next) return next(null, user);
                        });
                    })
                    .on('failure', function(err) { if(next) next(err,false); });
            })
            .on('failure', function(err) { if(next) next(err,false); });
    });
};
exports.removeAddressToUserById = _removeAddressToUserById;

var _addTelephoneToUserById = function(id, telephone, next){
    _findUserById(id, function(err, user){
        if(err){ if(next) next(err, false);}
        if(!user){ if(next) next("User not found", false);}

        Telephone.build(telephone).save()
            .on('success', function(newTelephone) {
                _createLog("CREATE",'TELEPHONE','Create telephone(' + newTelephone.id + '): telephone=' + newTelephone.telephone, null, function(err, log){});

                user.addTelephone(newTelephone)
                    .on('success', function(user) {
                        _createLog("UPDATE",'USER','Update user(' + id + ') with new telephone=' + newTelephone.id, null, function(err, log){
                            if(next) return next(null, user);
                        });
                    })
                    .on('failure', function(err) { if(next) next(err,false); });
            })
            .on('failure', function(err) { if(next) next(err,false); });
    });
};
exports.addTelephoneToUserById = _addTelephoneToUserById;

var _removeTelephoneToUserById = function(id, telephoneid, next){
    _findSiteById(id, function(err, user){
        if(err){ if(next) next(err, false);}
        if(!user){ if(next) next("User not found", false);}

        Telephone.find(telephoneid)
            .on('success', function(newTelephone) {
                user.removeTelephone(newTelephone)
                    .on('success', function(user) {
                        _createLog("UPDATE",'USER','Update user(' + id + ') remove telephone=' + telephoneid, null, function(err, log){
                            if(next) return next(null, user);
                        });
                    })
                    .on('failure', function(err) { if(next) next(err,false); });
            })
            .on('failure', function(err) { if(next) next(err,false); });
    });
};
exports.removeTelephoneToUserById = _removeTelephoneToUserById;

var _addEmailToUserById = function(id, email, next){
    _findUserById(id, function(err, user){
        if(err){ if(next) next(err, false);}
        if(!user){ if(next) next("User not found", false);}

        Email.build(email).save()
            .on('success', function(newEmail) {
                _createLog("CREATE",'EMAIL','Create email(' + newEmail.id + '): email=' + newEmail.email, null, function(err, log){});

                user.addEmail(newEmail)
                    .on('success', function(user) {
                        _createLog("UPDATE",'USER','Update user(' + id + ') with new email=' + newEmail.id, null, function(err, log){
                            if(next) return next(null, user);
                        });
                    })
                    .on('failure', function(err) { if(next) next(err,false); });
            })
            .on('failure', function(err) { if(next) next(err,false); });
    });
};
exports.addEmailToUserById = _addEmailToUserById;

var _removeEmailToUserById = function(id, emailid, next){
    _findSiteById(id, function(err, user){
        if(err){ if(next) next(err, false);}
        if(!user){ if(next) next("User not found", false);}

        Email.find(emailid)
            .on('success', function(newEmail) {
                user.removeEmail(newEmail)
                    .on('success', function(user) {
                        _createLog("UPDATE",'USER','Update user(' + id + ') remove email=' + emailid, null, function(err, log){
                            if(next) return next(null, user);
                        });
                    })
                    .on('failure', function(err) { if(next) next(err,false); });
            })
            .on('failure', function(err) { if(next) next(err,false); });
    });
};
exports.removeEmailToUserById = _removeEmailToUserById;



//****************************************//
// ADDRESS
//****************************************//
var _updateAddressById = function(id, address, next){
        Address.find(id)
            .on('success', function(newAddress) {
                newAddress.updateAttributes(address)
                    .on('success', function(naddress) {
                        _createLog("UPDATE",'ADDRESS','Update address(' + id + ')', null, function(err, log){
                                                    if(next) return next(null, naddress);
                                                });
                    })
                    .on('failure', function(err) { if(next) next(err,false); });
            })
            .on('failure', function(err) { if(next) next(err,false); });
};
exports.updateAddressById = _updateAddressById;



//****************************************//
// SITEGROUP
//****************************************//
var _findSiteGroupAllDetails = function(next){
    SiteGroup.findAll({where: {deleted: false},include: [{ model: Site, as: 'Sites' }] }).success(function(sitegroups) {
        var tmpSiteGroups = [];
        if (! sitegroups instanceof Array){ tmpSiteGroups.push(sitegroups); }
        else{ tmpSiteGroups = sitegroups; }

        if(next) return next(null, tmpSiteGroups);
    })
};
exports.findSiteGroupAllDetails = _findSiteGroupAllDetails;

var _findSiteGroupAll = function(next){
    SiteGroup.findAll({where: {deleted: false}}).success(function(sitegroups) {
        var tmpSiteGroups = [];
        if (! sitegroups instanceof Array){ tmpSiteGroups.push(sitegroups); }
        else{ tmpSiteGroups = sitegroups; }

        if(next) next(null, tmpSiteGroups);
    })
};
exports.findSiteGroupAll = _findSiteGroupAll;

var _findSiteGroupById = function(id,next){
    SiteGroup
        .find(id)
        .success(function(sitegroup) {
            if (!sitegroup){ next("sitegroup not found", false); }

            if(next) next(null, sitegroup);
        })
};
exports.findSiteGroupById = _findSiteGroupById;

var _createSiteGroup = function (sitegroup, next) {
    console.log('create a new SiteGroup:', sitegroup);

    var newSiteGroup = SiteGroup.build(sitegroup);
    newSiteGroup.save()
        .on('success', function() {
            console.log('New SiteGroup created');
            _createSiteWithSiteGroupId(newSiteGroup.id, {name:'New Site', code:'000'}, function(err, site){
                if(next){
                    if(err){ next(err,false);}
                    else {next(null, newSiteGroup); }

                }  })
            })
        .on('failure', function(err) {
            console.log('Error during creation of a new SiteGroup');

            if(next) next(err,false);
        })
};
exports.createSiteGroup = _createSiteGroup;

var _updateSiteGroupById = function(id,sitegroup, next){
    _findSiteGroupById(id, function(err, newSiteGroup){
        if(err){ if(next) next(err, false);}
        if(!newSiteGroup){ if(next) next("SiteGroup not found", false);}

        newSiteGroup.updateAttributes(sitegroup).success(function() {
            //*** Add log
            _createLog("UPDATE",'SITEGROUP','Update sitegroup(' + id + '): name=' + newSiteGroup.name + " code=" + newSiteGroup.code, null, function(err, log){
                if(next) return next(null, newSiteGroup);
            });
        });
    });
};
exports.updateSiteGroupById = _updateSiteGroupById;

var _deleteSiteGroupById = function (id, next) {
    SiteGroup.find(id).success(function(sitegroup) {
        if (!sitegroup){ if(next) next("SiteGroup  not found", false);}
        var name = sitegroup.name;
        var code = sitegroup.code;
        sitegroup.deleted = true;
        sitegroup.save().success(function() {
            //*** Add log
            _createLog("DELETE",'SITEGROUP','Delete sitegroup(' + id + ') ' + name, null, function(err, log){
                if(next) return next(null, null);
            });
        });
    });
};
exports.deleteSiteGroupById = _deleteSiteGroupById;

//Create one Site for Unassigned devices
var _createUnassignedSiteGroup = function(){
    _createSiteGroup({name:"_Unassigned", code: "_Unassigned"}, null);
};
exports.createUnassignedSiteGroup=_createUnassignedSiteGroup;



//****************************************//
// SITE
//****************************************//
var _findSiteAllDetails = function(next){
    Site.findAll({where: {deleted: false},include: [{ model: Building, as: 'Buildings' }] }).success(function(sites) {
        var tmpSites = [];
        if (! sites instanceof Array){
            tmpSites.push(sites);
        }
        else{
            tmpSites = sites;
        }

        if(next) return next(null, tmpSites);
    })
};
exports.findSiteAllDetails = _findSiteAllDetails;

var _findSiteAll = function(next){
    Site.findAll({where: {deleted: false}}).success(function(sites) {
        var tmpSites = [];
        if (! sites instanceof Array){
            tmpSites.push(sites);
        }
        else{
            tmpSites = sites;
        }

        if(next) return next(null, tmpSites);
    })
};
exports.findSiteAll = _findSiteAll;

var _findSiteAllBySiteGroupId = function(sitegroupid, next){
    _findSiteGroupById(sitegroupid, function(err, sitegroup){
        if(err) {if(next) return next(err, []);}
        if(!sitegroup) {if(next) return next("SiteGroup not found", []);}

        sitegroup.getSites({where: {deleted: false}})
            .on('success', function(sites){
                if(next) next(null, sites);
            })
            .on('failure', function(error){
                if(next) next(error, false);
            });
    });
};
exports.findSiteAllBySiteGroupId = _findSiteAllBySiteGroupId;

var _findSiteById = function(id,next){
    Site
        .find(id)
        .success(function(site) {
            if (!site){ next("site not found", false); }

            if(next) return next(null, site);
        })
};
exports.findSiteById = _findSiteById;

var _findSiteByCode = function(code,next){
    Site
        .find({where: {code: code}})
        .success(function(site) {
            if (!site){ next("site not found", false); }

            if(next) return next(null, site);
        })
};
exports.findSiteByCode = _findSiteByCode;

var _createSite = function (site, next) {
    var newSite = Site.build(site);
    var newAddress = Address.build();

    newAddress.save()
        .on('success', function(address) {
        newSite.save()
                .on('success', function() {
                    newSite.addAddress(newAddress);

                    _createBuildingWithSiteId(newSite.id, {name:'Main'}, function(err,building){
                        if(next){
                            if(err) { next(err,false); }
                            else { next(null, newSite);}
                        }
                    });
                })
                .on('failure', function(err) {
                    if(next) next(err,false);
                });
    })
    .on('failure', function(err) { if(next) next(err,false); });
};
exports.createSite = _createSite;

var _createSiteWithSiteGroupId = function (sitegroupid, site, next) {
    _createSite(site,function(err, newSite){
        if(newSite){
            _findSiteGroupById(sitegroupid, function(err, sitegroup){
                if(sitegroup){
                    sitegroup.addSite(newSite)
                        .on('success', function(){
                            _createLog("CREATE",'SITE','Create site: name=' + site.name + " code=" + site.code + ' in ' + sitegroup.name, null, function(err, log){
                                if(next) return next(null, newSite);
                            });
                        })
                        .on('failure', function(error){
                            if(next) next(error, false);
                        });
                }
            });
        }
    });

};
exports.createSiteWithSiteGroupId = _createSiteWithSiteGroupId;

var _updateSiteById = function(id, site, next){
    _findSiteById(id, function(err, newSite){
        if(err){ if(next) next(err, false);}
        if(!newSite){ if(next) next("Site not found", false);}

        newSite.updateAttributes(site).success(function() {
            //*** Add log
            _createLog("UPDATE",'SITE','Update site(' + id + '): name=' + site.name + " code=" + site.code, null, function(err, log){
                if(next) return next(null, site);
            });
        });
    });
};
exports.updateSiteById = _updateSiteById;

var _deleteSiteById = function (id, next) {
    Site.find(id).success(function(site) {
        if (!site){ if(next) next("Site  not found", false);}
        var name = site.name;
        var code = site.code;
        site.deleted = true;
        site.save().success(function() {
            //*** Add log
            _createLog("DELETE",'SITE','Delete site(' + id + ') ' + name, null, function(err, log){
                if(next) return next(null, null);
            });
        });
    });
};
exports.deleteSiteById = _deleteSiteById;

var _findAddressBySiteId = function(id, next){
    Site.find(id, {include: [{ model: Address, as: 'Addresses' }] }).success(function(site) {
        var tmpAddresses = [];
        site.getAddresses().success(function(addresses){
            if (! addresses instanceof Array){
                        tmpAddresses.push(addresses);
                    }
                    else{
                        tmpAddresses = addresses;
                    }
            if(next) return next(null, tmpAddresses);
        });
    })
};
exports.findAddressBySiteId = _findAddressBySiteId;

var _addAddressToSiteById = function(id, address, next){
    _findSiteById(id, function(err, site){
        if(err){ if(next) next(err, false);}
        if(!site){ if(next) next("Site not found", false);}

        Address.build(address).save()
            .on('success', function(newAddress) {
                _createLog("CREATE",'ADDRESS','Create address(' + newAddress.id + '): adress=' + newAddress.address1, null, function(err, log){});

                site.addAddress(newAddress)
                    .on('success', function(site) {
                        _createLog("UPDATE",'SITE','Update site(' + id + ') with new address=' + newAddress.id, null, function(err, log){
                            if(next) return next(null, site);
                        });
                    })
                    .on('failure', function(err) { if(next) next(err,false); });
            })
            .on('failure', function(err) { if(next) next(err,false); });
    });
};
exports.addAddressToSiteById = _addAddressToSiteById;

var _removeAddressToSiteById = function(id, addressid, next){
    _findSiteById(id, function(err, site){
        if(err){ if(next) next(err, false);}
        if(!site){ if(next) next("Site not found", false);}

        Address.find(addressid)
            .on('success', function(newAddress) {
                site.removeAddress(newAddress)
                    .on('success', function(site) {
                        _createLog("UPDATE",'SITE','Update site(' + id + ') remove address=' + addressid, null, function(err, log){
                            if(next) return next(null, site);
                        });
                    })
                    .on('failure', function(err) { if(next) next(err,false); });
            })
            .on('failure', function(err) { if(next) next(err,false); });
    });
};
exports.removeAddressToSiteById = _removeAddressToSiteById;

var _findContactBySiteId = function(id, next){
    var sql = "SELECT `users`.* FROM `users`, `SitesUsers` WHERE `SitesUsers`.deletedAt IS NULL AND `SitesUsers`.`userId`=`users`.`id` AND `SitesUsers`.`siteId`=" + id ;
    //var sql = "SELECT *  from view_closetalldetails where sitegroup_id=" + sitegroupid;
    sequelize.query(sql, null, {raw: true})
            .success(function(users) {
                if (!users){ if(next) next("Users not found", false);}
                if(next) next(null, users);
            });
};
exports.findContactBySiteId = _findContactBySiteId;

var _addContactToSiteById = function (id, userid, next) {
    _findSiteById(id, function (err, site) {
        if (err) {
            if (next) next(err, false);
        }
        if (!site) {
            if (next) next("Site not found", false);
        }

        _findUserById(userid, function (err, user) {
            if (err) {
                if (next) next(err, false);
            }
            if (!user) {
                if (next) next("User not found", false);
            }


            var sql = "UPDATE `SitesUsers` SET deletedAt = NULL WHERE `userId`=" + userid + " AND `siteId`=" + id;
            sequelize.query(sql, null, {raw: true}).success(function() {});

            site.addContact(user)
                .on('success', function (site) {
                    _createLog("UPDATE", 'SITE', 'Update site(' + id + ') with new user=' + user.id, null, function (err, log) {
                        if (next) return next(null, site);
                    });
                })
                .on('failure', function (err) {
                    if (next) next(err, false);
                });
        });
    });
};
exports.addContactToSiteById = _addContactToSiteById;

var _removeContactToSiteById = function(id, userid, next){
    _findSiteById(id, function(err, site){

        if(err){ if(next) next(err, false);}
        if(!site){ if(next) next("Site not found", false);}

        User.find(userid)
            .on('success', function(newUser) {
                site.removeContact(newUser)
                    .on('success', function(site) {
                        _createLog("UPDATE",'SITE','Update site(' + id + ') remove user=' + userid, null, function(err, log){
                            if(next) return next(null, site);
                        });
                    })
                    .on('failure', function(err) { if(next) next(err,false); });
            })
            .on('failure', function(err) { if(next) next(err,false); });
    });
};
exports.removeContactToSiteById = _removeContactToSiteById;

var _findNoteBySiteId = function(id, next){
    Site.find(id, {include: [{ model: Comment, as: 'Notes' }] }).success(function(site) {
        var tmpNotes = [];
        site.getNotes().success(function(notes){
            if (! notes instanceof Array){
                tmpNotes.push(notes);
                    }
                    else{
                tmpNotes = notes;
                    }
            if(next) return next(null, tmpNotes);
        });
    });
};
exports.findNoteBySiteId = _findNoteBySiteId;

var _addNoteToSiteById = function(id, note, next){
    _findSiteById(id, function(err, site){
        if(err){ if(next) next(err, false);}
        if(!site){ if(next) next("Site not found", false);}

        Note.build(note).save()
            .on('success', function(newNote) {
                _createLog("CREATE",'NOTE','Create note(' + newNote.id + '): title=' + newNote.title, null, function(err, log){});

                site.addNote(newNote)
                    .on('success', function(site) {
                        _createLog("UPDATE",'SITE','Update site(' + id + ') with new note=' + newNote.id, null, function(err, log){
                            if(next) return next(null, site);
                        });
                    })
                    .on('failure', function(err) { if(next) next(err,false); });
            })
            .on('failure', function(err) { if(next) next(err,false); });
    });
};
exports.addNoteToSiteById = _addNoteToSiteById;

var _removeNoteToSiteById = function(id, noteid, next){
    _findSiteById(id, function(err, site){
        if(err){ if(next) next(err, false);}
        if(!site){ if(next) next("Site not found", false);}

        Note.find(noteid)
            .on('success', function(newNote) {
                site.removeAddress(newNote)
                    .on('success', function(site) {
                        _createLog("UPDATE",'SITE','Update site(' + id + ') remove note=' + noteid, null, function(err, log){
                            if(next) return next(null, site);
                        });
                    })
                    .on('failure', function(err) { if(next) next(err,false); });
            })
            .on('failure', function(err) { if(next) next(err,false); });
    });
};
exports.removeNoteToSiteById = _removeNoteToSiteById;


//Create one Site for Unassigned devices
var _createUnassignedSite = function(){
    _createSite({name: "_Unassigned", code: "_Unassigned", canbedeleted:false}, function(err, site){});
};
exports.createUnassignedSite=_createUnassignedSite;



//****************************************//
// Buildings
//****************************************//
var _findBuildingAll = function(next){
    Building.findAll({where: {deleted: false}}).success(function(buildings) {
        var tmpBuildings = [];
        if (! buildings instanceof Array){
            tmpBuildings.push(buildings);
        }
        else{
            tmpBuildings = buildings;
        }

        if(next) return next(null, tmpBuildings);
    })
};
exports.findBuildingAll = _findBuildingAll;

var _findBuildingById = function(id, next){
    Building.find(id).success(function(building) {
        if (!building){ if(next) next("building not found", false);}
        if(next) return next(null, building);
    })
};
exports.findBuildingById = _findBuildingById;

var _findBuildingAllBySiteId = function(siteid, next){
    _findSiteById(siteid, function(err, site){
        if(err) {if(next) return next(err, []);}
        if(!site) {if(next) return next("Building not found", []);}

        site.getBuildings({where: {deleted: false}})
            .on('success', function(buildings){
                if(next) next(null, buildings);
            })
            .on('failure', function(error){
                if(next) next(error, false);
            });
    });
};
exports.findBuildingAllBySiteId = _findBuildingAllBySiteId;

var _createBuilding = function (building, next) {
    var newBuilding = Building.build(building);

    newBuilding.save()
        .on('success', function() {
            _createFloorWithBuildingId(newBuilding.id,{name: 'Main'}, function(err, floor){
                if(next){
                    if(err){ next(err,false); }
                    else{ next(null,newBuilding);}
                }
            });
        })
        .on('failure', function(err) {
            if(next) next(err,false);
        })
};
exports.createBuilding = _createBuilding;

var _createBuildingWithSiteId = function (id, building, next) {
    //Create new building
    _createBuilding(building, function(err, newBuilding){
        if(newBuilding){
            //Get Site from SiteCode
            _findSiteById(id, function(err, site){
                //Link Building to Site
                site.addBuilding(newBuilding)
                    .on('success', function(){
                        if(next) next(null, newBuilding);
                    })
                    .on('failure', function(error){
                        if(next) next(error, false);
                    });
            });
        }
    });
};
exports.createBuildingWithSiteId = _createBuildingWithSiteId;

var _createBuildingWithSitecode = function (sitecode, building, next) {
    //Create new building
    _createBuilding(building, function(err, newBuilding){
        if(newBuilding){
            //Get Site from SiteCode
            _findSiteByCode(sitecode, function(err, site){
                //Link Building to Site
                site.addBuilding(newBuilding)
                    .on('success', function(){
                        if(next) next(null, newBuilding);
                    })
                    .on('failure', function(error){
                        if(next) next(error, false);
                    });
            });
        }
    });
};
exports.createBuildingWithSitecode = _createBuildingWithSitecode;

var _updateBuildingById = function(id, building,  next){
    _findBuildingById(id, function(err, newBuilding){
        if(err){ if(next) next(err, false);}
        if(!newBuilding){ if(next) next("Building not found", false);}

        newBuilding.updateAttributes(building).success(function() {
            //*** Add log
            _createLog("UPDATE",'BUILDING','Update building(' + id + '): name=' + building.name, null, function(err, log){
                if(next) return next(null, newBuilding);
            });
        });
    });
};
exports.updateBuildingById = _updateBuildingById;

var _deleteBuildingById = function (id, next) {
    Building.find(id).success(function(building) {
        if (!building){ if(next) next("Building  not found", false);}
        var name = building.name;
        building.deleted = true;
        building.save().success(function() {
            //*** Add log
            _createLog("DELETE",'BUILDING','Delete building(' + id + ') ' + name, null, function(err, log){
                if(next) return next(null, null);
            });
        });
    });
};
exports.deleteBuildingById = _deleteBuildingById;

//****************************************//
// Floor
//****************************************//
var _findFloorAll = function(next){
    Floor.findAll({where: {deleted: false}}).success(function(floors) {
        var tmpFloors = [];
        if (! floors instanceof Array){
            tmpFloors.push(floors);
        }
        else{
            tmpFloors = floors;
        }

        if(next) return next(null, tmpFloors);
    })
};
exports.findFloorAll = _findFloorAll;

var _findFloorById = function(id, next){
    Floor.find(id).success(function(floor) {
        if (!floor){ if(next) next("floor not found", false);}
        if(next) return next(null, floor);
    })
};
exports.findFloorById = _findFloorById;

var _findFloorAllByBuildingId = function(buildingid, next){
    _findBuildingById(buildingid, function(err, building){
        if(err) {if(next) return next(err, []);}
        if(!building) {if(next) return next("Building not found", []);}

        building.getFloors({where: {deleted: false}})
            .on('success', function(floors){
                if(next) next(null, floors);
            })
            .on('failure', function(error){
                if(next) next(error, false);
            });
    });
};
exports.findFloorAllByBuildingId = _findFloorAllByBuildingId;

var _createFloor = function (floor, next) {
    var newFloor  = Floor.build(floor);

    newFloor.save()
            .on('success', function() {
                _createLog("CREATE",'FLOOR','Create floor: name=' + floor.name,  null, function(err, log){
                    _createClosetWithFloorId(newFloor.id, { name: 'Main' }, function(err, closet){
                        if(next){
                            if(err){  next(err,false); }
                            else {  next(null, newFloor) };
                        }
                    });
                });
            })
            .on('failure', function(err) {
                if(next) next(err,false);
            });
};
exports.createFloor = _createFloor;

var _createFloorWithBuildingId = function (buildingid, floor, next) {
    //Create new building
    _createFloor(floor, function(err, newFloor){
        if(newFloor){
            //Get Site from SiteCode
            _findBuildingById(buildingid, function(err, building){
                //Link Building to Site
                building.addFloor(newFloor)
                    .on('success', function(){
                        if(next) next(null, newFloor);
                    })
                    .on('failure', function(err){
                        if(next) next(err, false);
                    });
            });
        }
    });
};
exports.createFloorWithBuildingId = _createFloorWithBuildingId;

var _updateFloorById = function(id, floor,  next){
    _findFloorById(id, function(err, newFloor){
        if(err){ if(next) next(err, false);}
        if(!newFloor){ if(next) next("Floor not found", false);}

        newFloor.updateAttributes(floor).success(function() {
            //*** Add log
            _createLog("UPDATE",'FLOOR','Update floor(' + id + '): name=' + floor.name, null, function(err, log){
                if(next) return next(null, newFloor);
            });
        });
    });
};
exports.updateFloorById = _updateFloorById;

var _deleteFloorById = function (id, next) {
    Floor.find(id).success(function(floor) {
        if (!floor){ if(next) next("Floor  not found", false);}
        var name = floor.name;
        floor.deleted = true;
        floor.save().success(function() {
            //*** Add log
            _createLog("DELETE",'FLOOR','Delete floor(' + id + ') ' + name, null, function(err, log){
                if(next) return next(null, null);
            });
        });
    });
};
exports.deleteFloorById = _deleteFloorById;

//****************************************//
// Closet
//****************************************//
var _findClosetAll = function(next){
    Closet.findAll({where: {deleted: false}}).success(function(closets) {
        var tmpClosets = [];
        if (! closets instanceof Array){
            tmpClosets.push(closets);
        }
        else{
            tmpClosets = closets;
        }

        if(next) return next(null, tmpClosets);
    })
};
exports.findClosetAll = _findClosetAll;

var _findClosetById = function(id, next){
    Closet.find(id).success(function(closet) {
        if (!closet){ if(next) next("Closet not found", false);}
        if(next) return next(null, closet);
    })
};
exports.findClosetById = _findClosetById;

var _findClosetAllByFloorId_2 = function(floorid, next){
    _findFloorById(floorid, function(err, floor){
        if(err) {if(next) return next(err, []);}
        if(!floor) {if(next) return next("Floor not found", []);}

        floor.getClosets({where: {deleted: false}})
            .on('success', function(closets){
                if(next) next(null, closets);
            })
            .on('failure', function(error){
                if(next) next(error, false);
            });
    });
};
exports.findClosetAllByFloorId_2 = _findClosetAllByFloorId_2;

var _findClosetAllBySiteGroupId = function(sitegroupid, next){
    var sql = "SELECT *  from view_closetalldetails where sitegroup_id=" + sitegroupid;
    sequelize.query(sql, null, {raw: true})
            .success(function(closets) {
                if (!closets){ if(next) next("Closets not found", false);}
                if(next) next(null, closets);
            });
};
exports.findClosetAllBySiteGroupId = _findClosetAllBySiteGroupId;

var _findClosetAllBySiteId = function(siteid, next){
    var sql = "SELECT *  from view_closetalldetails where site_id=" + siteid;
    sequelize.query(sql, null, {raw: true})
            .success(function(closets) {
                if (!closets){ if(next) next("Closets not found", false);}
                if(next) next(null, closets);
            });
};
exports.findClosetAllBySiteId = _findClosetAllBySiteId;

var _findClosetAllByBuildingId = function(buildingid, next){
    var sql = "SELECT *  from view_closetalldetails where building_id=" + buildingid;
    sequelize.query(sql, null, {raw: true})
            .success(function(closets) {
                if (!closets){ if(next) next("Closets not found", false);}
                if(next) next(null, closets);
            });
};
exports.findClosetAllByBuildingId = _findClosetAllByBuildingId;

var _findClosetAllByFloorId = function(floorid, next){
    var sql = "SELECT *  from view_closetalldetails where floor_id=" + floorid;
    sequelize.query(sql, null, {raw: true})
            .success(function(closets) {
                if (!closets){ if(next) next("Closets not found", false);}
                if(next) next(null, closets);
            });
};
exports.findClosetAllByFloorId = _findClosetAllByFloorId;

var _findClosetAllByClosetId = function(closetid, next){
    var sql = "SELECT *  from view_closetalldetails where closet_id=" + closetid;
    sequelize.query(sql, null, {raw: true})
            .success(function(closets) {
                if (!closets){ if(next) next("Closets not found", false);}
                if(next) next(null, closets);
            });
};
exports.findClosetAllByClosetId = _findClosetAllByClosetId;

var _createCloset = function (closet, next) {
    var newCloset  = Closet.build(closet);

    newCloset.save()
        .on('success', function() {
            _createLog("CREATE",'CLOSET','Create closet: name=' + closet.name,  null, function(err, log){
                if(next) return next(null, newCloset);
            });
        })
        .on('failure', function(err) {
            if(next) next(err,false);
        })
};
exports.createCloset = _createCloset;

var _createClosetWithFloorId = function (floorid, closet, next) {
    //Create new building
    _createCloset(closet, function(err, newCloset){
        if(newCloset){
            //Get Site from SiteCode
            _findFloorById(floorid, function(err, floor){
                //Link Building to Site
                floor.addCloset(newCloset)
                    .on('success', function(){
                        if(next) next(null, newCloset);
                    })
                    .on('failure', function(err){
                        if(next) next(err, false);
                    });
            });
        }
    });
};
exports.createClosetWithFloorId = _createClosetWithFloorId;

var _updateClosetById = function(id, closet,  next){
    _findClosetById(id, function(err, newCloset){
        if(err){ if(next) next(err, false);}
        if(!newCloset){ if(next) next("Closet not found", false);}

        newCloset.updateAttributes(closet).success(function() {
            //*** Add log
            _createLog("UPDATE",'CLOSET','Update closet(' + id + '): name=' + closet.name, null, function(err, log){
                if(next) return next(null, newCloset);
            });
        });
    });
};
exports.updateClosetById = _updateClosetById;

var _deleteClosetById = function (id, next) {
    Closet.find(id).success(function(closet) {
        if (!closet){ if(next) next("Closet  not found", false);}
        var name = closet.name;
        closet.deleted = true;
        closet.save().success(function() {
            //*** Add log
            _createLog("DELETE",'CLOSET','closet floor(' + id + ') ' + name, null, function(err, log){
                if(next) return next(null, null);
            });
        });
    });
};
exports.deleteClosetById = _deleteClosetById;

var _getClosetAllDetails = function(next){
    var sql = "SELECT * from `view_closetalldetails`";
    sequelize.query(sql, null, {raw: true})
        .success(function(closets) {
            if (!closets){ if(next) next("Closets not found", false);}
            if(next) next(null, closets);
        });
}
exports.getClosetAllDetails = _getClosetAllDetails

//****************************************//
// Devices
//****************************************//
var _findDeviceAll = function(next){
    Device.findAll({where: {deleted: false}}).success(function(devices) {
        var tmpDevices = [];
        if (! devices instanceof Array){
            tmpDevices.push(devices);
        }
        else{
            tmpDevices = devices;
        }

        if(next) return next(null, tmpDevices);
    })
};
exports.findDeviceAll = _findDeviceAll;

var _findDeviceAllByClosetId = function(closetId,  next){
    _findClosetById(closetId, function(err,closet){
        if(closet)
        {
            closet.getDevices()
                .on('success', function(devices){
                    if(devices && !devices instanceof Array) {devices=[];}
                    if(next) next(null,devices);
                })
                .on('failure', function(err){
                    if(next) next(err,false);
                });
        }
        else
        {
            if(next) next('Closet not found',false);
        }
    });
};
exports.findDeviceAllByClosetId = _findDeviceAllByClosetId;

var _findDeviceById = function(id, next){
    Device.find(id).success(function(device) {
        if (!device){ if(next) next("Device not found", false);}
        if(next) return next(null, device);
    })
};
exports.findDeviceById = _findDeviceById;

var _createDevice = function (device, next) {
    var newDevice  = Device.build(device);

    newDevice.save()
        .on('success', function() {
            _createLog("CREATE",'DEVICE','Create device: name=' + device.name,  null, function(err, log){
                if(next) return next(null, newDevice);
            });
        })
        .on('failure', function(err) {
            if(next) next(err,false);
        })
};
exports.createDevice = _createDevice;

var _createDeviceWithProductId = function (productid, device, next) {
    _createDevice(device, function(err, newDevice){
        if(newDevice){
            //Get Site from SiteCode
            _findProductById(productid, function(err, product){
                //Link Building to Site

                console.log('newDevice:', newDevice);
                newDevice.setProduct(product)
                    .on('success', function(){
                        if(next) next(null, newDevice);
                    })
                    .on('failure', function(err){
                        if(next) next(err, false);
                    });
            });
        }
    });
};
exports.createDeviceWithProductId = _createDeviceWithProductId;

var _createDeviceWithClosetId = function (closetid,productid, device, next) {
    _createDeviceWithProductId(productid, device, function(err, newDevice){
        if(newDevice){
            //Get Site from SiteCode
            _findClosetById(closetid, function(err, closet){
                //Link Building to Site
                console.log('Add Device to Closet:', closet);
                closet.addDevice(newDevice)
                    .on('success', function(ndevice){
                        console.log('New Device:', ndevice);
                        device.id = ndevice.id;
                        if(next) next(null, device);
                    })
                    .on('failure', function(err){
                        if(next) next(err, false);
                    });
            });
        }
    });
};
exports.createDeviceWithClosetId = _createDeviceWithClosetId;

var _findDeviceAllDetails = function(next){
    var sql = "SELECT * from view_devicesalldetails where device_deleted=0";
    sequelize.query(sql, null, {raw: true})
        .success(function(devices) {
            if (!devices){ if(next) next("Devices not found", false);}
            if(next) next(null, devices);
        });
};
exports.findDeviceAllDetails = _findDeviceAllDetails;

var _findDeviceAllSiteGroupDetails = function(sitegroupid, next){
    var sql = "SELECT * from view_devicesalldetails where device_deleted=0 AND sitegroup_id=" + sitegroupid;
    sequelize.query(sql, null, {raw: true})
        .success(function(devices) {
            if (!devices){ if(next) next("Devices not found", false);}
            if(next) next(null, devices);
        });
};
exports.findDeviceAllSiteGroupDetails = _findDeviceAllSiteGroupDetails;

var _findDeviceAllSiteDetails = function(siteid, next){
    var sql = "SELECT * from view_devicesalldetails where device_deleted=0 AND site_id=" + siteid;
    sequelize.query(sql, null, {raw: true})
        .success(function(devices) {
            if (!devices){ if(next) next("Devices not found", false);}
            if(next) next(null, devices);
        });
};
exports.findDeviceAllSiteDetails = _findDeviceAllSiteDetails;

var _findDeviceAllBuildingDetails = function(buildingid, next){
    var sql = "SELECT * from view_devicesalldetails where device_deleted=0 AND building_id=" + buildingid;
    sequelize.query(sql, null, {raw: true})
        .success(function(devices) {
            if (!devices){ if(next) next("Devices not found", false);}
            if(next) next(null, devices);
        });
};
exports.findDeviceAllBuildingDetails = _findDeviceAllBuildingDetails;

var _findDeviceAllFloorDetails = function(floorid, next){
    var sql = "SELECT * from view_devicesalldetails where device_deleted=0 AND floor_id=" + floorid;
    sequelize.query(sql, null, {raw: true})
        .success(function(devices) {
            if (!devices){ if(next) next("Devices not found", false);}
            if(next) next(null, devices);
        });
};
exports.findDeviceAllFloorDetails = _findDeviceAllFloorDetails;

var _findDeviceAllClosetDetails = function(closetid, next){
    var sql = "SELECT * from view_devicesalldetails where device_deleted=0 AND closet_id=" + closetid;
    sequelize.query(sql, null, {raw: true})
        .success(function(devices) {
            if (!devices){ if(next) next("Devices not found", false);}
            if(next) next(null, devices);
        });
};
exports.findDeviceAllClosetDetails = _findDeviceAllClosetDetails;

var _findDeviceById = function(deviceid, next){
    var sql = "SELECT * from view_devicesalldetails where device_id=" + deviceid;
    sequelize.query(sql, null, {raw: true})
        .success(function(device) {
            if (!device){ if(next) next("Device not found", false);}
            if(next) next(null, device);
        });
};
exports.findDeviceById = _findDeviceById;

var _updateDeviceById = function(id, device, next){
    console.log('Seacrhed device:', device);

    Device.find(id).success( function(deviceFound){

        console.log('Device Found:', deviceFound);
        deviceFound.updateAttributes(device).success(function() {
            //*** Add log
            _createLog("UPDATE",'DEVICE','Update device(' + id + '): name=' + device.name, null, function(err, log){
                if(next) return next(null, deviceFound);
            });
        });
    });

    /*
    _findDeviceById(id, function(err, newDevice){
        if(err){ if(next) next(err, false);}
        if(!newDevice){ if(next) next("Device not found", false);}

        console.log('newDevice Found:', newDevice);
        Device.find(newDevice[0].device_id).success( function(deviceFound){

            console.log('Device Found:', deviceFound);
            deviceFound.updateAttributes(device).success(function() {
                        //*** Add log
                        _createLog("UPDATE",'DEVICE','Update device(' + id + '): name=' + device.name, null, function(err, log){
                            if(next) return next(null, deviceFound);
                        });
                    });
        });
    });
    */
};
exports.updateDeviceById = _updateDeviceById;

var _deleteDeviceById = function (id, next) {
    Device.find(id).success(function(device) {
        if (!device){ if(next) next("Device  not found", false);}
        var name = device.name;
        device.deleted = true;
        device.save().success(function() {
            //*** Add log
            _createLog("DELETE",'DEVICE','Delete device(' + id + ') ' + name, null, function(err, log){
                if(next) return next(null, null);
            });
        });
    });
};
exports.deleteDeviceById = _deleteDeviceById;

//****************************************//
// Product Category
//****************************************//
var _findProductCategoryAll = function(next){
    ProductCategory.findAll({where: {deleted: false}, include: [{ model: Product, as: 'Products' }] }).success(function(productcategories) {
        var tmpproductcategories = [];
        if (! productcategories instanceof Array){ tmpproductcategories.push(productcategories); }
        else{ tmpproductcategories = productcategories; }

        if(next) return next(null, tmpproductcategories);
    })
};
exports.findProductCategoryAll = _findProductCategoryAll;

var _findProductCategoryById = function(id, next){
    ProductCategory.find(id).success(function(productcategory) {
        if (!productcategory){ if(next) next("Product Category not found", false);}
        if(next) return next(null, productcategory);
    })
};
exports.findProductCategoryById = _findProductCategoryById;

var _findProductCategoryByName = function(name, next){
    ProductCategory.findAll({where: {name: name}, limit: 1}).success(function(productcategory) {
        if (!productcategory){ if(next) next("Product Category not found", false);}
        if(next) return next(null, productcategory);
    })
};
exports.findProductCategoryByName = _findProductCategoryByName;

var _createProductCategory = function (productcategory, next) {
    var newProductCategory  = ProductCategory.build(productcategory);

    newProductCategory.save()
        .on('success', function() {
            //Log
            _createLog("CREATE",'ProductCategory','Create product family: name=' + newProductCategory.name,  null, function(err, log){
                if(next) return next(null, newProductCategory);
            });
        })
        .on('failure', function(err) {
            if(next) next(err,false);
        })
};
exports.createProductCategory = _createProductCategory;

var _deleteProductCategoryById = function (id, next) {
    ProductCategory.find(id).success(function(productcategory) {
            if (!productcategory){ if(next) next("Product Category not found", false);}
            var name = productcategory.name
            productcategory.deleted = true;
            productcategory.save().success(function() {
                //*** Add log
                _createLog("DELETE",'ProductCategory','Delete product family('+ id +') name=' + name,  null, function(err, log){
                    if(next) return next(null, null);
                });
            });
        });
};
exports.deleteProductCategoryById = _deleteProductCategoryById;

var _updateProductCategoryById = function (id,productcategory, next) {
    ProductCategory.find(id).success(function(newProductCategory) {
        if (!newProductCategory){ if(next) next("Product Category not found", false);}
        newProductCategory.updateAttributes(productcategory).success(function() {
                //*** Add log
                _createLog("UPDATE",'ProductCategory','Update product family('+ id +') name=' + newProductCategory.name,  null, function(err, log){
                    if(next) return next(null, newProductCategory);
                });
            });
        });
};
exports.updateProductCategoryById = _updateProductCategoryById;

//Create default Product Category
var _createDefaultProductCategory = function(){
        var chainer = new Sequelize.Utils.QueryChainer;

        chainer
            .add(ProductCategory.build({name:'IPD'}).save())
            .add(ProductCategory.build({name:'OND'}).save())
            .add(ProductCategory.build({name:'DATA'}).save())
            .add(ProductCategory.build({name:'VOICE'}).save())
            .add(ProductCategory.build({name:'WIRELESS'}).save())
            .add(ProductCategory.build({name:'SERVER'}).save())
            .add(ProductCategory.build({name:'APPLICATION'}).save())
            .add(ProductCategory.build({name:'OTHER'}).save())

        chainer.run()
            .on('success', function() {
            })
            .on('failure', function(err) {
            });
};
exports.createDefaultProductCategory=_createDefaultProductCategory;



//****************************************//
// Product
//****************************************//
var _findProductAll = function(next){
    Product.findAll({where: {deleted: false}}).success(function(productcategories) {
        var tmpProducts = [];
        if (! products instanceof Array){
            tmpProducts.push(products);
        }
        else{
            tmpProducts = products;
        }

        if(next) return next(null, tmpProducts);
    })
};
exports.findProductAll = _findProductAll;

var _findProductAllByProductCategoryId = function(ProductCategoryid, next){
    _findProductCategoryById(ProductCategoryid, function(err, ProductCategory){
        if(ProductCategory)
        {
            ProductCategory.getProducts()
                .on('success', function(products){
                    if(products && !products instanceof Array) {products=[];}
                    if(next) next(null,products);
                })
                .on('failure', function(err){
                    if(next) next(err,false);
                });
        }
        else
        {
            if(next) next('Product Category not found',false);
        }
    });
};
exports.findProductAllByProductCategoryId = _findProductAllByProductCategoryId;

var _findProductById = function(id, next){
    Product.find(id).success(function(product) {
        if (!product){ if(next) next("Product not found", false);}
        if(next) return next(null, product);
    })
};
exports.findProductById = _findProductById;

var _createProduct = function (product, next) {
    var newProduct  = Product.build(product);

    newProduct.save()
        .on('success', function() {
            if(next) next(null,newProduct);
        })
        .on('failure', function(err) {
            if(next) next(err,false);
        })
};
exports.createProduct = _createProduct;

var _createProductWithProductCategoryId = function (ProductCategoryId, product, next) {
    _createProduct(product, function(err, newProduct){
        if(newProduct){
            //Get Product family from SiteCode
            _findProductCategoryById(ProductCategoryId, function(err, ProductCategory){
                //Link Product to Product family
                ProductCategory.addProduct(newProduct)
                    .on('success', function(){
                        _createLog("CREATE",'PRODUCT','Create product: name=' + product.name + " part=" + product.part + ' for ' + ProductCategory.name, null, function(err, log){
                            if(next) return next(null, newProduct);
                        });
                    })
                    .on('failure', function(err){
                        if(next) next(err, false);
                    });
            });
        }
    });
};
exports.createProductWithProductCategoryId = _createProductWithProductCategoryId;

var _createProductWithProductCategoryName = function (ProductCategoryName, product, next) {
    _createProduct(product, function(err, newProduct){
        if(newProduct){
            //Get Product family from SiteCode
            _findProductCategoryByName(ProductCategoryName, function(err, ProductCategorys){
                //Link Product to Product family
                ProductCategorys[0].addProduct(newProduct)
                    .on('success', function(){
                        _createLog("CREATE",'PRODUCT','Create product: name=' + product.name + " part=" + product.part + ' for ' + ProductCategoryName, null, function(err, log){
                            if(next) return next(null, newProduct);
                        });
                    })
                    .on('failure', function(err){
                        if(next) next(err, false);
                    });

            });
        }
    });
};
exports.createProductWithProductCategoryName = _createProductWithProductCategoryName;

var _deleteProductById = function (id, next) {
    Product.find(id).success(function(product) {
            if (!product){ if(next) next("Product  not found", false);}
            var name = product.name;
            var part = product.part
            product.deleted = true;
            product.save().success(function() {
                //*** Add log
                _createLog("DELETE",'PRODUCT','Delete product(' + id + ') ' + part, null, function(err, log){
                    if(next) return next(null, null);
                });
            });
        });
};
exports.deleteProductById = _deleteProductById;

var _updateProductById = function (id,product, next) {
    Product.find(id).success(function(newProduct) {
            if (!newProduct){ if(next) next("Product not found", false);}
            newProduct.updateAttributes(product).success(function() {
                //*** Add log
                _createLog("UPDATE",'PRODUCT','Update product(' + id + '): name=' + product.name + " part=" + product.part, null, function(err, log){
                    if(next) return next(null, newProduct);
                });
            });
        });
};
exports.updateProductById = _updateProductById;

var _getProductAllDetails = function(next){
    var sql = "SELECT * from `view_productsalldetails`";
    sequelize.query(sql, null, {raw: true})
        .success(function(products) {
            if (!products){ if(next) next("Products not found", false);}
            if(next) next(null, products);
    });
}
exports.getProductAllDetails = _getProductAllDetails;

var _createDefaultProducts = function(){
    _createProductWithProductCategoryName('VOICE', { name: 'VoIP8-1 Daughterboard : 8 IP channels', part:'3EH73063AC'} );
    _createProductWithProductCategoryName('VOICE', { name: 'PCM2 board pulse code modulation board (1)', part:'3BA23064AC'} );
    _createProductWithProductCategoryName('VOICE', { name: 'RMAB board: Remote Maintenance Access Board', part:'3BA23081AB'} );
    _createProductWithProductCategoryName('VOICE', { name: 'DPT1 board T1 2 x primary rate accesses (24)', part:'3BA23164AA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'NDDI2-2 BOARD', part:'3BA23171AB'} );
    _createProductWithProductCategoryName('VOICE', { name: 'CLIPIA card class services option (4 circuits)', part:'3BA23173AA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'INT-IP2 board: Board for spare', part:'3BA23193AC'} );
    _createProductWithProductCategoryName('VOICE', { name: 'GS card loop start/ground start option (4 circuits)', part:'3BA23196AA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'GPA2 board : conf 29 Dynamic + Static (4 language) Voice Guide', part:'3BA23241AA'} );
    _createProductWithProductCategoryName('VOICE', { name: '10/100BASE-T connector', part:'3BA23243AA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'INTOF2 board: Inter Crystal board', part:'3BA23260AA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'GIP4-4 board', part:'3BA23263AA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'e-Z32 board 32 anolog interfaces', part:'3BA23265AB'} );
    _createProductWithProductCategoryName('VOICE', { name: 'e-UA32 board 32 UA interfaces', part:'3BA23266AA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'IDE hard disk for CPU or 4635', part:'3BA27013AB'} );
    _createProductWithProductCategoryName('VOICE', { name: 'PSAL & 48V data cabinet (ACT) connecting kit', part:'3BA27121AA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'Variable speed fans for data cabinet (ACT)', part:'3BA27132AA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'ACT shipment kit', part:'3BA27134AA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'Server Security Module RM (SSM-RM)', part:'3BA27698AA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'Media Security Module RM (MSM-RM)', part:'3BA27699AA'} );
    _createProductWithProductCategoryName('VOICE', { name: '15 m cable from CBRMA to MDF', part:'3BA28028UA'} );
    _createProductWithProductCategoryName('VOICE', { name: '15 m cable from DPT1 to MDF with RJ45 connector', part:'3BA28142UA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'COST-MU card: Multi-mode optical transmission  system card (to use with INTOF)', part:'3BA53119AA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'ACT28 shelf: Shelf 12U/28 slots', part:'3BA56007UA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'Asynchronous telemaintenance modem for VH, WM1, M2 and M3 cabinets', part:'3BA57117BG'} );
    _createProductWithProductCategoryName('VOICE', { name: 'DIGITAL VOICE BOARD 60 PORTS', part:'3BA57266AC'} );
    _createProductWithProductCategoryName('VOICE', { name: 'INT/INT 5 m system cable, INTOF to INTOF', part:'3BA58018UA'} );
    _createProductWithProductCategoryName('VOICE', { name: '15 m MDF TY1 64pts DIN cable for UA‚ Z‚ NDDI‚ BRA boards', part:'3BA58020UB'} );
    _createProductWithProductCategoryName('VOICE', { name: '15 m MDF TY4 96pts DIN cable from CPU to MDF', part:'3BA58027UA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'CPU redundancy to connecting box 10 m system cable', part:'3BA58074UA'} );
    _createProductWithProductCategoryName('VOICE', { name: 'Digital Public Access Board - 1 Primary Rate T1 Access', part:'3EH73007AC'} );
    _createProductWithProductCategoryName('VOICE', { name: 'Controller board MEX', part:'3EH73026AD'} );
    _createProductWithProductCategoryName('VOICE', { name: 'APA8 Analog trunk access board for 8 trunk lines', part:'3EH73031AD'} );
    _createProductWithProductCategoryName('VOICE', { name: 'APA4 Analog trunk access board for 4 trunk lines', part:'3EH73031BD'} );
    _createProductWithProductCategoryName('VOICE', { name: 'GSCLI APA daughtercard for Ground Start function', part:'3EH73033AB'} );
    _createProductWithProductCategoryName('VOICE', { name: 'CLIDSP APA daughtercard for local management of CLI signals', part:'3EH73034AB'} );
    _createProductWithProductCategoryName('VOICE', { name: 'GATEWAY DRIVER BOARD (GD-2)', part:'3EH73048BC'} );
    _createProductWithProductCategoryName('VOICE', { name: 'GATEWAY APPLICATIVE BOARD (GA-2)', part:'3EH73048BD'} );
    _createProductWithProductCategoryName('VOICE', { name: 'Digital interfaces board UAI16-1 : 16 digital interfaces', part:'3EH73050AB'} );
    _createProductWithProductCategoryName('VOICE', { name: 'Analog Interfaces Board  SLI16-1 : 16 analog interfaces', part:'3EH73052AB'} );
    _createProductWithProductCategoryName('VOICE', { name: 'Alcatel 4038 IP Touch set Urban grey US', part:'3GV27003UB'} );
    _createProductWithProductCategoryName('VOICE', { name: 'Wireless handset Bluetooth® Urban grey for 4068 IP Touch‚ including battery', part:'3GV27007AB'} );
    _createProductWithProductCategoryName('VOICE', { name: 'Alcatel 4039 set Urban grey US', part:'3GV27009UB'} );
    _createProductWithProductCategoryName('VOICE', { name: 'Smart display additional module for Alcatel 4028/4029/4038/4039/4068 sets‚ Urban grey‚ with 14 keys‚ foot', part:'3GV27013AB'} );
    _createProductWithProductCategoryName('VOICE', { name: 'Alcatel 4068 IP Touch set Urban grey', part:'3GV27043UB'} );
    _createProductWithProductCategoryName('DATA', { name: 'CLIENT SERVERS', part:'3BA27582A'} );
    _createProductWithProductCategoryName('DATA', { name: 'REC - SR/ESS-1 RED AC PWR SHELF', part:'3HE0012AA'} );
    _createProductWithProductCategoryName('DATA', { name: 'KIT, SHIP, OS7/OS9-IP-SHELF, KIT B', part:'420113-10'} );
    _createProductWithProductCategoryName('DATA', { name: 'KIT, SHIP, OS7/OS9-IP-SHELF, KIT B', part:'420114-10'} );
    _createProductWithProductCategoryName('DATA', { name: 'RLII-AMERICA 1692MSE R3.4 FLASH CARD', part:'8DG22852AE'} );
    _createProductWithProductCategoryName('DATA', { name: 'PS-360I160AC-P', part:'902640-90'} );
    _createProductWithProductCategoryName('DATA', { name: 'Viking Power Fail Switch', part:'PF-6A'} );
    _createProductWithProductCategoryName('DATA', { name: 'OAW-6000 2XGE Line Card', part:'3EM17860BT'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850 360W Power Supply', part:'OS6850-BP-P'} );
    _createProductWithProductCategoryName('DATA', { name: 'SFP-GIG-SX', part:'SFP-GIG-SX'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850-24 - Chassis', part:'OS6850-24'} );
    _createProductWithProductCategoryName('DATA', { name: 'SFP-GIG-T', part:'SFP-GIG-T'} );
    _createProductWithProductCategoryName('DATA', { name: 'SFP-GIG-LX', part:'SFP-GIG-LX'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850-P48 - Chassis', part:'OS6850-P48'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850-P48L - Chassis', part:'OS6850-P48L'} );
    _createProductWithProductCategoryName('DATA', { name: 'XFP-10G-LR', part:'XFP-10G-LR'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850-U24X - Chassis', part:'OS6850-U24X'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6855-14 Chassis', part:'OS6855-14'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6855-24 Chassis', part:'OS6855-24'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS9600/OS9700-CFM', part:'OS9600/OS9700-CFM'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS9700/OS7700 - Chassis', part:'OS9700/OS7700'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS9 Power Supply', part:'OS-PS-0600AC'} );
    _createProductWithProductCategoryName('DATA', { name: 'XFP-10G-SR', part:'XFP-10G-SR'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS9800-CFM', part:'OS9800-CFM'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS9800/OS7800 - Chassis', part:'OS9800/OS7800'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS9 POE 600W Power Supply', part:'OS-IPS-600A'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS9-GNI-P24', part:'OS9-GNI-P24'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS9-GNI-U24', part:'OS9-GNI-U24'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS9-GNI-C24', part:'OS9-GNI-C24'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850-P24L - Chassis', part:'OS6850-P24L'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS9-XNI-U2', part:'OS9-XNI-U2'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS9-XNI-U6', part:'OS9-XNI-U6'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850-24L - Chassis', part:'OS6850-24L'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850-P48X - Chassis', part:'OS6850-P48X'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850 126W Power Supply', part:'OS6850-BP'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS9-IP-SHELF', part:'OS9-IP-SHELF'} );
    _createProductWithProductCategoryName('DATA', { name: 'SFP-GIG-LH', part:'SFP-GIG-LH'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850-48X  - Chassis', part:'OS6850-48X'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850-48L - Chassis', part:'OS6850-48L'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850-48 - Chassis', part:'OS6850-48'} );
    _createProductWithProductCategoryName('DATA', { name: 'OAW-SC2 (256 AP) Controller - Chassis', part:'OAW-SC2'} );
    _createProductWithProductCategoryName('DATA', { name: 'OAW-SC1 (256 AP) Controller - Chassis', part:'OAW-SC1'} );
    _createProductWithProductCategoryName('DATA', { name: 'OAW-SC3 (512 AP) Controller - Chassis', part:'OAW-SC3'} );
    _createProductWithProductCategoryName('DATA', { name: 'OAW-4324 (48 AP) Controller - Chassis', part:'OAW-4324'} );
    _createProductWithProductCategoryName('DATA', { name: 'OAW-4308 (16 AP) Controller - Chassis', part:'OAW-4308'} );
    _createProductWithProductCategoryName('DATA', { name: 'OAW-4302 (6 AP) Controller - Chassis', part:'OAW-4302'} );
    _createProductWithProductCategoryName('DATA', { name: 'Server - Chassis', part:'Server'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS9-GNI-C20L', part:'OS9-GNI-C20L'} );
    _createProductWithProductCategoryName('DATA', { name: 'PS-360W-AC', part:'902429-90'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850E-P48 - Chassis', part:'OS6850E-P48'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850E-P48X - Chassis', part:'OS6850E-P48X'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850E-U24X - Chassis', part:'OS6850E-U24X'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS-PS-0725AC', part:'OS-PS-0725AC'} );
    _createProductWithProductCategoryName('DATA', { name: 'OS6850E-P24 Chassis', part:'OS6850E-P24'} );
    _createProductWithProductCategoryName('DATA', { name: 'OAW-6000 Controller - Chassis', part:'OAW-6000'} );
    _createProductWithProductCategoryName('DATA', { name: 'OAW-4504 - Chassis', part:'OAW-4504'} );
    _createProductWithProductCategoryName('DATA', { name: 'OAW-4604 - Chassis', part:'OAW-4604'} );
    _createProductWithProductCategoryName('DATA', { name: 'OAW-4704 - Chassis', part:'OAW-4704'} );
    _createProductWithProductCategoryName('OTHER', { name: 'IBM HD', part:'43W760'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 12 slot DC Shelf AC Power Shelf', part:'3HE00007AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 SR 12 slot Shelf AC Power Supply for AC Power Shelf', part:'3HE00008AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 SR1 slot Redundant AC Power Supply for 7750 SR 1 slot Redundant AC Power Shelf', part:'3HE00013AA'} );
    _createProductWithProductCategoryName('IPD', { name: '1-port 1000BASE-SX Small Form-Factor Pluggable (SFP) Optics Module, 850 nm, LC Connector', part:'3HE00027AA'} );
    _createProductWithProductCategoryName('IPD', { name: '1-port 1000BASE-LX Small Form-Factor Pluggable (SFP) Optics Module, 1310 nm, 10 km, LC Connector', part:'3HE00028AA'} );
    _createProductWithProductCategoryName('IPD', { name: '1-port 1000BASE-ZX Small Form-Factor Pluggable (SFP) Optics Module, 1550 nm, 70 km, LC Connector', part:'3HE00029AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750-SR1 - Chassis', part:'3HE00061AC'} );
    _createProductWithProductCategoryName('IPD', { name: '1-port 1000BASE-TX Small Form-Factor Pluggable (SFP) Copper Module, Cat5, RJ45 Connector', part:'3HE00062AA'} );
    _createProductWithProductCategoryName('IPD', { name: '1-port 1000BASE CWDM (120 km) Small Form-Factor Pluggable (SFP) Optics Module, 1530 nm, LC Connector', part:'3HE00070BD'} );
    _createProductWithProductCategoryName('IPD', { name: '1-port 1000BASE CWDM (120 km) Small Form-Factor Pluggable (SFP) Optics Module, 1550 nm, LC Connector', part:'3HE00070BE'} );
    _createProductWithProductCategoryName('IPD', { name: '1-port 1000BASE CWDM (120 km) Small Form-Factor Pluggable (SFP) Optics Module, 1570 nm, LC Connector', part:'3HE00070BF'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 SR 12 - Chassis - Bundle DC INTEGRATED SHELF, INCLUDES: 3HE00009AA (2), 3HE00016AA (3), 3HE00104AA (1), 3HE00192AA (1)', part:'3HE00183AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750-SR7 - Chassis', part:'3HE00186AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 SR 7 slot AC Line Power Supply Unit (PSU)', part:'3HE00187AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 SR 7 slot AC PEM, AC Power Entry Module for Slot 1 or Slot 2', part:'3HE00195AA'} );
    _createProductWithProductCategoryName('IPD', { name: 'SAM Release 4.0', part:'3HE00205DA'} );
    _createProductWithProductCategoryName('IPD', { name: '2 x 10-Gig MDA IOM Card, B - 7450', part:'3HE00229AB'} );
    _createProductWithProductCategoryName('IPD', { name: '7450 ESS Operating Software for ESS-7 - Release 5.0', part:'3HE00241EA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 SR AC Power Cable 110V for SR-1, SR-4 - United States / Canada / South America', part:'3HE00271AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 SR AC Power Cable 110V for External SR-1 Redundant AC - United States / Canada / South America', part:'3HE00271AF'} );
    _createProductWithProductCategoryName('IPD', { name: '7450 ESS 2-port 10GBASE Ethernet MDA. Accepts up to two (2) XFP 10GigE Optics Modules', part:'3HE00317AA'} );
    _createProductWithProductCategoryName('IPD', { name: '1-port 10GBASE-LW/LR Small Form-Factor Pluggable (XFP) Optics Module, 1310 nm, 10 km, LC Connector', part:'3HE00564AA'} );
    _createProductWithProductCategoryName('IPD', { name: '1-port 10GBASE-SW/SR Small Form-Factor Pluggable (XFP) Optics Module, 850 nm, LC Connector', part:'3HE00566AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 1 x 10-Gig Ethernet XFP', part:'3HE00714AA'} );
    _createProductWithProductCategoryName('IPD', { name: '200g CPM / Switch Fabric 2 - 7750', part:'3HE01171AA'} );
    _createProductWithProductCategoryName('IPD', { name: 'VSM Cross Connect Adaptor - 7750', part:'3HE01197AA'} );
    _createProductWithProductCategoryName('IPD', { name: '2 x 10-Gig MDA IOM 2 - 7750', part:'3HE01473AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7450 10 x 10/100/1000 Ethernet SFP', part:'3HE01532AA'} );
    _createProductWithProductCategoryName('IPD', { name: '5 x 10/100/1000 Ethernet SFP', part:'3HE01615AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 10 x 10/100/1000 Ethernet SFP', part:'3HE01616AA'} );
    _createProductWithProductCategoryName('IPD', { name: '1 x 10-Gig Ethernet XFP - 7450', part:'3HE01617AA'} );
    _createProductWithProductCategoryName('IPD', { name: '400g CPM / Switch Fabric 2 - 7450', part:'3HE02032AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7450-ESS12 - Chassis', part:'3HE02036AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7450 ESS 12 slot Cable Management', part:'3HE02037AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7450 ESS 12 slot Shelf DC Power Entry Module (PEM) for Alcatel 7450 ESS 12 slot DC Shelf', part:'3HE02058AA'} );
    _createProductWithProductCategoryName('IPD', { name: '4-Port Channelized DS3/E3 (DS0) Any Service Any Port (ASAP) MDA', part:'3HE02501AA'} );
    _createProductWithProductCategoryName('IPD', { name: 'SR/ESS 2500 Watt AC Power Supply for the SR/ESS AC Split Power Shelf', part:'3HE02787AA'} );
    _createProductWithProductCategoryName('IPD', { name: 'SR/ESS AC Power Cable 220V for SR/ESS 2500 Watt AC Power Supply for the SR/ESS AC Split Power Shelf', part:'3HE02946AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 SR  20-port 1000BASE Ethernet MDA-XP. Accepts up to twenty (20) SFP GigE-xx operation supported with GigE TX SFP', part:'3HE03612AA'} );
    _createProductWithProductCategoryName('IPD', { name: '20 x 10/100/1000 Ethernet Extended Performance SFP - 7450', part:'3HE03615AA'} );
    _createProductWithProductCategoryName('IPD', { name: '2 x XP MDA IOM 3 - 7750', part:'3HE03619AA'} );
    _createProductWithProductCategoryName('IPD', { name: '2 x XP MDA IOM 3 - 7450', part:'3HE03620AA'} );
    _createProductWithProductCategoryName('IPD', { name: '2 x 10Gig Extended Performance XFP - 7750', part:'3HE03685AA'} );
    _createProductWithProductCategoryName('IPD', { name: '4 x 10Gig Extended Performance XFP - 7750', part:'3HE03686AA'} );
    _createProductWithProductCategoryName('IPD', { name: '4 x 10Gig Extended Performance XFP - 7450', part:'3HE03688AA'} );
    _createProductWithProductCategoryName('IPD', { name: 'SR/ESS 6/6V/7 VAL AC Power Shelf', part:'3HE02786BA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750-SR12 - Chassis', part:'3HE00104AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7710-SRc12 - Chassis', part:'3HE01111AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7450-ESS7 - Chassis', part:'3HE00245AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7710-SRc4 - Chassis', part:'3HE02178AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7710 1 x Gig Ethernet SFP CMA', part:'3HE01023AA'} );
    _createProductWithProductCategoryName('IPD', { name: '2 x 10-Gig MDA IOM Card, B - 7750', part:'3HE00020AB'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 20 x 10/100/1000 Ethernet SFP', part:'3HE00708AA'} );
    _createProductWithProductCategoryName('IPD', { name: '200g CPM / Switch Fabric 2 - 7450', part:'3HE01172AA'} );
    _createProductWithProductCategoryName('IPD', { name: '77x0 4 x DS3/E3 CMA', part:'3HE01021AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7710 SR C12 12G CFM', part:'3HE01014AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7710 SR C4 9G CFM', part:'3HE02175AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7710 8 x 10/100 Ethernet Tx CMA', part:'3HE01022AA'} );
    _createProductWithProductCategoryName('IPD', { name: '77x0 8 x DS1/E1 Channel CMA', part:'3HE01020AA'} );
    _createProductWithProductCategoryName('IPD', { name: 'MCM-v1 -7710', part:'3HE01024AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7710 SR C12  CCM-v1', part:'3HE01019AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7710 SR C4 CCM-v1', part:'3HE02181AA'} );
    _createProductWithProductCategoryName('IPD', { name: 'ISA Ipsec', part:'3HE03080AA'} );
    _createProductWithProductCategoryName('IPD', { name: '10GBASE-ER 10GBASE-SW 10GBASE-LW 10GBASE-EW ', part:'3HE00566CA'} );
    _createProductWithProductCategoryName('IPD', { name: 'GIGE-LX ', part:'3HE00070BH'} );
    _createProductWithProductCategoryName('IPD', { name: 'GIGE-LX ', part:'3HE00070BB'} );
    _createProductWithProductCategoryName('IPD', { name: 'GIGE-LX ', part:'3HE00070BG'} );
    _createProductWithProductCategoryName('IPD', { name: 'GIGE-LX ', part:'3HE00070BC'} );
    _createProductWithProductCategoryName('IPD', { name: 'GIGE-LX ', part:'3HE00028CA'} );
    _createProductWithProductCategoryName('IPD', { name: 'GIGE-LX ', part:'3HE00070AB'} );
    _createProductWithProductCategoryName('IPD', { name: 'GIGE-LX ', part:'3HE00070AC'} );
    _createProductWithProductCategoryName('IPD', { name: 'GIGE-LX ', part:'3HE00070BA'} );
    _createProductWithProductCategoryName('IPD', { name: 'GIGE-LX ', part:'3HE00867AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 SRc12 - Chassis', part:'3HE01111BA'} );
    _createProductWithProductCategoryName('IPD', { name: 'CCM-XP - 7750 SR-C12', part:'3HE04580AA'} );
    _createProductWithProductCategoryName('IPD', { name: 'CFM-XP - 7750 SR-C12', part:'3HE03607AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 SR-C12 - Chassis', part:'3HE01016BA'} );
    _createProductWithProductCategoryName('IPD', { name: 'MCM-XP - 7750 SR-C12', part:'3HE03608AA'} );
    _createProductWithProductCategoryName('IPD', { name: 'C12 AC PEM-3 - 7750 SR-C12', part:'3HE03658AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7710 SR C12 12G - Chassis', part:'3HE01016AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7710 SR C12 AC PEM', part:'3HE01018AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7710 SR C4 Chassis/FAN', part:'3HE02177AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7710 SR C4 AC PEM', part:'3HE02180AA'} );
    _createProductWithProductCategoryName('IPD', { name: '1GB Compact Flash', part:'3HE01618AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7210 SAS-X-24F-2XFP - Chassis', part:'3HE05170AA'} );
    _createProductWithProductCategoryName('IPD', { name: 'ISA IPsec', part:'3HE04922AA'} );
    _createProductWithProductCategoryName('IPD', { name: '500g CPM / Switch Fabric 3', part:'3HE03617AA'} );
    _createProductWithProductCategoryName('IPD', { name: '48-Port GIGE SFP IMM', part:'3HE03624AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7210 SAS-X-Power Supply', part:'3HE05172AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 SR 20G Input Output Module', part:'109743625'} );
    _createProductWithProductCategoryName('IPD', { name: 'FLT - 7x50 ESS-6V/12 SR-12 Air Filter', part:'3HE00014AA'} );
    _createProductWithProductCategoryName('IPD', { name: 'FLT - 7x50 SR/ESS-7 Air Filter', part:'3HE00190AA'} );
    _createProductWithProductCategoryName('IPD', { name: 'FLT - 7710 SR 12 CMA Shelf Air Filter', part:'3HE01112AA'} );
    _createProductWithProductCategoryName('IPD', { name: 'FLT - 7710 SR C4 Shelf Air Filter', part:'3HE02183AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7750 SR-C4 Chassis', part:'3HE04973AA'} );
    _createProductWithProductCategoryName('IPD', { name: '250g CPM / Switch Fabric 3', part:'3HE04164AA'} );
    _createProductWithProductCategoryName('IPD', { name: '48-Port GIGE SFP IMM', part:'3HE06428AA'} );
    _createProductWithProductCategoryName('IPD', { name: '7705-SARF', part:'3HE02777AA'} );
    _createProductWithProductCategoryName('IPD', { name: '1 Tb CPM / Switch Fabric 4', part:'3HE05949AA'} );
    _createProductWithProductCategoryName('IPD', { name: '48-Port GIGE SFP IMM B', part:'3HE06326AA'} );
    _createProductWithProductCategoryName('OND', { name: 'CWDM 1610NM APD SFP DDM', part:'1AB196350033'} );
    _createProductWithProductCategoryName('OND', { name: '1354RM-PhM R5.x Basic Management License', part:'3AL88973AA'} );
    _createProductWithProductCategoryName('OND', { name: '1354RM-PhM R5.x Basic Management Expansion License', part:'3AL88974AA'} );
    _createProductWithProductCategoryName('OND', { name: 'RECONFIG OADM CARD 42CHAN (WSS)', part:'8DG39262AA'} );
    _createProductWithProductCategoryName('OND', { name: 'BROAD BAND ROADM - 42CH ROADM CA', part:'8DG39263AA'} );
    _createProductWithProductCategoryName('OND', { name: 'SSY-1696 MS ROADM SHELF - Chassis', part:'8DG39265AA'} );
    _createProductWithProductCategoryName('OND', { name: 'SSY-CMD42 - 42CH MUX/DEMUX CARD', part:'8DG39266AA'} );
    _createProductWithProductCategoryName('OND', { name: '10GE LAN PHY WTE XFP CARD - TUNA', part:'8DG39268AA'} );
    _createProductWithProductCategoryName('OND', { name: '1 x Multi-Rate 2.5G WT Card - Tunable', part:'8DG39271AA'} );
    _createProductWithProductCategoryName('OND', { name: '1696 MS ROADM Link Planning Tool R5.x License', part:'8DG39305AA'} );
    _createProductWithProductCategoryName('OND', { name: 'Link Planning Tool Support Maintenance per Year', part:'8DG39306AA'} );
    _createProductWithProductCategoryName('OND', { name: 'FAN TRAY', part:'8DG39307AA'} );
    _createProductWithProductCategoryName('OND', { name: 'AIR INTAKE TRAY (Spare)', part:'8DG39311AA'} );
    _createProductWithProductCategoryName('OND', { name: 'Optical Service Channel Card (OSC)', part:'8DG39318AA'} );
    _createProductWithProductCategoryName('OND', { name: 'BBA HG, HIGH GAIN AMP', part:'8DG39320AA'} );
    _createProductWithProductCategoryName('OND', { name: 'SSY-GIG E SX TRANSCEIVER', part:'8DG39326AA'} );
    _createProductWithProductCategoryName('OND', { name: 'SSY-GIG E LX TRANSCEIVER', part:'8DG39327AA'} );
    _createProductWithProductCategoryName('OND', { name: 'SSY-OC48 1310NM SR TRANSPONDER', part:'8DG39334AA'} );
    _createProductWithProductCategoryName('OND', { name: 'EMA-25 Amp Breaker Assembly', part:'8DG39338AA'} );
    _createProductWithProductCategoryName('OND', { name: 'SSY-CONTROL CARD', part:'8DG39339AA'} );
    _createProductWithProductCategoryName('OND', { name: 'OPTO TRX SFP L-1.1 DDM EXTEMP', part:'1AB194670005'} );
    _createProductWithProductCategoryName('OND', { name: 'JUMPER SFM MU/UPC-LC/UPC 390MM', part:'1AB195530001'} );
    _createProductWithProductCategoryName('OND', { name: 'JUMPER SFM MU/UPC-LC/PC 320MM', part:'1AB195530002'} );
    _createProductWithProductCategoryName('OND', { name: 'CWDM 1470NM APD SFP DDM', part:'1AB196350026'} );
    _createProductWithProductCategoryName('OND', { name: 'CWDM 1490NM APD SFP DDM', part:'1AB196350027'} );
    _createProductWithProductCategoryName('OND', { name: 'CWDM 1510NM APD SFP DD M', part:'1AB196350028'} );
    _createProductWithProductCategoryName('OND', { name: 'CWDM 1530NM APD SFP DDM', part:'1AB196350029'} );
    _createProductWithProductCategoryName('OND', { name: 'CWDM 1590NM APD SFP DDM', part:'1AB196350032'} );
    _createProductWithProductCategoryName('OND', { name: 'LAC (LAN ACCESS CARD)', part:'3AL86653AA'} );
    _createProductWithProductCategoryName('OND', { name: 'Housekeeping - CWDM', part:'3AL86668AA'} );
    _createProductWithProductCategoryName('OND', { name: 'HK USER CABLE', part:'3AL86751AA'} );
    _createProductWithProductCategoryName('OND', { name: 'PSC_C', part:'3AL86888AA'} );
    _createProductWithProductCategoryName('OND', { name: 'ALARM CARD', part:'3AL87009AA'} );
    _createProductWithProductCategoryName('OND', { name: 'OSC (OPTICAL SUPERVISORY CHANNEL)', part:'3AL97540AA'} );
    _createProductWithProductCategoryName('OND', { name: '1692/1696 MetroSpan Compact - Chassis', part:'3AL97679AA'} );
    _createProductWithProductCategoryName('OND', { name: 'COMPACT FAN', part:'3AL97682AA'} );
    _createProductWithProductCategoryName('OND', { name: 'LOW COST ESC', part:'3AL97690AA'} );
    _createProductWithProductCategoryName('OND', { name: '2F 8CH MDX2E W/ 1310 FILTER', part:'3AL97772AA'} );
    _createProductWithProductCategoryName('OND', { name: 'WLA3C', part:'3AL97795AA'} );
    _createProductWithProductCategoryName('OND', { name: 'COMPACT DUST FILTER', part:'3AN51151AA'} );
    _createProductWithProductCategoryName('OND', { name: '10 X GIGE MUX WT CARD', part:'8DG39283AA'} );
    _createProductWithProductCategoryName('OND', { name: '2 x GigE Mux WT Card - Tunable', part:'8DG39267AA'} );
    _createProductWithProductCategoryName('OND', { name: 'Air Filters FRU', part:'8DG39309AA'} );
};
exports.createDefaultProducts = _createDefaultProducts;

//****************************************//
// Notes
//****************************************//
var _findNotes = function(next){
    Note.findAll({}).success(function(notes) {
        var tmpNotes = [];
        if (! notes instanceof Array){ tmpNotes.push(notes); }
        else{ tmpNotes = notes; }

        if(next) next(null, tmpNotes);
    })

};
exports.findNotes = _findNotes;

var _findNoteById = function(noteid, next){
    Note
        .find(noteid)
        .success(function(note) {
            if(next) {
                if(!note){ return next ("NoteId " + noteid + " not found", false);}
                return next(null,note);
            };
        })
        .error(function(error){
            console.error(error);
            if(next) next(error,false);}
    );
};
exports.findNoteById=_findNoteById;


























//****************************************//
// Logs
//****************************************//
var _findLogAll = function(next){
    Log.findAll({where: {deleted: false}}).success(function(logs) {
        var tmpLogs = [];
        if (! logs instanceof Array){
            tmpLogs.push(logs);
        }
        else{
            tmpLogs = logs;
        }

        if(next) return next(null, tmpLogs);
    })
};
exports.findLogAll = _findLogAll;

var _createLog = function(action,modelName,text,user,next)
{
    var chainer = new Sequelize.Utils.QueryChainer
        , log  = Log.build({ action: action, model: modelName, text: text });

    chainer
        .add(log.save())

    chainer.run()
        .on('success', function() {
            //Assign log to user
           if(user) {
                user.addLog(log)
                    .on('success', function() { if(next) next(null, log); })
                    .on('failure', function(err) { if(next) next(err,false); });
            ;}
            else{ if(next) next(null, log); }
        })
        .on('failure', function(err) { if(next) next(err,false); });
};
exports.createLog = _createLog;






/********************************
 * VIEWS
 ********************************/
var _createViews = function() {
    var chainer = new Sequelize.Utils.QueryChainer;
    var chainerDrop = new Sequelize.Utils.QueryChainer;

    var view_devicesAllDetails_DROP = "DROP VIEW `view_devicesalldetails`";
    var view_devicesAllDetails =
        "CREATE VIEW `view_devicesalldetails` AS SELECT \
        sitegroups.id as sitegroup_id, sitegroups.name as sitegroup_name, sitegroups.code as sitegroup_code, sitegroups.deleted as sitegroup_deleted, \
        sites.id as site_id, sites.name as site_name, sites.code as site_code, sites.canbedeleted  as site_canbedeleted, sites.category as site_category, sites.deleted as site_deleted, \
        buildings.id as building_id, buildings.name as building_name, buildings.canbedeleted as building_canbedeleted, buildings.deleted as building_deleted, \
        floors.id as floor_id, floors.name as floor_name, floors.canbedeleted as floor_canbedeleted, floors.deleted as floor_deleted, \
        closets.id as closet_id, closets.name as closet_name, closets.spare as closet_spare, closets.canbedeleted as closet_canbedeleted, closets.deleted as closet_deleted, \
        devices.id as device_id, devices.name as device_name, devices.serial as device_serial, devices.deleted as device_deleted, \
        products.id as product_id, products.name as product_name, products.part as product_part, products.deleted as product_deleted, \
        productcategories.id as ProductCategory_id, productcategories.name as ProductCategory_name, productcategories.deleted  as ProductCategory_deleted \
        FROM \
        sitegroupssites INNER JOIN sitegroups ON sitegroupssites.sitegroupId = sitegroups.id \
        INNER JOIN sites ON sitegroupssites.siteId = sites.id \
        INNER JOIN buildingssites ON sites.id = buildingssites.siteId \
        INNER JOIN buildings ON buildingssites.buildingId = buildings.id \
        INNER JOIN buildingsfloors ON buildings.id = buildingsfloors.buildingId \
        INNER JOIN floors ON buildingsfloors.floorId = floors.id \
        INNER JOIN closetsfloors ON floors.id = closetsfloors.floorId \
        INNER JOIN closets ON closetsfloors.closetId = closets.id \
        INNER JOIN closetsdevices ON closets.id = closetsdevices.closetId \
        INNER JOIN devices ON closetsdevices.deviceId = devices.id \
        INNER JOIN devicesproducts ON devices.id = devicesproducts.deviceId \
        INNER JOIN products ON devicesproducts.productId = products.id \
        INNER JOIN productcategories ON products.ProductCategoryId = productcategories.id";

    var view_productsAllDetails_DROP = "DROP VIEW `view_productsalldetails`";
    var view_productsAllDetails =
        "CREATE VIEW `view_productsalldetails` AS SELECT \
        productcategories.id as productcategories_id, productcategories.name as productcategories_name, productcategories.deleted  as productcategories_deleted, \
        products.id as product_id, products.name as product_name, products.part as product_part, products.deleted as product_deleted \
        FROM productcategories INNER JOIN products ON productcategories.id = products.ProductCategoryId ";
    var view_closetAllDetails_DROP="DROP VIEW `view_closetalldetails`";
    var view_closetAllDetails =
        "CREATE VIEW `view_closetalldetails` AS SELECT \
        sitegroups.id as sitegroup_id, sitegroups.name as sitegroup_name, sitegroups.code as sitegroup_code, sitegroups.deleted as sitegroup_deleted, \
        sites.id as site_id, sites.name as site_name, sites.code as site_code, sites.canbedeleted as site_canbedeleted, sites.category as site_category, sites.deleted as site_deleted, \
        buildings.id as building_id, buildings.name as building_name, buildings.canbedeleted as building_canbedeleted, buildings.deleted as building_deleted, \
        floors.id as floor_id, floors.name as floor_name, floors.canbedeleted as floor_canbedeleted, floors.deleted as floor_deleted, \
        closets.id as closet_id, closets.name as closet_name, closets.spare as closet_spare, closets.canbedeleted as closet_canbedeleted, closets.deleted as closet_deleted \
        FROM \
        sitegroupssites INNER JOIN sitegroups ON sitegroupssites.sitegroupId = sitegroups.id \
        INNER JOIN sites ON sitegroupssites.siteId = sites.id \
        INNER JOIN buildingssites ON sites.id = buildingssites.siteId \
        INNER JOIN buildings ON buildingssites.buildingId = buildings.id \
        INNER JOIN buildingsfloors ON buildings.id = buildingsfloors.buildingId \
        INNER JOIN floors ON buildingsfloors.floorId = floors.id \
        INNER JOIN closetsfloors ON floors.id = closetsfloors.floorId \
        INNER JOIN closets ON closetsfloors.closetId = closets.id";
    var view_floorAllDetails_DROP="DROP VIEW `view_flooralldetails`";
    var view_floorAllDetails =
        "CREATE VIEW `view_floortalldetails` AS SELECT \
        sitegroups.id as sitegroup_id, sitegroups.name as sitegroup_name, sitegroups.code as sitegroup_code, sitegroups.deleted as sitegroup_deleted, \
        sites.id as site_id, sites.name as site_name, sites.code as site_code, sites.canbedeleted as site_canbedeleted, sites.category as site_category, sites.deleted as site_deleted, \
        buildings.id as building_id, buildings.name as building_name, buildings.canbedeleted as building_canbedeleted, buildings.deleted as building_deleted, \
        floors.id as floor_id, floors.name as floor_name, floors.canbedeleted as floor_canbedeleted, floors.deleted as floor_deleted \
        FROM \
        sitegroupssites INNER JOIN sitegroups ON sitegroupssites.sitegroupId = sitegroups.id \
        INNER JOIN sites ON sitegroupssites.siteId = sites.id \
        INNER JOIN buildingssites ON sites.id = buildingssites.siteId \
        INNER JOIN buildings ON buildingssites.buildingId = buildings.id \
        INNER JOIN buildingsfloors ON buildings.id = buildingsfloors.buildingId \
        INNER JOIN floors ON buildingsfloors.floorId = floors.id";
    var view_buildingAllDetails_DROP="DROP VIEW `view_buildingalldetails`";
    var view_buildingAllDetails =
        "CREATE VIEW `view_buildingalldetails` AS SELECT \
        sitegroups.id as sitegroup_id, sitegroups.name as sitegroup_name, sitegroups.code as sitegroup_code, sitegroups.deleted as sitegroup_deleted, \
        sites.id as site_id, sites.name as site_name, sites.code as site_code, sites.canbedeleted as site_canbedeleted, sites.category as site_category, sites.deleted as site_deleted, \
        buildings.id as building_id, buildings.name as building_name, buildings.canbedeleted as building_canbedeleted, buildings.deleted as building_deleted \
        FROM \
        sitegroupssites INNER JOIN sitegroups ON sitegroupssites.sitegroupId = sitegroups.id \
        INNER JOIN sites ON sitegroupssites.siteId = sites.id \
        INNER JOIN buildingssites ON sites.id = buildingssites.siteId \
        INNER JOIN buildings ON buildingssites.buildingId = buildings.id";
    var view_siteAllDetails_DROP="DROP VIEW `view_sitealldetails`";
    var view_siteAllDetails =
        "CREATE VIEW `view_sitealldetails` AS SELECT \
        sitegroups.id as sitegroup_id, sitegroups.name as sitegroup_name, sitegroups.code as sitegroup_code, sitegroups.deleted as sitegroup_deleted, \
        sites.id as site_id, sites.name as site_name, sites.code as site_code, sites.canbedeleted as site_canbedeleted, sites.category as site_category, sites.deleted as site_deleted \
        FROM \
        sitegroupssites INNER JOIN sitegroups ON sitegroupssites.sitegroupId = sitegroups.id \
        INNER JOIN sites ON sitegroupssites.siteId = sites.id";

    chainerDrop.add(sequelize.query(view_devicesAllDetails_DROP,null, {raw: true}));
    chainer.add(sequelize.query(view_devicesAllDetails,null, {raw: true}));
    chainerDrop.add(sequelize.query(view_productsAllDetails_DROP,null, {raw: true}));
    chainer.add(sequelize.query(view_productsAllDetails,null, {raw: true}));
    chainerDrop.add(sequelize.query(view_closetAllDetails_DROP,null, {raw: true}));
    chainer.add(sequelize.query(view_closetAllDetails,null, {raw: true}));
    chainerDrop.add(sequelize.query(view_floorAllDetails_DROP,null, {raw: true}));
    chainer.add(sequelize.query(view_floorAllDetails,null, {raw: true}));
    chainerDrop.add(sequelize.query(view_buildingAllDetails_DROP,null, {raw: true}));
    chainer.add(sequelize.query(view_buildingAllDetails,null, {raw: true}));
    chainerDrop.add(sequelize.query(view_siteAllDetails_DROP,null, {raw: true}));
    chainer.add(sequelize.query(view_siteAllDetails,null, {raw: true}));

    chainerDrop
        .runSerially({ skipOnError: true })
        .on('success', function() {
            chainer
                .runSerially({ skipOnError: true })
                .on('success', function() {
                    console.log("Creating Views");
                })
                .on('failure', function(err) {
                    console.log("Creating Views - error", err);
                });
        })
        .on('failure', function(err) {
            chainer
                .runSerially({ skipOnError: true })
                .on('success', function() {
                    console.log("Creating Views");
                })
                .on('failure', function(err) {
                    console.log("Creating Views - error", err);
                });
        });

};