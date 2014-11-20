
/**
 * Module dependencies.
 */
var json2csv = require('nice-json2csv');
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        if(model){
            model.findUserByUsername(username, function(err, user) {
                if(err) { return done(null, false, err);   }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                if (user.getDataValue('password') !== password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                done(null, user);
            });
        }
        else
        {
            return done(null, false, { message: 'Model not load.' });
        }
    }
));

passport.serializeUser(function(user, done) {
    return done(null, user.getDataValue('id'));
});

passport.deserializeUser(function(id, done) {
    if(!model){ return done(null, false, { message: 'Model not load.' });}

    model.findUserById(id, function(err, user) {
        if(!user){return done(null, false, { message: 'User not found.' });}
        return done(null, user);
    });
});

var express = require('express');
var routes = require('./routes');
var login = require('./routes/login');
var user = require('./routes/user');
var model = require('./routes/model');
var http = require('http');
var path = require('path');

var sitegroup = require('./routes/sitegroup');
var site = require('./routes/site');
var building = require('./routes/building');
var floor = require('./routes/floor');
var closet = require('./routes/closet');
var device = require('./routes/device');
var ProductCategory = require('./routes/ProductCategory');
var product = require('./routes/product');
var log = require('./routes/log');
var usergroup = require('./routes/usergroup');
var note = require('./routes/note');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(express.favicon());
app.use(json2csv.expressDecorator);
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'MyInventory' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
};


app.get('/',ensureAuthenticated, routes.index);
app.get('/login', login.login);
app.post('/login', passport.authenticate('local', { successRedirect: '/sitegroup', failureRedirect: '/login', failureFlash: true, failureFlash: 'Invalid username or password.', successFlash: 'Welcome!' }));
app.get('/users',ensureAuthenticated, user.list);
app.get('/register', user.register);
app.post('/register', function(req, res){user.registration(req, res, model)} );
app.get('/logout',ensureAuthenticated, function(req, res){req.logout();res.redirect('/');});

//UserGroups
app.get('/admin/usergroup',ensureAuthenticated, function(req, res){usergroup.list(req, res, model)});
app.post('/admin/usergroup/create',ensureAuthenticated, function(req, res){usergroup.create(req, res, model)});
app.post('/admin/usergroup/update',ensureAuthenticated, function(req, res){usergroup.update(req, res, model)});
app.post('/admin/usergroup/delete',ensureAuthenticated, function(req, res){usergroup.delete(req, res, model)});
app.get('/admin/usergroup/:usergroupid',ensureAuthenticated, function(req, res){user.list(req, res, model)} );
app.post('/admin/usergroup/:usergroupid/addUser', function(req, res){usergroup.addUser(req, res, model)});
app.post('/admin/usergroup/:usergroupid/removeUser', function(req, res){usergroup.removeUser(req, res, model)});
app.get('/json/usergroup', function(req, res){usergroup.list_json(req, res, model)});
app.get('/json/usergroup/:usergroupid/details', function(req, res){usergroup.listdetails_json(req, res, model)});


//Users
app.get('/admin/user',ensureAuthenticated, function(req, res){user.list(req, res, model)});
app.post('/admin/user/create',ensureAuthenticated, function(req, res){user.create(req, res, model)});
app.post('/admin/user/update',ensureAuthenticated, function(req, res){user.update(req, res, model)});
app.post('/admin/user/delete',ensureAuthenticated, function(req, res){user.delete(req, res, model)});
app.get('/admin/user/:userid',ensureAuthenticated, function(req, res){user.details(req, res, model)} );
app.post('/admin/user/:userid/addresses/add',ensureAuthenticated, function(req, res){user.addAddress(req, res, model)});
app.post('/admin/user/:userid/addresses/remove',ensureAuthenticated, function(req, res){user.removeAddress(req, res, model)});
app.post('/admin/user/:userid/emails/add',ensureAuthenticated, function(req, res){user.addEmail(req, res, model)});
app.post('/admin/user/:userid/emails/remove',ensureAuthenticated, function(req, res){user.removeEmail(req, res, model)});
app.post('/admin/user/:userid/telephones/add',ensureAuthenticated, function(req, res){user.addTelephone(req, res, model)});
app.post('/admin/user/:userid/telephones/remove',ensureAuthenticated, function(req, res){user.removeTelephone(req, res, model)});
app.post('/admin/user/:userid/username/update',ensureAuthenticated, function(req, res){user.updateUsername(req, res, model)});
app.post('/admin/user/:userid/password/update',ensureAuthenticated, function(req, res){user.updatePassword(req, res, model)});
app.get('/json/user', function(req, res){user.list_json(req, res, model)});
app.get('/json/user/:userid', function(req, res){user.listdetails_json(req, res, model)});
app.get('/json/user/:userid/details', function(req, res){user.details_json(req, res, model)});
app.get('/json/user/:userid/addresses', function(req, res){user.listAddresses_json(req, res, model)});
app.get('/json/user/:userid/emails', function(req, res){user.listEmails_json(req, res, model)});
app.get('/json/user/:userid/telephones', function(req, res){user.listTelephones_json(req, res, model)});


