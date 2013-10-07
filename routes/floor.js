/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function(req, res, model){
    var sitecode = req.params.sitecode;
    var buildingid = req.params.buildingid;
    var breadcrumbs = [{name:'Sites',url:'/sites',class: ''},{name:sitecode,url:'',class: ''},{name:buildingid,url:'',class: ''}];

    if(sitecode && buildingid && model){
        model.findSiteByCode(sitecode, function(err,site){
            if(err){res.redirect("/sites/" + sitecode);}
            if(site){
                model.findBuildingById(buildingid, function(err,building){
                    if(err) {res.redirect("/sites/" + sitecode + "/building/" + buildingid);}
                    if(buillding){
                        building.getFloors()
                            .on('success', function(floors){

                                breadcrumbs = [{name:'Sites',url:'/sites',class: ''},
                                               {name:site.code,url:'/sites/' + site.code ,class: ''},
                                               {name:building.name,url:'',class: 'active'}];

                                res.render('site', { title: 'MyInventory',
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
    else
    {
        res.redirect("/Sites");
    }
};

exports.details = function(req, res, model){
    var sitecode = req.params.sitecode;
    var buildingid = req.params.buildingid;
    var floorid = req.params.floorid;

    var breadcrumbs = [ {name:'Sites',url:'/sites',class: ''},
        {name:sitecode,url:'/sites/' + sitecode,class: ''},
        {name:buildingid,url:'',class: 'active'}
    ];

    if(buildingid && model){
        model.findBuildingById(buildingid, function(err,building){
            if(err){
                console.log(err);
                console.log("Corresponding Building not found");
                res.redirect("/Sites/" + sitecode);}

            if(building){
                building.getSites()
                    .on('success', function(sites){
                        console.log(sites);
                        if(sites && !sites instanceof Array) {
                            console.log("Corresponding site information not found");
                            res.redirect("/Sites/" + sitecode);
                        }

                        building.getFloors()
                            .on('success', function(floors){
                                if(floors && !floors instanceof Array) {
                                    floors = [];
                                }

                                var breadcrumbs = [ {name:'Sites',url:'/sites',class: ''},
                                    {name:sitecode,url:'/sites/' + sitecode,class: ''},
                                    {name:building.name,url:'',class: 'active'}
                                ];

                                res.render('buildingDetails', { title: 'MyInventory',
                                    site: sites[0],
                                    building: building,
                                    floors: floors,
                                    breadcrumbs: breadcrumbs
                                });
                            });
                    });
            }
        })
    }
    else
    {
        res.redirect("/Sites");
    }
};

exports.create = function(req, res, model){
    var sitecode = req.params.sitecode,
        buildingname = req.body.buildingname;

    var error='';
    if(!sitecode || sitecode==='') { error = 'Missing the Site Code'; }
    if(!buildingname || buildingname==='') { error = 'Missing the Building Name'; }

    model.createBuildingWithSitecode(sitecode, buildingname, function(err,building){
        console.log("----------");
        req.method = 'get';
        res.redirect('/Sites/' + sitecode + '/building');
    } );

};

exports.delete = function(req, res, model){

    res.render('siteList', { title: 'MyInventory' });
};