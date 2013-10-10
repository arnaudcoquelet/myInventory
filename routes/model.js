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
    position: { type: Sequelize.STRING, defaultValue: "", allowNull: false}
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

});

var ProductFamily = sequelize.define('productfamily', {
    name: { type: Sequelize.STRING, allowNull: false}
});

var Product = sequelize.define('product', {
    name: { type: Sequelize.STRING, allowNull: false},
    part: { type: Sequelize.STRING, defaultValue: "unknown", allowNull: false}
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
    code: { type: Sequelize.STRING, allowNull: false},
    address1: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    address2: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    city: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    state: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    zipcode: { type: Sequelize.STRING, defaultValue: "", allowNull: true},
    canbedeleted: { type: Sequelize.BOOLEAN, defaultValue: true, allowNull: false},
    category: { type: Sequelize.STRING, defaultValue: "", allowNull: true}
});

var Geolocation = sequelize.define('geolocation', {
    name: { type: Sequelize.STRING, allowNull: false},
    code: { type: Sequelize.STRING, allowNull: false}
});

//Association
Geolocation.hasMany(Sites, {as: 'Sites'});
Site.hasMany(User, {as: 'Contacts'});
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
Site.hasMany(Geolocation);
Product.hasMany(Device);

sequelize
    .sync({force:true})
    .on('success', function() {console.log("Model Create in DB");
        _createUnassignedSite();
        _createDefaultProductFamily();
        _createAdminUser();
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
// SITE
//****************************************//
var _findSiteAllDetails = function(next){
    Site.findAll({include: [{ model: Building, as: 'Buildings' }] }).success(function(sites) {
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

var _findDeviceAllDetails = function(){
    var sql = "SELECT * from device_fulldetails";


};



//****************************************//
// Product Family
//****************************************//
var _findProductFamilyAll = function(next){
    ProductFamily.findAll().success(function(productfamilies) {
        var tmpProductFamilies = [];
        if (! productfamilies instanceof Array){
            tmpProductFamilies.push(productfamilies);
        }
        else{
            tmpProductFamilies = productfamilies;
        }

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

var _createProductFamily = function (name, next) {
    var chainer = new Sequelize.Utils.QueryChainer
    , productfamily  = ProductFamily.build({ name: name });

    chainer
        .add(productfamily.save())

    chainer.run()
        .on('success', function() {

            var chainerAssociations = new Sequelize.Utils.QueryChainer
            chainerAssociations
                .run()
                .on('success', function() { if(next) next(null, productfamily); })
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
exports.createProductFamily = _createProductFamily;

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
    Product.findAll().success(function(productfamilies) {
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

var _createProduct = function (name, next) {
    var chainer = new Sequelize.Utils.QueryChainer
    , product  = Product.build({ name: name });

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

var _createProductWithProductFamilyId = function (productfamilyId, name, next) {
    _createProduct(name, function(err, product){
        if(product){
            //Get Product family from SiteCode
            _findProductFamilyById(productfamilyId, function(err, productfamily){
                //Link Product to Product family
                productfamilyId.addProduct(product)
                    .on('success', function(){
                        if(next) next(null, product);
                    })
                    .on('failure', function(product){
                        if(next) next(error, false);
                    });
            });
        }
    });
};
exports.createProductWithProductFamilyId = _createProductWithProductFamilyId;