//SiteGroups
app.get('/sitegroup',ensureAuthenticated, function(req, res){sitegroup.list(req, res, model)});
app.post('/sitegroup/create',ensureAuthenticated, function(req, res){sitegroup.create(req, res, model)});
app.post('/sitegroup/update',ensureAuthenticated, function(req, res){sitegroup.update(req, res, model)});
app.post('/sitegroup/delete',ensureAuthenticated, function(req, res){sitegroup.delete(req, res, model)});
app.get('/sitegroup/:sitegroupid',ensureAuthenticated, function(req, res){site.list(req, res, model)} );
app.get('/json/sitegroup', function(req, res){sitegroup.list_json(req, res, model)});
app.get('/json/sitegroup/details', function(req, res){sitegroup.listdetails_json(req, res, model)});

//Sites
app.get ('/sitegroup/:sitegroupid/site',ensureAuthenticated, function(req, res){site.list(req, res, model)});
app.post('/sitegroup/:sitegroupid/site/create',ensureAuthenticated, function(req, res){site.create(req, res, model)});
app.post('/sitegroup/:sitegroupid/site/update',ensureAuthenticated, function(req, res){site.update(req, res, model)});
app.post('/sitegroup/:sitegroupid/site/delete',ensureAuthenticated, function(req, res){site.delete(req, res, model)});
app.get ('/sitegroup/:sitegroupid/site/:siteid',ensureAuthenticated, function(req, res){building.list(req, res, model)} );
app.post ('/sitegroup/:sitegroupid/site/:siteid/contacts/add', function(req, res){site.addContact(req, res, model)});
app.post ('/sitegroup/:sitegroupid/site/:siteid/contacts/remove', function(req, res){site.removeContact(req, res, model)});
app.post ('/sitegroup/:sitegroupid/site/:siteid/addresses/add', function(req, res){site.addAddress(req, res, model)});
app.post ('/sitegroup/:sitegroupid/site/:siteid/addresses/remove', function(req, res){site.removeAddress(req, res, model)});
app.post ('/sitegroup/:sitegroupid/site/:siteid/addresses/update', function(req, res){site.updateAddress(req, res, model)});
app.post ('/sitegroup/:sitegroupid/site/:siteid/notes/add', function(req, res){site.addNote(req, res, model)});
app.post ('/sitegroup/:sitegroupid/site/:siteid/notes/remove', function(req, res){site.removeNote(req, res, model)});
app.get ('/json/sitegroup/:sitegroupid/site', function(req, res){site.list_json(req, res, model)});
app.get ('/json/site/:siteid/addresses', function(req, res){site.listAddresses_json(req, res, model)});
app.get ('/json/site/:siteid/contacts', function(req, res){site.listContacts_json(req, res, model)});
app.get ('/json/site/:siteid/notes', function(req, res){site.listNotes_json(req, res, model)});
app.get ('/json/sitegroup/:sitegroupid/site/details', function(req, res){site.listdetails_json(req, res, model)});

