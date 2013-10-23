/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;
    var closetid = req.params.closetid;

    if(model){
        model.findSiteGroupById(sitegroupid, function(err, sitegroup){
            if(err){res.redirect('/sitegroup');}
            if(!sitegroup){res.redirect('/sitegroup');}

            model.findSiteById(siteid, function(err, site){
                if(err){res.redirect('/sitegroup/' + sitegroup.id + '/site');}
                if(!site){res.redirect('/sitegroup/' + sitegroup.id + '/site');}

                model.findBuildingById(buildingid, function(err, building){
                    if(err){res.redirect('/sitegroup/' + sitegroup.id + '/site/' + siteid + '/building');}
                    if(!building){res.redirect('/sitegroup/' + sitegroup.id + '/site/' + siteid + '/building');}

                    model.findFloorById(floorid, function(err,floor){
                        if(err){res.redirect('/sitegroup/' + sitegroup.id + '/site/' + siteid + '/building/' + buildingid);}
                        if(!floor){res.redirect('/sitegroup/' + sitegroup.id + '/site/' + siteid + '/building/' + buildingid);}

                        model.findClosetById(closetid, function(err, closet){
                            var breadcrumbs = [
                                {name: 'SiteGroup'    , url: '/sitegroup', class: ''},
                                {name: sitegroup.name , url: '/sitegroup/' + sitegroup.id, class: ''},
                                {name: site.name        , url: '/sitegroup/' + sitegroup.id + '/site/' + site.id, class: ''},
                                {name: building.name    , url: '/sitegroup/' + sitegroup.id + '/site/' + site.id + '/building/' + building.id, class: ''},
                                {name: floor.name       , url: '/sitegroup/' + sitegroup.id + '/site/' + site.id + '/building/' + building.id + '/closet/' + closet.id, class: ''},
                                {name: closet.name      , url: '', class: 'active'}
                            ];

                            res.render('deviceList',
                                {
                                    title: 'MyInventory',
                                    sitegroup: sitegroup,
                                    site: site,
                                    building: building,
                                    floor: floor,
                                    closet: closet,
                                    breadcrumbs: breadcrumbs
                                });
                        });
                    });
                })
            });
        });
    }
    else {res.redirect('/sitegroup'); }
};

exports.list_json = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;
    var closetid = req.params.closetid;

    if (model) {
        model.findDeviceAllByClosetId(closetid, function (err, devices) {
            if (err) {res.json([]);}
            res.json(devices);
        })
    }
    else {
        res.json([]);
    }
};

exports.create = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;
    var closetid = req.params.closetid;

    var name = req.body.name;
    var serial = req.body.serial;
    var productid = req.body.field_productId;
    var closetid2 = req.body.field_closetId;
    var error = '';
    res.method = 'get';

    if (!name || name === '') { error = 'Missing the Device name'; }
    if (!serial || serial === '') { error = 'Missing the Serial #'; }

    if(model){
        console.log('productid', productid);
        console.log('closetid2', closetid2);

        model.createDeviceWithClosetId(closetid2,productid,{name: name, serial: serial}, function (err, device) {
            res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid + '/closet/' + closetid );
        });
    }
    else { res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid + '/closet/' + closetid);}
};

exports.update = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;
    var closetid = req.params.closetid;

    var id   = req.body.id;
    var name = req.body.name;
    var serial = req.body.serial;
    var error = '';
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the Device Id'; }
    if (!name || name === '') { error = 'Missing the Device Name'; }
    if (!serial || serial === '') { error = 'Missing the Serial #'; }

    if(model){
        model.updateDeviceById(id, {name: name, serial: serial}, function (err, device) {
            res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid + '/closet/' + closetid);
        });
    }
    else { res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid + '/closet/' + closetid);}
};

exports.delete = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;
    var closetid = req.params.closetid;

    var id = req.body.id;
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the Closet Id'; }
    if(id && model){
        model.deleteDeviceById(id, function(err, device){
            res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid + '/closet/' + closetid);
        })
    }
    else {
        res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid + '/building/' + buildingid + '/floor/' + floorid + '/closet/' + closetid);
    }
};


exports.listAll = function (req, res, model) {
    if(model){
        var breadcrumbs = [{name: 'Devices'    , url: '', class: 'active'}];
        res.render('deviceListAll',
            {
                title: 'MyInventory',
                breadcrumbs: breadcrumbs
            });
    }
    else {res.redirect('/'); }
};

exports.listAll_json = function (req, res, model) {
    if(model){
        model.findDeviceAllDetails(function(err, devices){
            if(err){res.json([]);}
            if(!devices){res.json([]);}

            res.json(devices);
        });
    }
    else {res.json([]); }
};

exports.listAllSiteGroup_json = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;

    if(model){
        model.findDeviceAllSiteGroupDetails(sitegroupid, function(err, devices){
            if(err){res.json([]);}
            if(!devices){res.json([]);}

            res.json(devices);
        });
    }
    else {res.json([]); }
};

exports.listAllSite_json = function (req, res, model) {
    var siteid = req.params.siteid;

    if(model){
        model.findDeviceAllSiteDetails(siteid,function(err, devices){
            if(err){res.json([]);}
            if(!devices){res.json([]);}

            res.json(devices);
        });
    }
    else {res.json([]); }
};

exports.listAllBuilding_json = function (req, res, model) {
    var buildingid = req.params.buildingid;
    if(model){
        model.findDeviceAllBuildingDetails(buildingid,function(err, devices){
            if(err){res.json([]);}
            if(!devices){res.json([]);}

            res.json(devices);
        });
    }
    else {res.json([]); }
};

exports.listAllFloor_json = function (req, res, model) {
    var floorid = req.params.floorid;

    if(model){
        model.findDeviceAllFloorDetails(floorid,function(err, devices){
            if(err){res.json([]);}
            if(!devices){res.json([]);}

            res.json(devices);
        });
    }
    else {res.json([]); }
};