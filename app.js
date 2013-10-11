
/**
 * Module dependencies.
 */
var passport = require('passport');
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log("LocalStrategy()");
        if(model){
            model.findUserByUsername(username, function(err, user) {
                if(err) { return done(null, false, err);   }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }
                console.log("User:");
                console.log(user);
                console.log("User Password:" + user.getDataValue('password'));
                console.log("Entered Password:" + password);
                if (user.getDataValue('password') !== password) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                console.log("User " + username + " identified");
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
    console.log('serializeUser()');
    console.log(user.getDataValue('id'));

    return done(null, user.getDataValue('id'));
});

passport.deserializeUser(function(id, done) {
    console.log('deserializeUser()');
    if(!model){ return done(null, false, { message: 'Model not load.' });}

    model.findUserById(id, function(err, user) {
        console.log('user:');
        console.log(user);

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

var site = require('./routes/site');
var building = require('./routes/building');
var floor = require('./routes/floor');
var closet = require('./routes/closet');
var device = require('./routes/device');
var productfamily = require('./routes/productfamily');
var product = require('./routes/product');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs-locals'));
app.use(express.favicon());
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
    console.log('ensureAuthenticated()');
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
};


app.get('/',ensureAuthenticated, routes.index);
app.get('/login', login.login);
app.post('/login', passport.authenticate('local', { successRedirect: '/Sites', failureRedirect: '/login', failureFlash: false }));
app.get('/users',ensureAuthenticated, user.list);
app.get('/register', user.register);
app.post('/register', function(req, res){user.registration(req, res, model)} );
app.get('/logout',ensureAuthenticated, function(req, res){req.logout();res.redirect('/');});


//Sites
app.get('/sites', function(req, res){site.list(req, res, model)});
app.post('/sites', function(req, res){site.create(req, res, model)});
//app.delete('/sites/:sitecode', function(req, res){site.delete(req, res, model)} );
app.get('/sites/:sitecode', function(req, res){site.details(req, res, model)} );
app.get('/json/sites', function(req, res){site.list_json(req, res, model)});
app.get('/json/sites/details', function(req, res){site.listdetails_json(req, res, model)});

//Buildings
app.get('/sites/:sitecode/building', function(req, res){building.list(req, res, model)});
app.post('/sites/:sitecode/building', function(req, res){building.create(req, res, model)});
//app.delete('/sites/:sitecode/building/:buildingid', function(req, res){building.delete(req, res, model)} );
app.get('/sites/:sitecode/building/:buildingid', function(req, res){building.details(req, res,model)} );
app.get('/json/sites/:sitecode/building', function(req, res){building.list_json(req, res, model)});


//Floors
app.get('/sites/:sitecode/building/:buildingid/floor', function(req, res){floor.list(req, res, model)});
app.post('/sites/:sitecode/building/:buildingid/floor', function(req, res){floor.create(req, res, model)});
//app.delete('/sites/:sitecode/building/:buildingid/floor/:floorid', function(req, res){floor.delete(req, res, model)} );
app.get('/sites/:sitecode/building/:buildingid/floor/:floorid', function(req, res){floor.details(req, res, model)} );
app.get('/json/sites/:sitecode/building/:buildingid/floor', function(req, res){floor.list_json(req, res, model)});

//Closets
app.get('/sites/:sitecode/building/:buildingid/floor/:floorid/closet', function(req, res){closet.list(req, res, model)});
app.post('/sites/:sitecode/building/:buildingid/floor/:floorid/closet', function(req, res){closet.create(req, res, model)});
//app.delete('/sites/:sitecode/building/:buildingid/floor/:floorid/closet/:closetid', function(req, res){closet.delete(req, res, model)} );
app.get('/sites/:sitecode/building/:buildingid/floor/:floorid/closet/:closetid', function(req, res){closet.details(req, res, model)} );
app.get('/json/sites/:sitecode/building/:buildingid/floor/:floorid/closet', function(req, res){closet.list_json(req, res, model)});


//Devices
app.get('/sites/:sitecode/building/:buildingid/floor/:floorid/closet/:closetid/device', function(req, res){device.getDeviceFromCloset(req, res, model)});
app.post('/sites/:sitecode/building/:buildingid/floor/:floorid/closet/:closetid/device', function(req, res){device.createDeviceWithClosetId(req, res, model)});
app.get('/json/sites/:sitecode/building/:buildingid/floor/:floorid/closet/:closetid/device', function(req, res){device.getDeviceFromCloset_json(req, res, model)});

app.get('/devices', function(req, res){device.listAll(req, res, model)});
app.post('/devices', function(req, res){device.create(req, res, model)});
//app.delete('/devices/:deviceid', function(req, res){device.delete(req, res, model)} );
app.get('/devices/:deviceid', function(req, res){device.details(req, res, model)} );
app.get('/json/devices', function(req, res){device.listAll_json(req, res, model)});


//Products family
app.get('/admin/productfamily', function(req, res){productfamily.list(req, res, model)});
app.post('/admin/productfamily', function(req, res){productfamily.create(req, res, model)});
app.get('/admin/productfamily/:productfamilyid', function(req, res){productfamily.details(req, res, model)} );
app.delete('/admin/productfamily/:productfamilyid', function(req, res){productfamily.delete(req, res, model)} );
app.get('/json/productfamily', function(req, res){productfamily.list_json(req, res, model)});
app.get('/json/productfamily/details', function(req, res){productfamily.listdetails_json(req, res, model)});
app.get('/json/admin/productfamily/:productfamilyid', function(req, res){productfamily.details_json(req, res, model)} );
app.post('/admin/productfamily/update', function(req, res){productfamily.update(req, res, model)});
app.post('/admin/productfamily/delete', function(req, res){productfamily.delete(req, res, model)} );

//Products
app.post('/admin/productfamily/:productfamilyid/product', function(req, res){product.create(req, res, model)});
app.post('/admin/productfamily/:productfamilyid/product/update', function(req, res){product.update(req, res, model)});
app.post('/admin/productfamily/:productfamilyid/product/delete', function(req, res){product.delete(req, res, model)} );


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