//Buildings
app.get ('/sitegroup/:sitegroupid/site/:siteid/building',ensureAuthenticated, function(req, res){building.list(req, res, model)});
app.post('/sitegroup/:sitegroupid/site/:siteid/building/create',ensureAuthenticated, function(req, res){building.create(req, res, model)});
app.post('/sitegroup/:sitegroupid/site/:siteid/building/update',ensureAuthenticated, function(req, res){building.update(req, res, model)});
app.post('/sitegroup/:sitegroupid/site/:siteid/building/delete',ensureAuthenticated, function(req, res){building.delete(req, res, model)});
app.get ('/sitegroup/:sitegroupid/site/:siteid/building/:buildingid',ensureAuthenticated, function(req, res){floor.list(req, res, model)} );
app.get ('/json/sitegroup/:sitegroupid/site/:siteid/building', function(req, res){building.list_json(req, res, model)});
app.get ('/json/sitegroup/:sitegroupid/site/:siteid/building/details', function(req, res){building.listdetails_json(req, res, model)});

//Floors
app.get ('/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor',ensureAuthenticated, function(req, res){floor.list(req, res, model)});
app.post('/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/create',ensureAuthenticated, function(req, res){floor.create(req, res, model)});
app.post('/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/update',ensureAuthenticated, function(req, res){floor.update(req, res, model)});
app.post('/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/delete',ensureAuthenticated, function(req, res){floor.delete(req, res, model)});
app.get ('/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/:floorid',ensureAuthenticated, function(req, res){closet.list(req, res, model)} );
app.get ('/json/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor', function(req, res){floor.list_json(req, res, model)});
app.get ('/json/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/details', function(req, res){floor.listdetails_json(req, res, model)});


//Closets
app.get ('/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/:floorid/closet',ensureAuthenticated, function(req, res){closet.list(req, res, model)});
app.post('/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/:floorid/closet/create',ensureAuthenticated, function(req, res){closet.create(req, res, model)});
app.post('/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/:floorid/closet/update',ensureAuthenticated, function(req, res){closet.update(req, res, model)});
app.post('/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/:floorid/closet/delete',ensureAuthenticated, function(req, res){closet.delete(req, res, model)});
app.get ('/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/:floorid/closet/:closetid',ensureAuthenticated, function(req, res){device.list(req, res, model)} );
app.get ('/json/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/:floorid/closet', function(req, res){closet.list_json(req, res, model)});
app.get ('/json/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/:floorid/closet/details', function(req, res){closet.listdetails_json(req, res, model)});
app.get ('/json/closet/details', function(req, res){closet.listAllDetails_json(req, res, model)} );
app.get ('/json/closet/sitegroup/:sitegroupid', function(req, res){closet.listBySiteGroup_json(req, res, model)});
app.get ('/json/closet/site/:siteid', function(req, res){closet.listBySite_json(req, res, model)});
app.get ('/json/closet/building/:buildingid', function(req, res){closet.listByBuilding_json(req, res, model)});
app.get ('/json/closet/floor/:floorid', function(req, res){closet.listByFloor_json(req, res, model)});
app.get ('/json/closet/:closetid', function(req, res){closet.listByCloset_json(req, res, model)});

//Devices
app.get ('/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/:floorid/closet/:closetid/device',ensureAuthenticated, function(req, res){device.list(req, res, model)});
app.post('/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/:floorid/closet/:closetid/device/create',ensureAuthenticated, function(req, res){device.create(req, res, model)});
app.post('/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/:floorid/closet/:closetid/device/update',ensureAuthenticated, function(req, res){device.update(req, res, model)});
app.post('/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/:floorid/closet/:closetid/device/delete',ensureAuthenticated, function(req, res){device.delete(req, res, model)});
app.get ('/json/sitegroup/:sitegroupid/site/:siteid/building/:buildingid/floor/:floorid/closet/:closetid/device', function(req, res){device.list_json(req, res, model)});

