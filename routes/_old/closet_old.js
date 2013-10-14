/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function (req, res, model) {
    var sitecode = req.params.sitecode;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;

    var breadcrumbs = [
        {name: 'Sites', url: '/sites', class: ''}
    ];

    if (sitecode && buildingid && floorid && model) {
        model.findSiteByCode(sitecode, function (err, site) {
            if (err) {
                res.redirect("/sites/" + sitecode);
            }
            if (site) {
                model.findBuildingById(buildingid, function (err, building) {
                    if (err) {
                        res.redirect("/sites/" + sitecode + "/building/" + buildingid);
                    }
                    if (building) {
                        model.findFloorById(floorid, function (err, floor) {
                            if (err) {
                                res.redirect("/sites/" + sitecode + "/building/" + buildingid);
                            }

                            if (floor) {
                                floor.getClosets()
                                    .on('success', function (closets) {
                                        breadcrumbs = [
                                            {name: 'Sites', url: '/sites', class: ''},
                                            {name: site.code, url: '/sites/' + site.code, class: ''},
                                            {name: building.name, url: '/sites/' + site.code + '/building/' + building.id, class: ''},
                                            {name: floor.name, url: '', class: 'active'}
                                        ];

                                        res.render('closetList', { title: 'MyInventory',
                                            site: site,
                                            building: building,
                                            floor: floor,
                                            closets: closets,
                                            breadcrumbs: breadcrumbs });
                                    });
                            }
                        });
                    }
                });
            }
        })
    }
    else {
        res.redirect("/Sites");
    }
};

exports.list_json = function (req, res, model) {
    var sitecode = req.params.sitecode;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;

    if (sitecode && buildingid && floorid && model) {
        model.findSiteByCode(sitecode, function (err, site) {
            if (err) {res.json([]);}
            if (site) {
                model.findBuildingById(buildingid, function (err, building) {
                    if (err) {res.json([]);}
                    if (building) {
                        model.findFloorById(floorid, function (err, floor) {
                            if (err) {res.json([]);}

                            if (floor) {
                                floor.getClosets()
                                    .on('success', function (closets) {
                                        res.json(closets);
                                    });
                            }
                        });
                    }
                });
            }
        })
    }
    else {
        res.json([]);
    }
};

exports.details = function (req, res, model) {
    var sitecode = req.params.sitecode;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;
    var closetid = req.params.closetid;

    var breadcrumbs = [
        {name: 'Sites', url: '/sites', class: ''}
    ];

    if (sitecode && buildingid && floorid && model) {
        model.findSiteByCode(sitecode, function (err, site) {
            if (err) {
                res.redirect("/sites/" + sitecode);
            }
            if (site) {
                model.findBuildingById(buildingid, function (err, building) {
                    if (err) {
                        res.redirect("/sites/" + sitecode + "/building/" + buildingid);
                    }
                    if (building) {
                        model.findFloorById(floorid, function (err, floor) {
                            if (err) {
                                res.redirect("/sites/" + sitecode + "/building/" + buildingid);
                            }

                            if (floor) {
                                model.findClosetById(closetid, function (err, closet) {
                                    if (err) {
                                        res.redirect("/sites/" + sitecode + "/building/" + buildingid + '/floor/' + floorid);
                                    }

                                    if(closet){
                                        closet.getDevices()
                                            .on('success', function (devices) {
                                                                                    breadcrumbs = [
                                                                                        {name: 'Sites', url: '/sites', class: ''},
                                                                                        {name: site.code, url: '/sites/' + site.code, class: ''},
                                                                                        {name: building.name, url: '/sites/' + site.code + '/building/' + building.id, class: ''},
                                                                                        {name: floor.name, url: '/sites/' + site.code + '/building/' + building.id + '/floor/' + floor.id, class: ''},
                                                                                        {name: closet.name, url: '', class: 'active'}
                                                                                    ];

                                                                                    res.render('closetDetails', { title: 'MyInventory',
                                                                                        site: site,
                                                                                        building: building,
                                                                                        floor: floor,
                                                                                        closet: closet,
                                                                                        devices: devices,
                                                                                        breadcrumbs: breadcrumbs });
                                                                                });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        })
    }
    else {
        res.redirect("/Sites");
    }
};

exports.create = function (req, res, model) {
    var sitecode = req.params.sitecode,
        buildingid = req.params.buildingid,
        floorid = req.params.floorid,
        closetname = req.body.name;

    var error = '';
    if (!floorid || floorid === '') {
        error = 'Missing the Floor Id';
    }
    if (!closetname || closetname === '') {
        error = 'Missing the Closet Name';
    }

    model.createClosetWithFloorId(floorid, closetname, function (err, floor) {
        console.log("----------");
        req.method = 'get';
        res.redirect('/sites/' + sitecode + '/building/' + buildingid + '/floor/' + floorid);
    });

};

exports.delete = function (req, res, model) {

    res.render('siteList', { title: 'MyInventory' });
};