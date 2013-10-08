/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function (req, res, model) {
    var sitecode = req.params.sitecode;
    var buildingid = req.params.buildingid;
    var breadcrumbs = [
        {name: 'Sites', url: '/sites', class: ''},
        {name: sitecode, url: '', class: ''},
        {name: buildingid, url: '', class: ''}
    ];

    if (sitecode && buildingid && model) {
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
                        building.getFloors()
                            .on('success', function (floors) {

                                breadcrumbs = [
                                    {name: 'Sites', url: '/sites', class: ''},
                                    {name: site.code, url: '/sites/' + site.code, class: ''},
                                    {name: building.name, url: '', class: 'active'}
                                ];

                                res.render('floorList', { title: 'MyInventory',
                                    site: site,
                                    building: building,
                                    floors: floors,
                                    breadcrumbs: breadcrumbs });
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

    if (sitecode && buildingid && model) {
        model.findSiteByCode(sitecode, function (err, site) {
            if (err) { res.json([]);  }
            if (site) {
                model.findBuildingById(buildingid, function (err, building) {
                    if (err) {res.json([]);}
                    if (building) {
                        building.getFloors()
                            .on('success', function (floors) {
                                res.json(floors);
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

                                        res.render('floorDetails', { title: 'MyInventory',
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

exports.create = function (req, res, model) {
    var sitecode = req.params.sitecode,
        buildingid = req.params.buildingid,
        floorname = req.body.name;

    var error = '';
    if (!buildingid || buildingid === '') {
        error = 'Missing the Building Id';
    }
    if (!floorname || floorname === '') {
        error = 'Missing the Floor Name';
    }

    model.createFloorWithBuildingId(buildingid, floorname, function (err, floor) {
        console.log("----------");
        req.method = 'get';
        res.redirect('/Sites/' + sitecode + '/building/' + buildingid);
    });

};

exports.delete = function (req, res, model) {

    res.render('siteList', { title: 'MyInventory' });
};