app.get ('/devices',ensureAuthenticated, function(req, res){device.listAll(req, res, model)});
app.post('/devices',ensureAuthenticated, function(req, res){device.create(req, res, model)});
app.post('/devices/update',ensureAuthenticated, function(req, res){device.update(req, res, model)});
app.post('/devices/delete',ensureAuthenticated, function(req, res){device.delete(req, res, model)} );
app.get ('/devices/:deviceid',ensureAuthenticated, function(req, res){device.details(req, res, model)} );
app.get ('/json/devices', function(req, res){device.listAll_json(req, res, model)});
app.get ('/json/devices/sitegroup/:sitegroupid', function(req, res){device.listAllSiteGroup_json(req, res, model)});
app.get ('/json/devices/site/:siteid', function(req, res){device.listAllSite_json(req, res, model)});
app.get ('/json/devices/building/:buildingid', function(req, res){device.listAllBuilding_json(req, res, model)});
app.get ('/json/devices/floor/:floorid', function(req, res){device.listAllFloor_json(req, res, model)});
app.get ('/json/devices/closet/:closetid', function(req, res){device.listAllCloset_json(req, res, model)});
app.get ('/csv/devices', function(req, res){device.listAll_csv(req, res, model)});
app.get ('/csv/devices/sitegroup/:sitegroupid', function(req, res){device.listAllSiteGroup_csv(req, res, model)});
app.get ('/csv/devices/site/:siteid', function(req, res){device.listAllSite_csv(req, res, model)});
app.get ('/csv/devices/building/:buildingid', function(req, res){device.listAllBuilding_csv(req, res, model)});
app.get ('/csv/devices/floor/:floorid', function(req, res){device.listAllFloor_csv(req, res, model)});
app.get ('/csv/devices/closet/:closetid', function(req, res){device.listAllCloset_csv(req, res, model)});

//Products Category
app.get ('/admin/ProductCategory',ensureAuthenticated, function(req, res){ProductCategory.list(req, res, model)});
app.post('/admin/ProductCategory',ensureAuthenticated, function(req, res){ProductCategory.create(req, res, model)});
app.get ('/admin/ProductCategory/:ProductCategoryid',ensureAuthenticated, function(req, res){ProductCategory.details(req, res, model)} );
app.delete('/admin/ProductCategory/:ProductCategoryid',ensureAuthenticated, function(req, res){ProductCategory.delete(req, res, model)} );
app.post('/admin/ProductCategory/update',ensureAuthenticated, function(req, res){ProductCategory.update(req, res, model)});
app.post('/admin/ProductCategory/delete',ensureAuthenticated, function(req, res){ProductCategory.delete(req, res, model)} );
app.get ('/json/ProductCategory', function(req, res){ProductCategory.list_json(req, res, model)});
app.get ('/json/ProductCategory/details', function(req, res){ProductCategory.listdetails_json(req, res, model)});
app.get ('/json/admin/ProductCategory/:ProductCategoryid', function(req, res){ProductCategory.details_json(req, res, model)} );

//Products
app.post('/admin/ProductCategory/:ProductCategoryid/product',ensureAuthenticated, function(req, res){product.create(req, res, model)});
app.post('/admin/ProductCategory/:ProductCategoryid/product/update',ensureAuthenticated, function(req, res){product.update(req, res, model)});
app.post('/admin/ProductCategory/:ProductCategoryid/product/delete',ensureAuthenticated, function(req, res){product.delete(req, res, model)} );
app.get ('/admin/product/select', function(req, res){product.selectView(req, res, model)} );
app.get ('/json/product/details', function(req, res){product.listAllDetails_json(req, res, model)} );


//Notes
app.get ('/note',ensureAuthenticated, function(req, res){note.list(req, res, model)});
app.get ('/note/:noteid',ensureAuthenticated, function(req, res){note.details(req, res, model)});
app.post ('/note/:noteidupdate',ensureAuthenticated, function(req, res){note.update(req, res, model)});
app.get ('/json/note/:noteid/details', function(req, res){note.details_json(req, res, model)} );
app.get ('/json/note/:noteid/author', function(req, res){note.author_json(req, res, model)} );


//Logs
app.get('/admin/audit', ensureAuthenticated, function(req, res){log.list(req, res, model)});
app.get('/json/admin/log', function(req, res){log.list_json(req, res, model)});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


