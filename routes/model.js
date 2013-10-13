/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('inventory', 'inventory', 'inventory', {
    host: "localhost",
    //host: "10.118.204.106",
    port: 3306,
    dialect: 'mysql'
});

var User = sequelize.define('user',
    {
    name: { type: Sequelize.STRING, allowNull: false},
    username: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    password: { type: Sequelize.STRING, defaultValue: "password", allowNull: false},
    role: { type: Sequelize.STRING, defaultValue: "read"},
    email: { type: Sequelize.STRING, defaultValue: "",allowNull: false},
    telephone: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    address1: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    address2: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    city: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    state: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    zipcode: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    position: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
    },
    {
        getterMethods   : {
            validPassword : function(password)  { return (this.password === password); }
        },

        setterMethods   : {
            resetPassword : function() { this.password = "password"; }
        }
    }
);

var Log = sequelize.define('log', {
    action: { type: Sequelize.STRING, defaultValue: "unknown", allowNull: false},
    model: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    text: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
});

var Comment = sequelize.define('device', {
    text: { type: Sequelize.STRING,defaultValue: "", allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
});

var Device = sequelize.define('device', {
    name: { type: Sequelize.STRING, allowNull: false},
    serial: { type: Sequelize.STRING, allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
});

var ProductFamily = sequelize.define('productfamily', {
    name: { type: Sequelize.STRING, allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
    
});

var Product = sequelize.define('product', {
    name: { type: Sequelize.STRING, allowNull: false},
    part: { type: Sequelize.STRING, defaultValue: "unknown", allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
    
});

var Closet = sequelize.define('closet', {
    name: { type: Sequelize.STRING, allowNull: false},
    spare: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
    canbedeleted: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
    
});

var Floor = sequelize.define('floor', {
    name: { type: Sequelize.STRING, allowNull: false},
    canbedeleted: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
    
});

var Building = sequelize.define('building', {
    name: { type: Sequelize.STRING, allowNull: false},
    canbedeleted: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
});

var Address = sequelize.define('address', {
    address1: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    address2: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    city: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    state: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    zipcode: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
});

var Site = sequelize.define('site', {
    name: { type: Sequelize.STRING, allowNull: false},
    code: { type: Sequelize.STRING, allowNull: false},
    canbedeleted: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false},
    category: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
});

var Geolocation = sequelize.define('geolocation', {
    name: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    code: { type: Sequelize.STRING, defaultValue: "", allowNull: false},
    deleted: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false}
});

//Association
User.hasMany(Address, {as: 'Addresses'});
Geolocation.hasMany(Site, {as: 'Sites'});
Site.hasMany(User, {as: 'Contacts'});
Site.hasMany(Address, {as: 'Addresses'});
Site.hasMany(Building, {as: 'Buildings'});
Building.hasMany(Floor, {as: 'Floors'});
Floor.hasMany(Closet, {as: 'Closets'});
Closet.hasMany(Device, {as: 'Devices'});
Device.hasMany(Device, {as:'SubDevices'});
Device.hasMany(Product, {as:'Products'});
ProductFamily.hasMany(Product, {as:'Products'});

Device.hasMany(Closet);
Closet.hasMany(Floor);
Floor.hasMany(Building);
Building.hasMany(Site);
Site.hasOne(Geolocation);
Product.hasMany(Device);
Address.hasMany(Site, {as: 'Sites'});
Address.hasMany(User, {as: 'Users'});
User.hasMany(Comment, {as:'Comments'});

Comment.hasOne(User, {as:'Author'});
ProductFamily.hasMany(Comment, {as:'Comments'});
Product.hasMany(Comment, {as:'Comments'});
Device.hasMany(Comment, {as:'Comments'});
Closet.hasMany(Comment, {as:'Comments'});
Floor.hasMany(Comment, {as:'Comments'});
Building.hasMany(Comment, {as:'Comments'});
Site.hasMany(Comment, {as:'Comments'});
Geolocation.hasMany(Comment, {as:'Comments'});
User.hasMany(Log, {as:'Logs'});
Log.hasMany(Comment, {as:'Comments'});
Log.hasOne(User, {as:'Author'});

sequelize
    .sync({force:true})
    .on('success', function() {console.log("Model Create in DB");
        _createUnassignedGeolocation();
        _createDefaultProductFamily();
        _createAdminUser();
        _createDefaultProducts();
    })
    .on('failure', function(err) {console.log(err); });

exports.sequelize = sequelize;
exports.User = User;
exports.Geolocation = Geolocation;
exports.Site = Site;
exports.Building = Building;
exports.Floor = Floor;
exports.Closet = Closet;
exports.Device = Device;
exports.ProductFamily = ProductFamily;
exports.Product = Product;
exports.Address = Address;




//****************************************//
// USER
//****************************************//
var _createUser = function (name,username,email,password, next) {
    var user = User.build({name: name, username: username, email: email, password: password});
    user
        .save()
        .on('success', function() {if(next) next(user);})
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
                if(!user) return next("User " + username + " not found", false);
                return next(null,user);
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

var _createAdminUser = function(){
    var chainer = new Sequelize.Utils.QueryChainer;
    var user = User.build( { name: 'admin', username: 'admin', password: 'admin', role: 'admin' } );

    chainer
        .add(user.save())
        .run()
        .on('success', function() {

        })
        .on('failure', function(err) {
                    });
};
exports.createAdminUser=_createAdminUser;

//****************************************//
// GEOLOCATION
//****************************************//
var _findGeolocationAllDetails = function(next){
    Geolocation.findAll({where: {deleted: false},include: [{ model: Site, as: 'Sites' }] }).success(function(geolocations) {
        var tmpGeolocations = [];
        if (! geolocations instanceof Array){ tmpGeolocations.push(geolocations); }
        else{ tmpGeolocations = geolocations; }

        if(next) return next(null, tmpGeolocations);
    })
};
exports.findGeolocationAllDetails = _findGeolocationAllDetails;

var _findGeolocationAll = function(next){
    Geolocation.findAll({where: {deleted: false}}).success(function(geolocations) {
        var tmpGeolocations = [];
        if (! geolocations instanceof Array){
            tmpGeolocations.push(geolocations);
        }
        else{
            tmpGeolocations = geolocations;
        }

        if(next) return next(null, tmpGeolocations);
    })
};
exports.findGeolocationAll = _findGeolocationAll;

var _findGeolocationById = function(id,next){
    Geolocation
        .find(id)
        .success(function(geolocation) {
            if (!geolocation){ next("geolocation not found", false); }

            if(next) return next(null, geolocation);
        })
};
exports.findGeolocationById = _findGeolocationById;

var _createGeolocation = function (name,code, next) {
    var chainer = new Sequelize.Utils.QueryChainer
        , geolocation = Geolocation.build({name: name, code: code})
        , site = Site.build({name: 'Default', code: 'Default'})
        , building = Building.build({name: 'Main'})
        , floor  = Floor.build({ name: 'Main' })
        , closet  = Closet.build({ name: 'Main' })

    chainer
        .add(geolocation.save())
        .add(site.save())
        .add(building.save())
        .add(floor.save())
        .add(closet.save())

    chainer.run()
        .on('success', function() {
            var chainerAssociations = new Sequelize.Utils.QueryChainer
            chainerAssociations
                .add(floor.addCloset(closet))
                .add(building.addFloor(floor))
                .add(site.addBuilding(building))
                .add(geolocation.addSite(site))
                .run()
                .on('success', function() { if(next) next(null, site); })
                .on('failure', function(err) {
                    if(next) next(err,false);
                })
        })
        .on('failure', function(err) {
            if(next) next(err,false);
        })
};
exports.createGeolocation = _createGeolocation;

var _updateGeolocationById = function(id, name, code, next){
    _findGeolocationById(id, function(err, geolocation){
        if(err){ if(next) next(err, false);}
        if(!geolocation){ if(next) next("Geolocation not found", false);}

        geolocation.updateAttributes({name: name, code: code}).success(function() {
            //*** Add log
            _createLog("UPDATE",'GEOLOCATION','Update geolocation(' + id + '): name=' + name + " code=" + code, null, function(err, log){
                if(next) return next(null, geolocation);
            });
        });
    });
};
exports.updateGeolocationById = _updateGeolocationById;

var _deleteGeolocationById = function (id, next) {
    Geolocation.find(id).success(function(geolocation) {
        if (!geolocation){ if(next) next("Geolocation  not found", false);}
        var name = geolocation.name;
        var code = geolocation.code;
        geolocation.deleted = true;
        geolocation.save().success(function() {
            //*** Add log
            _createLog("DELETE",'GEOLOCATION','Delete geolocation(' + id + ') ' + name, null, function(err, log){
                if(next) return next(null, null);
            });
        });
    });
};
exports.deleteGeolocationById = _deleteGeolocationById;

//Create one Site for Unassigned devices
var _createUnassignedGeolocation = function(){
    _createGeolocation("_Unassigned", "_Unassigned", null);
};
exports.createUnassignedGeolocation=_createUnassignedGeolocation;


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

var _findSiteAllByGeolocationId = function(geolocationid, next){
    _findGeolocationById(geolocationid, function(err, geolocation){
        if(err) {if(next) return next(err, []);}
        if(!geolocation) {if(next) return next("Geolocation not found", []);}

        geolocation.getSites({where: {deleted: false}})
            .on('success', function(sites){
                if(next) next(null, sites);
            })
            .on('failure', function(error){
                if(next) next(error, false);
            });
    });
};
exports.findSiteAllByGeolocationId = _findSiteAllByGeolocationId;

var _findSiteById = function(id,next){
    Site
        .find(id)
        .success(function(site) {
            if (!site){ next("site not found", false); }

            if(next) return next(null, site);
        })
};
exports.findSiteByCode = _findSiteByCode;

var _findSiteByCode = function(code,next){
    Site
        .find({where: {code: code}})
        .success(function(site) {
            if (!site){ next("site not found", false); }

            if(next) return next(null, site);
        })
};
exports.findSiteByCode = _findSiteByCode;

var _createSite = function (name,code, next) {
    var chainer = new Sequelize.Utils.QueryChainer
        , site = Site.build({name: name, code: code})
        , building = Building.build({name: 'Main'})
        , building2 = Building.build({name: 'Main2'})
        , floor  = Floor.build({ name: 'Main' })
        , closet  = Closet.build({ name: 'Main' })

    chainer
        .add(site.save())
        .add(building.save())
        .add(building2.save())
        .add(floor.save())
        .add(closet.save())

    chainer.run()
        .on('success', function() {

            var chainerAssociations = new Sequelize.Utils.QueryChainer
            chainerAssociations
                .add(floor.addCloset(closet))
                .add(building.addFloor(floor))
                .add(site.addBuilding(building))
                .add(site.addBuilding(building2))
                .run()
                .on('success', function() { if(next) next(null, site); })
                .on('failure', function(err) {
                    console.log("---------");
                    console.log(err);
                    if(next) next(err,false);
                })
        })
        .on('failure', function(err) {
            console.log("---------");
            console.log(err);
            if(next) next(err,false);
        })
};
exports.createSite = _createSite;

var _createSiteWithGeolocationId = function (geolocationid, name,code, next) {
    _createSite(name,code,function(err, site){
        if(site){
            _findGeolocationById(geolocationid, function(err, geolocation){
                if(geolocation){
                    geolocation.addSite(site)
                        .on('success', function(){
                            _createLog("CREATE",'SITE','Create site: name=' + site.name + " code=" + site.code + ' in ' + geolocation.name, null, function(err, log){
                                if(next) return next(null, site);
                            });
                        })
                        .on('failure', function(site){
                            if(next) next(error, false);
                        });
                }
            });
        }
    });

};
exports.createSiteWithGeolocationId = _createSiteWithGeolocationId;

var _updateSiteById = function(id, name, code, next){
    _findSiteById(id, function(err, site){
        if(err){ if(next) next(err, false);}
        if(!site){ if(next) next("Site not found", false);}

        site.updateAttributes({name: name, code: code}).success(function() {
            //*** Add log
            _createLog("UPDATE",'SITE','Update site(' + id + '): name=' + name + " code=" + code, null, function(err, log){
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



//Create one Site for Unassigned devices
var _createUnassignedSite = function(){
        var chainer = new Sequelize.Utils.QueryChainer
            , site = Site.build({name: "_Unassigned", code: "_Unassigned", canbedeleted:false})
            , building = Building.build({name: 'Default', canbedeleted:false})
            , floor  = Floor.build({ name: 'Default', canbedeleted:false })
            , closet  = Closet.build({ name: 'Default', canbedeleted:false })

        chainer
            .add(site.save())
            .add(building.save())
            .add(floor.save())
            .add(closet.save())

        chainer.run()
            .on('success', function() {

                var chainerAssociations = new Sequelize.Utils.QueryChainer
                chainerAssociations
                    .add(floor.addCloset(closet))
                    .add(building.addFloor(floor))
                    .add(site.addBuilding(building))
                    .run()
                    .on('success', function() {  })
                    .on('failure', function(err) {
                    })
            })
            .on('failure', function(err) {
            });
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

var _createBuilding = function (name, next) {
    var chainer = new Sequelize.Utils.QueryChainer
        , building = Building.build({name: name})
        , floor  = Floor.build({ name: 'Main' })
        , closet  = Closet.build({ name: 'Main' })

    chainer
        .add(building.save())
        .add(floor.save())
        .add(closet.save())

    chainer.run()
        .on('success', function() {

            var chainerAssociations = new Sequelize.Utils.QueryChainer
            chainerAssociations
                .add(floor.addCloset(closet))
                .add(building.addFloor(floor))
                .run()
                .on('success', function() { if(next) next(null, building); })
                .on('failure', function(err) {
                    console.log("---------");
                    console.log(err);
                    if(next) next(err,false);
                })
        })
        .on('failure', function(err) {
            console.log("---------");
            console.log(err);
            if(next) next(err,false);
        })
};
exports.createBuilding = _createBuilding;

var _createBuildingWithSitecode = function (sitecode, name, next) {
    //Create new building
    _createBuilding(name, function(err, building){
        if(building){
            //Get Site from SiteCode
            _findSiteByCode(sitecode, function(err, site){
                //Link Building to Site
                site.addBuilding(building)
                    .on('success', function(){
                        if(next) next(null, building);
                    })
                    .on('failure', function(error){
                        if(next) next(error, false);
                    });
            });
        }
    });
};
exports.createBuildingWithSitecode = _createBuildingWithSitecode;


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

var _createFloor = function (name, next) {
    var chainer = new Sequelize.Utils.QueryChainer
        , floor  = Floor.build({ name: name })
        , closet  = Closet.build({ name: 'Main' })

    chainer
        .add(floor.save())
        .add(closet.save())

    chainer.run()
        .on('success', function() {

            var chainerAssociations = new Sequelize.Utils.QueryChainer
            chainerAssociations
                .add(floor.addCloset(closet))
                .run()
                .on('success', function() { if(next) next(null, floor); })
                .on('failure', function(err) {
                    console.log("---------");
                    console.log(err);
                    if(next) next(err,false);
                })
        })
        .on('failure', function(err) {
            console.log("---------");
            console.log(err);
            if(next) next(err,false);
        })
};
exports.createFloor = _createFloor;

var _createFloorWithBuildingId = function (buildingid, name, next) {
    //Create new building
    _createFloor(name, function(err, floor){
        if(floor){
            //Get Site from SiteCode
            _findBuildingById(buildingid, function(err, building){
                //Link Building to Site
                building.addFloor(floor)
                    .on('success', function(){
                        if(next) next(null, floor);
                    })
                    .on('failure', function(floor){
                        if(next) next(error, false);
                    });
            });
        }
    });
};
exports.createFloorWithBuildingId = _createFloorWithBuildingId;

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

var _createCloset = function (name, next) {
    var chainer = new Sequelize.Utils.QueryChainer
    , closet  = Closet.build({ name: name });

    chainer
        .add(closet.save())

    chainer.run()
        .on('success', function() {

            var chainerAssociations = new Sequelize.Utils.QueryChainer
            chainerAssociations
                .run()
                .on('success', function() { if(next) next(null, closet); })
                .on('failure', function(err) {
                    console.log("---------");
                    console.log(err);
                    if(next) next(err,false);
                })
        })
        .on('failure', function(err) {
            console.log("---------");
            console.log(err);
            if(next) next(err,false);
        })
};
exports.createCloset = _createCloset;

var _createClosetWithFloorId = function (floorid, name, next) {
    //Create new building
    _createCloset(name, function(err, closet){
        if(closet){
            //Get Site from SiteCode
            _findFloorById(floorid, function(err, floor){
                //Link Building to Site
                floor.addCloset(closet)
                    .on('success', function(){
                        if(next) next(null, closet);
                    })
                    .on('failure', function(closet){
                        if(next) next(error, false);
                    });
            });
        }
    });
};
exports.createClosetWithFloorId = _createClosetWithFloorId;



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

var _createDevice = function (name,type, next) {
    var chainer = new Sequelize.Utils.QueryChainer
    , device  = Device.build({ name: name, type: type });

    chainer
        .add(device.save())

    chainer.run()
        .on('success', function() {

            var chainerAssociations = new Sequelize.Utils.QueryChainer
            chainerAssociations
                .run()
                .on('success', function() { if(next) next(null, device); })
                .on('failure', function(err) {
                    console.log("---------");
                    console.log(err);
                    if(next) next(err,false);
                })
        })
        .on('failure', function(err) {
            console.log("---------");
            console.log(err);
            if(next) next(err,false);
        })
};
exports.createDevice = _createDevice;

var _createDeviceWithClosetId = function (closetid, name,type, next) {
    _createDevice(name,type, function(err, device){
        if(device){
            //Get Site from SiteCode
            _findClosetById(closetid, function(err, closet){
                //Link Building to Site
                closet.addDevice(device)
                    .on('success', function(){
                        if(next) next(null, device);
                    })
                    .on('failure', function(device){
                        if(next) next(error, false);
                    });
            });
        }
    });
};
exports.createDeviceWithClosetId = _createDeviceWithClosetId;

var _findDeviceAllDetails = function(){
    var sql = "SELECT * from device_fulldetails";


};



//****************************************//
// Product Family
//****************************************//
var _findProductFamilyAll = function(next){
    ProductFamily.findAll({where: {deleted: false}, include: [{ model: Product, as: 'Products' }] }).success(function(productfamilies) {
        var tmpProductFamilies = [];
        if (! productfamilies instanceof Array){ tmpProductFamilies.push(productfamilies); }
        else{ tmpProductFamilies = productfamilies; }

        if(next) return next(null, tmpProductFamilies);
    })
};
exports.findProductFamilyAll = _findProductFamilyAll;

var _findProductFamilyById = function(id, next){
    ProductFamily.find(id).success(function(productfamily) {
        if (!productfamily){ if(next) next("Product Family not found", false);}
        if(next) return next(null, productfamily);
    })
};
exports.findProductFamilyById = _findProductFamilyById;

var _findProductFamilyByName = function(name, next){
    ProductFamily.findAll({where: {name: name}, limit: 1}).success(function(productfamily) {
        if (!productfamily){ if(next) next("Product Family not found", false);}
        if(next) return next(null, productfamily);
    })
};
exports.findProductFamilyByName = _findProductFamilyByName;

var _createProductFamily = function (name, next) {
    var chainer = new Sequelize.Utils.QueryChainer
    , productfamily  = ProductFamily.build({ name: name });

    chainer
        .add(productfamily.save())

    chainer.run()
        .on('success', function() {
            //Log
            _createLog("CREATE",'PRODUCTFAMILY','Create product family: name=' + name,  null, function(err, log){
                if(next) return next(null, productfamily);
            });
        })
        .on('failure', function(err) {
            console.log("---------");
            console.log(err);
            if(next) next(err,false);
        })
};
exports.createProductFamily = _createProductFamily;

var _deleteProductFamilyById = function (id, next) {
    ProductFamily.find(id).success(function(productfamily) {
            if (!productfamily){ if(next) next("Product Family not found", false);}
            var name = productfamily.name
            productfamily.deleted = true;
            productfamily.save().success(function() {
                //*** Add log
                _createLog("DELETE",'PRODUCTFAMILY','Delete product family('+ id +') name=' + name,  null, function(err, log){
                    if(next) return next(null, null);
                });
            });
        });
};
exports.deleteProductFamilyById = _deleteProductFamilyById;

var _updateProductFamilyById = function (id,name, next) {
    ProductFamily.find(id).success(function(productfamily) {
            if (!productfamily){ if(next) next("Product Family not found", false);}
            productfamily.updateAttributes({name: name}).success(function() {
                //*** Add log
                _createLog("UPDATE",'PRODUCTFAMILY','Update product family('+ id +') name=' + name,  null, function(err, log){
                    if(next) return next(null, productfamily);
                });
            });
        });
};
exports.updateProductFamilyById = _updateProductFamilyById;

//Create default Product Family
var _createDefaultProductFamily = function(){
        var chainer = new Sequelize.Utils.QueryChainer;

        chainer
            .add(ProductFamily.build({name:'IPD'}).save())
            .add(ProductFamily.build({name:'OND'}).save())
            .add(ProductFamily.build({name:'DATA'}).save())
            .add(ProductFamily.build({name:'VOICE'}).save())
            .add(ProductFamily.build({name:'WIRELESS'}).save())
            .add(ProductFamily.build({name:'SERVER'}).save())
            .add(ProductFamily.build({name:'APPLICATION'}).save())
            .add(ProductFamily.build({name:'OTHER'}).save())

        chainer.run()
            .on('success', function() {
            })
            .on('failure', function(err) {
            });
};
exports.createDefaultProductFamily=_createDefaultProductFamily;



//****************************************//
// Product
//****************************************//
var _findProductAll = function(next){
    Product.findAll({where: {deleted: false}}).success(function(productfamilies) {
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

var _findProductAllByProductFamilyId = function(productfamilyid, next){
    _findProductFamilyById(productfamilyid, function(err, productfamily){
        if(productfamily)
        {
            productfamily.getProducts()
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
            if(next) next('Product Family not found',false);
        }
    });
};
exports.findProductAllByProductFamilyId = _findProductAllByProductFamilyId;

var _findProductById = function(id, next){
    Product.find(id).success(function(product) {
        if (!product){ if(next) next("Product not found", false);}
        if(next) return next(null, product);
    })
};
exports.findProductById = _findProductById;

var _createProduct = function (name,part, next) {
    var chainer = new Sequelize.Utils.QueryChainer
    , product  = Product.build({ name: name, part: part });

    chainer
        .add(product.save())

    chainer.run()
        .on('success', function() {

            var chainerAssociations = new Sequelize.Utils.QueryChainer
            chainerAssociations
                .run()
                .on('success', function() { if(next) next(null, product); })
                .on('failure', function(err) {
                    console.log("---------");
                    console.log(err);
                    if(next) next(err,false);
                })
        })
        .on('failure', function(err) {
            console.log("---------");
            console.log(err);
            if(next) next(err,false);
        })
};
exports.createProduct = _createProduct;

var _createProductWithProductFamilyId = function (productfamilyId, name,part, next) {
    _createProduct(name,part, function(err, product){
        if(product){
            //Get Product family from SiteCode
            _findProductFamilyById(productfamilyId, function(err, productfamily){
                //Link Product to Product family
                productfamily.addProduct(product)
                    .on('success', function(){
                        _createLog("CREATE",'PRODUCT','Create product: name=' + name + " part=" + part + ' for ' + productfamily.name, null, function(err, log){
                            if(next) return next(null, product);
                        });
                    })
                    .on('failure', function(product){
                        if(next) next(error, false);
                    });
            });
        }
    });
};
exports.createProductWithProductFamilyId = _createProductWithProductFamilyId;

var _createProductWithProductFamilyName = function (productfamilyName, name,part, next) {
    _createProduct(name,part, function(err, product){
        if(product){
            //Get Product family from SiteCode
            _findProductFamilyByName(productfamilyName, function(err, productfamilys){
                //Link Product to Product family
                productfamilys[0].addProduct(product)
                    .on('success', function(){
                        _createLog("CREATE",'PRODUCT','Create product: name=' + name + " part=" + part + ' for ' + productfamilyName, null, function(err, log){
                            if(next) return next(null, product);
                        });
                    })
                    .on('failure', function(product){
                        if(next) next(error, false);
                    });

            });
        }
    });
};
exports.createProductWithProductFamilyName = _createProductWithProductFamilyName;


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

var _updateProductById = function (id,name,part, next) {
    Product.find(id).success(function(product) {
            if (!product){ if(next) next("Product not found", false);}
            product.updateAttributes({name: name, part: part}).success(function() {
                //*** Add log
                _createLog("UPDATE",'PRODUCT','Update product(' + id + '): name=' + name + " part=" + part, null, function(err, log){
                    if(next) return next(null, product);
                });
            });
        });
};
exports.updateProductById = _updateProductById;


var _createDefaultProducts = function(){
    _createProductWithProductFamilyName('VOICE','VoIP8-1 Daughterboard : 8 IP channels','3EH73063AC');
    _createProductWithProductFamilyName('VOICE','PCM2 board, pulse code modulation board (1)','3BA23064AC');
    _createProductWithProductFamilyName('VOICE','RMAB board: Remote Maintenance Access Board','3BA23081AB');
    _createProductWithProductFamilyName('VOICE','DPT1 board, T1 2 x primary rate accesses (24)','3BA23164AA');
    _createProductWithProductFamilyName('VOICE','NDDI2-2 BOARD','3BA23171AB');
    _createProductWithProductFamilyName('VOICE','CLIPIA card class services option (4 circuits)','3BA23173AA');
    _createProductWithProductFamilyName('VOICE','INT-IP2 board: Board for spare','3BA23193AC');
    _createProductWithProductFamilyName('VOICE','GS card, loop start/ground start option (4 circuits)','3BA23196AA');
    _createProductWithProductFamilyName('VOICE','GPA2 board : conf 29, Dynamic + Static (4 language) Voice Guide','3BA23241AA');
    _createProductWithProductFamilyName('VOICE','10/100BASE-T connector','3BA23243AA');
    _createProductWithProductFamilyName('VOICE','INTOF2 board: Inter Crystal board','3BA23260AA');
    _createProductWithProductFamilyName('VOICE','GIP4-4 board','3BA23263AA');
    _createProductWithProductFamilyName('VOICE','e-Z32 board‚ 32 anolog interfaces','3BA23265AB');
    _createProductWithProductFamilyName('VOICE','e-UA32 board, 32 UA interfaces','3BA23266AA');
    _createProductWithProductFamilyName('VOICE','IDE hard disk for CPU or 4635','3BA27013AB');
    _createProductWithProductFamilyName('VOICE','PSAL & 48V data cabinet (ACT) connecting kit','3BA27121AA');
    _createProductWithProductFamilyName('VOICE','Variable speed fans for data cabinet (ACT)','3BA27132AA');
    _createProductWithProductFamilyName('VOICE','ACT shipment kit','3BA27134AA');
    _createProductWithProductFamilyName('VOICE','Server Security Module RM (SSM-RM)','3BA27698AA');
    _createProductWithProductFamilyName('VOICE','Media Security Module RM (MSM-RM)','3BA27699AA');
    _createProductWithProductFamilyName('VOICE','15 m cable from CBRMA to MDF','3BA28028UA');
    _createProductWithProductFamilyName('VOICE','15 m cable from DPT1 to MDF with RJ45 connector','3BA28142UA');
    _createProductWithProductFamilyName('VOICE','COST-MU card: Multi-mode optical transmission  system card (to use with INTOF)','3BA53119AA');
    _createProductWithProductFamilyName('VOICE','ACT28 shelf: Shelf 12U/28 slots','3BA56007UA');
    _createProductWithProductFamilyName('VOICE','Asynchronous telemaintenance modem for VH, WM1, M2 and M3 cabinets','3BA57117BG');
    _createProductWithProductFamilyName('VOICE','DIGITAL VOICE BOARD 60 PORTS','3BA57266AC');
    _createProductWithProductFamilyName('VOICE','INT/INT 5 m system cable, INTOF to INTOF','3BA58018UA');
    _createProductWithProductFamilyName('VOICE','15 m MDF TY1 64pts DIN cable for UA‚ Z‚ NDDI‚ BRA boards','3BA58020UB');
    _createProductWithProductFamilyName('VOICE','15 m MDF TY4 96pts DIN cable from CPU to MDF','3BA58027UA');
    _createProductWithProductFamilyName('VOICE','CPU redundancy to connecting box 10 m system cable','3BA58074UA');
    _createProductWithProductFamilyName('VOICE','Digital Public Access Board - 1 Primary Rate T1 Access','3EH73007AC');
    _createProductWithProductFamilyName('VOICE','Controller board MEX','3EH73026AD');
    _createProductWithProductFamilyName('VOICE','APA8 Analog trunk access board for 8 trunk lines','3EH73031AD');
    _createProductWithProductFamilyName('VOICE','APA4 Analog trunk access board for 4 trunk lines','3EH73031BD');
    _createProductWithProductFamilyName('VOICE','GSCLI APA daughtercard for Ground Start function','3EH73033AB');
    _createProductWithProductFamilyName('VOICE','CLIDSP APA daughtercard for local management of CLI signals','3EH73034AB');
    _createProductWithProductFamilyName('VOICE','GATEWAY DRIVER BOARD (GD-2)','3EH73048BC');
    _createProductWithProductFamilyName('VOICE','GATEWAY APPLICATIVE BOARD (GA-2)','3EH73048BD');
    _createProductWithProductFamilyName('VOICE','Digital interfaces board UAI16-1 : 16 digital interfaces','3EH73050AB');
    _createProductWithProductFamilyName('VOICE','Analog Interfaces Board  SLI16-1 : 16 analog interfaces','3EH73052AB');
    _createProductWithProductFamilyName('VOICE','Alcatel 4038 IP Touch set Urban grey US','3GV27003UB');
    _createProductWithProductFamilyName('VOICE','Wireless handset Bluetooth® Urban grey for 4068 IP Touch‚ including battery','3GV27007AB');
    _createProductWithProductFamilyName('VOICE','Alcatel 4039 set Urban grey US','3GV27009UB');
    _createProductWithProductFamilyName('VOICE','Smart display additional module for Alcatel 4028/4029/4038/4039/4068 sets‚ Urban grey‚ with 14 keys‚ foot','3GV27013AB');
    _createProductWithProductFamilyName('VOICE','Alcatel 4068 IP Touch set Urban grey','3GV27043UB');
    _createProductWithProductFamilyName('DATA','CLIENT SERVERS','3BA27582A');
    _createProductWithProductFamilyName('DATA','REC - SR/ESS-1 RED AC PWR SHELF','3HE0012AA');
    _createProductWithProductFamilyName('DATA','KIT, SHIP, OS7/OS9-IP-SHELF, KIT B','420113-10');
    _createProductWithProductFamilyName('DATA','KIT, SHIP, OS7/OS9-IP-SHELF, KIT B','420114-10');
    _createProductWithProductFamilyName('DATA','RLII-AMERICA 1692MSE R3.4 FLASH CARD','8DG22852AE');
    _createProductWithProductFamilyName('DATA','PS-360I160AC-P','902640-90');
    _createProductWithProductFamilyName('DATA','Viking Power Fail Switch','PF-6A');
    _createProductWithProductFamilyName('DATA','OAW-6000 2XGE Line Card','3EM17860BT');
    _createProductWithProductFamilyName('DATA','OS6850 360W Power Supply','OS6850-BP-P');
    _createProductWithProductFamilyName('DATA','SFP-GIG-SX','SFP-GIG-SX');
    _createProductWithProductFamilyName('DATA','OS6850-24 - Chassis','OS6850-24');
    _createProductWithProductFamilyName('DATA','SFP-GIG-T','SFP-GIG-T');
    _createProductWithProductFamilyName('DATA','SFP-GIG-LX','SFP-GIG-LX');
    _createProductWithProductFamilyName('DATA','OS6850-P48 - Chassis','OS6850-P48');
    _createProductWithProductFamilyName('DATA','OS6850-P48L - Chassis','OS6850-P48L');
    _createProductWithProductFamilyName('DATA','XFP-10G-LR','XFP-10G-LR');
    _createProductWithProductFamilyName('DATA','OS6850-U24X - Chassis','OS6850-U24X');
    _createProductWithProductFamilyName('DATA','OS6855-14 Chassis','OS6855-14');
    _createProductWithProductFamilyName('DATA','OS6855-24 Chassis','OS6855-24');
    _createProductWithProductFamilyName('DATA','OS9600/OS9700-CFM','OS9600/OS9700-CFM');
    _createProductWithProductFamilyName('DATA','OS9700/OS7700 - Chassis','OS9700/OS7700');
    _createProductWithProductFamilyName('DATA','OS9 Power Supply','OS-PS-0600AC');
    _createProductWithProductFamilyName('DATA','XFP-10G-SR','XFP-10G-SR');
    _createProductWithProductFamilyName('DATA','OS9800-CFM','OS9800-CFM');
    _createProductWithProductFamilyName('DATA','OS9800/OS7800 - Chassis','OS9800/OS7800');
    _createProductWithProductFamilyName('DATA','OS9 POE 600W Power Supply','OS-IPS-600A');
    _createProductWithProductFamilyName('DATA','OS9-GNI-P24','OS9-GNI-P24');
    _createProductWithProductFamilyName('DATA','OS9-GNI-U24','OS9-GNI-U24');
    _createProductWithProductFamilyName('DATA','OS9-GNI-C24','OS9-GNI-C24');
    _createProductWithProductFamilyName('DATA','OS6850-P24L - Chassis','OS6850-P24L');
    _createProductWithProductFamilyName('DATA','OS9-XNI-U2','OS9-XNI-U2');
    _createProductWithProductFamilyName('DATA','OS9-XNI-U6','OS9-XNI-U6');
    _createProductWithProductFamilyName('DATA','OS6850-24L - Chassis','OS6850-24L');
    _createProductWithProductFamilyName('DATA','OS6850-P48X - Chassis','OS6850-P48X');
    _createProductWithProductFamilyName('DATA','OS6850 126W Power Supply','OS6850-BP');
    _createProductWithProductFamilyName('DATA','OS9-IP-SHELF','OS9-IP-SHELF');
    _createProductWithProductFamilyName('DATA','SFP-GIG-LH','SFP-GIG-LH');
    _createProductWithProductFamilyName('DATA','OS6850-48X  - Chassis','OS6850-48X');
    _createProductWithProductFamilyName('DATA','OS6850-48L - Chassis','OS6850-48L');
    _createProductWithProductFamilyName('DATA','OS6850-48 - Chassis','OS6850-48');
    _createProductWithProductFamilyName('DATA','OAW-SC2 (256 AP) Controller - Chassis','OAW-SC2');
    _createProductWithProductFamilyName('DATA','OAW-SC1 (256 AP) Controller - Chassis','OAW-SC1');
    _createProductWithProductFamilyName('DATA','OAW-SC3 (512 AP) Controller - Chassis','OAW-SC3');
    _createProductWithProductFamilyName('DATA','OAW-4324 (48 AP) Controller - Chassis','OAW-4324');
    _createProductWithProductFamilyName('DATA','OAW-4308 (16 AP) Controller - Chassis','OAW-4308');
    _createProductWithProductFamilyName('DATA','OAW-4302 (6 AP) Controller - Chassis','OAW-4302');
    _createProductWithProductFamilyName('DATA','Server - Chassis','Server');
    _createProductWithProductFamilyName('DATA','OS9-GNI-C20L','OS9-GNI-C20L');
    _createProductWithProductFamilyName('DATA','PS-360W-AC','902429-90');
    _createProductWithProductFamilyName('DATA','OS6850E-P48 - Chassis','OS6850E-P48');
    _createProductWithProductFamilyName('DATA','OS6850E-P48X - Chassis','OS6850E-P48X');
    _createProductWithProductFamilyName('DATA','OS6850E-U24X - Chassis','OS6850E-U24X');
    _createProductWithProductFamilyName('DATA','OS-PS-0725AC','OS-PS-0725AC');
    _createProductWithProductFamilyName('DATA','OS6850E-P24 Chassis','OS6850E-P24');
    _createProductWithProductFamilyName('DATA','OAW-6000 Controller - Chassis','OAW-6000');
    _createProductWithProductFamilyName('DATA','OAW-4504 - Chassis','OAW-4504');
    _createProductWithProductFamilyName('DATA','OAW-4604 - Chassis','OAW-4604');
    _createProductWithProductFamilyName('DATA','OAW-4704 - Chassis','OAW-4704');
    _createProductWithProductFamilyName('OTHER','IBM HD','43W760');
    _createProductWithProductFamilyName('IPD','7750 12 slot DC Shelf AC Power Shelf','3HE00007AA');
    _createProductWithProductFamilyName('IPD','7750 SR 12 slot Shelf AC Power Supply for AC Power Shelf','3HE00008AA');
    _createProductWithProductFamilyName('IPD','7750 SR1 slot Redundant AC Power Supply for 7750 SR 1 slot Redundant AC Power Shelf','3HE00013AA');
    _createProductWithProductFamilyName('IPD','1-port 1000BASE-SX Small Form-Factor Pluggable (SFP) Optics Module, 850 nm, LC Connector','3HE00027AA');
    _createProductWithProductFamilyName('IPD','1-port 1000BASE-LX Small Form-Factor Pluggable (SFP) Optics Module, 1310 nm, 10 km, LC Connector','3HE00028AA');
    _createProductWithProductFamilyName('IPD','1-port 1000BASE-ZX Small Form-Factor Pluggable (SFP) Optics Module, 1550 nm, 70 km, LC Connector','3HE00029AA');
    _createProductWithProductFamilyName('IPD','7750-SR1 - Chassis','3HE00061AC');
    _createProductWithProductFamilyName('IPD','1-port 1000BASE-TX Small Form-Factor Pluggable (SFP) Copper Module, Cat5, RJ45 Connector','3HE00062AA');
    _createProductWithProductFamilyName('IPD','1-port 1000BASE CWDM (120 km) Small Form-Factor Pluggable (SFP) Optics Module, 1530 nm, LC Connector','3HE00070BD');
    _createProductWithProductFamilyName('IPD','1-port 1000BASE CWDM (120 km) Small Form-Factor Pluggable (SFP) Optics Module, 1550 nm, LC Connector','3HE00070BE');
    _createProductWithProductFamilyName('IPD','1-port 1000BASE CWDM (120 km) Small Form-Factor Pluggable (SFP) Optics Module, 1570 nm, LC Connector','3HE00070BF');
    _createProductWithProductFamilyName('IPD','7750 SR 12 - Chassis - Bundle DC INTEGRATED SHELF, INCLUDES: 3HE00009AA (2), 3HE00016AA (3), 3HE00104AA (1), 3HE00192AA (1)','3HE00183AA');
    _createProductWithProductFamilyName('IPD','7750-SR7 - Chassis','3HE00186AA');
    _createProductWithProductFamilyName('IPD','7750 SR 7 slot AC Line Power Supply Unit (PSU)','3HE00187AA');
    _createProductWithProductFamilyName('IPD','7750 SR 7 slot AC PEM, AC Power Entry Module for Slot 1 or Slot 2','3HE00195AA');
    _createProductWithProductFamilyName('IPD','SAM Release 4.0','3HE00205DA');
    _createProductWithProductFamilyName('IPD','2 x 10-Gig MDA IOM Card, B - 7450','3HE00229AB');
    _createProductWithProductFamilyName('IPD','7450 ESS Operating Software for ESS-7 - Release 5.0','3HE00241EA');
    _createProductWithProductFamilyName('IPD','7750 SR AC Power Cable 110V for SR-1, SR-4 - United States / Canada / South America','3HE00271AA');
    _createProductWithProductFamilyName('IPD','7750 SR AC Power Cable 110V for External SR-1 Redundant AC - United States / Canada / South America','3HE00271AF');
    _createProductWithProductFamilyName('IPD','7450 ESS 2-port 10GBASE Ethernet MDA. Accepts up to two (2) XFP 10GigE Optics Modules','3HE00317AA');
    _createProductWithProductFamilyName('IPD','1-port 10GBASE-LW/LR Small Form-Factor Pluggable (XFP) Optics Module, 1310 nm, 10 km, LC Connector','3HE00564AA');
    _createProductWithProductFamilyName('IPD','1-port 10GBASE-SW/SR Small Form-Factor Pluggable (XFP) Optics Module, 850 nm, LC Connector','3HE00566AA');
    _createProductWithProductFamilyName('IPD','7750 1 x 10-Gig Ethernet XFP','3HE00714AA');
    _createProductWithProductFamilyName('IPD','200g CPM / Switch Fabric 2 - 7750','3HE01171AA');
    _createProductWithProductFamilyName('IPD','VSM Cross Connect Adaptor - 7750','3HE01197AA');
    _createProductWithProductFamilyName('IPD','2 x 10-Gig MDA IOM 2 - 7750','3HE01473AA');
    _createProductWithProductFamilyName('IPD','7450 10 x 10/100/1000 Ethernet SFP','3HE01532AA');
    _createProductWithProductFamilyName('IPD','5 x 10/100/1000 Ethernet SFP','3HE01615AA');
    _createProductWithProductFamilyName('IPD','7750 10 x 10/100/1000 Ethernet SFP','3HE01616AA');
    _createProductWithProductFamilyName('IPD','1 x 10-Gig Ethernet XFP - 7450','3HE01617AA');
    _createProductWithProductFamilyName('IPD','400g CPM / Switch Fabric 2 - 7450','3HE02032AA');
    _createProductWithProductFamilyName('IPD','7450-ESS12 - Chassis','3HE02036AA');
    _createProductWithProductFamilyName('IPD','7450 ESS 12 slot Cable Management','3HE02037AA');
    _createProductWithProductFamilyName('IPD','7450 ESS 12 slot Shelf DC Power Entry Module (PEM) for Alcatel 7450 ESS 12 slot DC Shelf','3HE02058AA');
    _createProductWithProductFamilyName('IPD','4-Port Channelized DS3/E3 (DS0) Any Service Any Port (ASAP) MDA','3HE02501AA');
    _createProductWithProductFamilyName('IPD','SR/ESS 2500 Watt AC Power Supply for the SR/ESS AC Split Power Shelf','3HE02787AA');
    _createProductWithProductFamilyName('IPD','SR/ESS AC Power Cable 220V for SR/ESS 2500 Watt AC Power Supply for the SR/ESS AC Split Power Shelf','3HE02946AA');
    _createProductWithProductFamilyName('IPD','7750 SR  20-port 1000BASE Ethernet MDA-XP. Accepts up to twenty (20) SFP GigE-xx operation supported with GigE TX SFP','3HE03612AA');
    _createProductWithProductFamilyName('IPD','20 x 10/100/1000 Ethernet Extended Performance SFP - 7450','3HE03615AA');
    _createProductWithProductFamilyName('IPD','2 x XP MDA IOM 3 - 7750','3HE03619AA');
    _createProductWithProductFamilyName('IPD','2 x XP MDA IOM 3 - 7450','3HE03620AA');
    _createProductWithProductFamilyName('IPD','2 x 10Gig Extended Performance XFP - 7750','3HE03685AA');
    _createProductWithProductFamilyName('IPD','4 x 10Gig Extended Performance XFP - 7750','3HE03686AA');
    _createProductWithProductFamilyName('IPD','4 x 10Gig Extended Performance XFP - 7450','3HE03688AA');
    _createProductWithProductFamilyName('IPD','SR/ESS 6/6V/7 VAL AC Power Shelf','3HE02786BA');
    _createProductWithProductFamilyName('IPD','7750-SR12 - Chassis','3HE00104AA');
    _createProductWithProductFamilyName('IPD','7710-SRc12 - Chassis','3HE01111AA');
    _createProductWithProductFamilyName('IPD','7450-ESS7 - Chassis','3HE00245AA');
    _createProductWithProductFamilyName('IPD','7710-SRc4 - Chassis','3HE02178AA');
    _createProductWithProductFamilyName('IPD','7710 1 x Gig Ethernet SFP CMA','3HE01023AA');
    _createProductWithProductFamilyName('IPD','2 x 10-Gig MDA IOM Card, B - 7750','3HE00020AB');
    _createProductWithProductFamilyName('IPD','7750 20 x 10/100/1000 Ethernet SFP','3HE00708AA');
    _createProductWithProductFamilyName('IPD','200g CPM / Switch Fabric 2 - 7450','3HE01172AA');
    _createProductWithProductFamilyName('IPD','77x0 4 x DS3/E3 CMA','3HE01021AA');
    _createProductWithProductFamilyName('IPD','7710 SR C12 12G CFM','3HE01014AA');
    _createProductWithProductFamilyName('IPD','7710 SR C4 9G CFM','3HE02175AA');
    _createProductWithProductFamilyName('IPD','7710 8 x 10/100 Ethernet Tx CMA','3HE01022AA');
    _createProductWithProductFamilyName('IPD','77x0 8 x DS1/E1 Channel CMA','3HE01020AA');
    _createProductWithProductFamilyName('IPD','MCM-v1 -7710','3HE01024AA');
    _createProductWithProductFamilyName('IPD','7710 SR C12  CCM-v1','3HE01019AA');
    _createProductWithProductFamilyName('IPD','7710 SR C4 CCM-v1','3HE02181AA');
    _createProductWithProductFamilyName('IPD','ISA Ipsec','3HE03080AA');
    _createProductWithProductFamilyName('IPD','10GBASE-ER 10GBASE-SW 10GBASE-LW 10GBASE-EW ','3HE00566CA');
    _createProductWithProductFamilyName('IPD','GIGE-LX ','3HE00070BH');
    _createProductWithProductFamilyName('IPD','GIGE-LX ','3HE00070BB');
    _createProductWithProductFamilyName('IPD','GIGE-LX ','3HE00070BG');
    _createProductWithProductFamilyName('IPD','GIGE-LX ','3HE00070BC');
    _createProductWithProductFamilyName('IPD','GIGE-LX ','3HE00028CA');
    _createProductWithProductFamilyName('IPD','GIGE-LX ','3HE00070AB');
    _createProductWithProductFamilyName('IPD','GIGE-LX ','3HE00070AC');
    _createProductWithProductFamilyName('IPD','GIGE-LX ','3HE00070BA');
    _createProductWithProductFamilyName('IPD','GIGE-LX ','3HE00867AA');
    _createProductWithProductFamilyName('IPD','7750 SRc12 - Chassis','3HE01111BA');
    _createProductWithProductFamilyName('IPD','CCM-XP - 7750 SR-C12','3HE04580AA');
    _createProductWithProductFamilyName('IPD','CFM-XP - 7750 SR-C12','3HE03607AA');
    _createProductWithProductFamilyName('IPD','7750 SR-C12 - Chassis','3HE01016BA');
    _createProductWithProductFamilyName('IPD','MCM-XP - 7750 SR-C12','3HE03608AA');
    _createProductWithProductFamilyName('IPD','C12 AC PEM-3 - 7750 SR-C12','3HE03658AA');
    _createProductWithProductFamilyName('IPD','7710 SR C12 12G - Chassis','3HE01016AA');
    _createProductWithProductFamilyName('IPD','7710 SR C12 AC PEM','3HE01018AA');
    _createProductWithProductFamilyName('IPD','7710 SR C4 Chassis/FAN','3HE02177AA');
    _createProductWithProductFamilyName('IPD','7710 SR C4 AC PEM','3HE02180AA');
    _createProductWithProductFamilyName('IPD','1GB Compact Flash','3HE01618AA');
    _createProductWithProductFamilyName('IPD','7210 SAS-X-24F-2XFP - Chassis','3HE05170AA');
    _createProductWithProductFamilyName('IPD','ISA IPsec','3HE04922AA');
    _createProductWithProductFamilyName('IPD','500g CPM / Switch Fabric 3','3HE03617AA');
    _createProductWithProductFamilyName('IPD','48-Port GIGE SFP IMM','3HE03624AA');
    _createProductWithProductFamilyName('IPD','7210 SAS-X-Power Supply','3HE05172AA');
    _createProductWithProductFamilyName('IPD','7750 SR 20G Input Output Module','109743625');
    _createProductWithProductFamilyName('IPD','FLT - 7x50 ESS-6V/12 SR-12 Air Filter','3HE00014AA');
    _createProductWithProductFamilyName('IPD','FLT - 7x50 SR/ESS-7 Air Filter','3HE00190AA');
    _createProductWithProductFamilyName('IPD','FLT - 7710 SR 12 CMA Shelf Air Filter','3HE01112AA');
    _createProductWithProductFamilyName('IPD','FLT - 7710 SR C4 Shelf Air Filter','3HE02183AA');
    _createProductWithProductFamilyName('IPD','7750 SR-C4 Chassis','3HE04973AA');
    _createProductWithProductFamilyName('IPD','250g CPM / Switch Fabric 3','3HE04164AA');
    _createProductWithProductFamilyName('IPD','48-Port GIGE SFP IMM','3HE06428AA');
    _createProductWithProductFamilyName('IPD','7705-SARF','3HE02777AA');
    _createProductWithProductFamilyName('IPD','1 Tb CPM / Switch Fabric 4','3HE05949AA');
    _createProductWithProductFamilyName('IPD','48-Port GIGE SFP IMM, B','3HE06326AA');
    _createProductWithProductFamilyName('OND','CWDM 1610NM APD SFP DDM','1AB196350033');
    _createProductWithProductFamilyName('OND','1354RM-PhM R5.x Basic Management License','3AL88973AA');
    _createProductWithProductFamilyName('OND','1354RM-PhM R5.x Basic Management Expansion License','3AL88974AA');
    _createProductWithProductFamilyName('OND','RECONFIG OADM CARD 42CHAN (WSS)','8DG39262AA');
    _createProductWithProductFamilyName('OND','BROAD BAND ROADM - 42CH ROADM CA','8DG39263AA');
    _createProductWithProductFamilyName('OND','SSY-1696 MS ROADM SHELF - Chassis','8DG39265AA');
    _createProductWithProductFamilyName('OND','SSY-CMD42 - 42CH MUX/DEMUX CARD','8DG39266AA');
    _createProductWithProductFamilyName('OND','10GE LAN PHY WTE XFP CARD - TUNA','8DG39268AA');
    _createProductWithProductFamilyName('OND','1 x Multi-Rate 2.5G WT Card - Tunable','8DG39271AA');
    _createProductWithProductFamilyName('OND','1696 MS ROADM Link Planning Tool R5.x License','8DG39305AA');
    _createProductWithProductFamilyName('OND','Link Planning Tool Support Maintenance per Year','8DG39306AA');
    _createProductWithProductFamilyName('OND','FAN TRAY','8DG39307AA');
    _createProductWithProductFamilyName('OND','AIR INTAKE TRAY   (Spare)','8DG39311AA');
    _createProductWithProductFamilyName('OND','Optical Service Channel Card (OSC)','8DG39318AA');
    _createProductWithProductFamilyName('OND','BBA HG, HIGH GAIN AMP','8DG39320AA');
    _createProductWithProductFamilyName('OND','SSY-GIG E SX TRANSCEIVER','8DG39326AA');
    _createProductWithProductFamilyName('OND','SSY-GIG E LX TRANSCEIVER','8DG39327AA');
    _createProductWithProductFamilyName('OND','SSY-OC48 1310NM SR TRANSPONDER','8DG39334AA');
    _createProductWithProductFamilyName('OND','EMA-25 Amp Breaker Assembly','8DG39338AA');
    _createProductWithProductFamilyName('OND','SSY-CONTROL CARD','8DG39339AA');
    _createProductWithProductFamilyName('OND','OPTO TRX SFP L-1.1 DDM EXTEMP','1AB194670005');
    _createProductWithProductFamilyName('OND','JUMPER SFM MU/UPC-LC/UPC 390MM','1AB195530001');
    _createProductWithProductFamilyName('OND','JUMPER SFM MU/UPC-LC/PC 320MM','1AB195530002');
    _createProductWithProductFamilyName('OND','CWDM 1470NM APD SFP DDM','1AB196350026');
    _createProductWithProductFamilyName('OND','CWDM 1490NM APD SFP DDM','1AB196350027');
    _createProductWithProductFamilyName('OND','CWDM 1510NM APD SFP DD M','1AB196350028');
    _createProductWithProductFamilyName('OND','CWDM 1530NM APD SFP DDM','1AB196350029');
    _createProductWithProductFamilyName('OND','CWDM 1590NM APD SFP DDM','1AB196350032');
    _createProductWithProductFamilyName('OND','LAC (LAN ACCESS CARD)','3AL86653AA');
    _createProductWithProductFamilyName('OND','Housekeeping - CWDM','3AL86668AA');
    _createProductWithProductFamilyName('OND','HK USER CABLE','3AL86751AA');
    _createProductWithProductFamilyName('OND','PSC_C','3AL86888AA');
    _createProductWithProductFamilyName('OND','ALARM CARD','3AL87009AA');
    _createProductWithProductFamilyName('OND','OSC (OPTICAL SUPERVISORY CHANNEL)','3AL97540AA');
    _createProductWithProductFamilyName('OND','1692/1696 MetroSpan Compact - Chassis','3AL97679AA');
    _createProductWithProductFamilyName('OND','COMPACT FAN','3AL97682AA');
    _createProductWithProductFamilyName('OND','LOW COST ESC','3AL97690AA');
    _createProductWithProductFamilyName('OND','2F 8CH MDX2E W/ 1310 FILTER','3AL97772AA');
    _createProductWithProductFamilyName('OND','WLA3C','3AL97795AA');
    _createProductWithProductFamilyName('OND','COMPACT DUST FILTER','3AN51151AA');
    _createProductWithProductFamilyName('OND','10 X GIGE MUX WT CARD','8DG39283AA');
    _createProductWithProductFamilyName('OND','2 x GigE Mux WT Card - Tunable','8DG39267AA');
    _createProductWithProductFamilyName('OND','Air Filters FRU','8DG39309AA');
};
exports.createDefaultProducts = _createDefaultProducts;



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

