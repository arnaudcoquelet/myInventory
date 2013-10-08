/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
var Sequelize = require('sequelize');
var sequelize = new Sequelize('inventory', 'inventory', 'inventory', {
    //host: "localhost",
    host: "10.118.204.106",
    port: 3306,
    dialect: 'mysql'
});

var User = sequelize.define('user', {
    name: { type: Sequelize.STRING, allowNull: false},
    username: { type: Sequelize.STRING, allowNull: false},
    password: { type: Sequelize.STRING, allowNull: false},
    role: { type: Sequelize.STRING, defaultValue: "read"},
    email: { type: Sequelize.STRING, allowNull: false},
    telephone: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    address1: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    address2: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    city: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    state: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    zipcode: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    position: { type: Sequelize.STRING, defaultValue: "", allowNull: true}
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


var Device = sequelize.define('device', {
    name: { type: Sequelize.STRING, allowNull: false},
    type: { type: Sequelize.STRING, defaultValue: "unknown", allowNull: false}
});

var Closet = sequelize.define('closet', {
    name: { type: Sequelize.STRING, allowNull: false},
    spare: { type: Sequelize.BOOLEAN, defaultValue: false, allowNull: false},
    canbedeleted: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false}
});

var Floor = sequelize.define('floor', {
    name: { type: Sequelize.STRING, allowNull: false},
    canbedeleted: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false}
});


var Building = sequelize.define('building', {
    name: { type: Sequelize.STRING, allowNull: false},
    canbedeleted: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false}
});

var Site = sequelize.define('site', {
    name: { type: Sequelize.STRING, allowNull: false},
    code: { type: Sequelize.STRING, allowNull: false, unique: true},
    address1: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    address2: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    city: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    state: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    zipcode: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    canbedeleted: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false}
});


//Association
Site.hasMany(User, {as: 'Contacts'});
Site.hasMany(Building, {as: 'Buildings'});
Building.hasMany(Floor, {as: 'Floors'});
Floor.hasMany(Closet, {as: 'Closets'});
Closet.hasMany(Device, {as: 'Devices'});

Device.hasMany(Closet);
Closet.hasMany(Floor);
Floor.hasMany(Building);
Building.hasMany(Site);

Device.hasMany(Device, {as:'SubDevices'});

sequelize
    .sync({force:false})
    .on('success', function() {console.log("Model Create in DB");
        //_createUnassignedSite();
    })
    .on('failure', function(err) {console.log(err); });

exports.sequelize = sequelize;
exports.User = User;
exports.Site = Site;
exports.Building = Building;
exports.Floor = Floor;
exports.Closet = Closet;
exports.Device = Device;



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



//****************************************//
// SITE
//****************************************//
var _findSiteAll = function(next){
    Site.findAll().success(function(sites) {
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

var _findSiteByCode = function(code,next){
    Site
        .find({where: {code: code}})
        .success(function(site) {
            if (!site){ next("site not found", false); }

            if(next) return next(null, site);
        })
};
exports.findSiteByCode = _findSiteByCode;

var _createSite = function (name,code,address1,address2,city,state,zipcode, next) {
    var chainer = new Sequelize.Utils.QueryChainer
        , site = Site.build({name: name, code: code,address1:address1,address2:address2,city:city,state:state,zipcode:zipcode})
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
    Building.findAll().success(function(buildings) {
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
    Floor.findAll().success(function(floors) {
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
    Closet.findAll().success(function(closets) {
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
    Device.findAll().success(function(devices) {
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
