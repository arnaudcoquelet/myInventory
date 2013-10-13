/**
 * Created by ArnaudCoquelet on 10/4/13.
 */

exports.list = function(req, res, model){
    var sites = [];
    var breadcrumbs = [{name:'Sites',url:'',class: 'active'}];

    if(model){
        model.findSiteAll( function(err,sites) {
            res.render('siteList', { title: 'MyInventory', sites: sites, breadcrumbs: breadcrumbs }); })
    }
    else{
        res.render('siteList', { title: 'MyInventory', sites: sites, breadcrumbs: breadcrumbs });
    }
};

exports.list_json = function(req, res, model){
    if(model){
        model.findSiteAll( function(err,sites) {
            res.json(sites );
        });
    }
    else{
        res.json([]);
    }
};

exports.listdetails_json = function(req, res, model){
    if(model){
        model.findSiteAllDetails( function(err,sites) {
            res.json(sites );
        });
    }
    else{
        res.json([]);
    }
};


exports.details = function(req, res, model){
    var sitecode = req.params.sitecode;
    var breadcrumbs = [{name:'Sites',url:'/sites',class: ''},{name:sitecode,url:'',class: 'active'}];

    if(sitecode && model){
        model.findSiteByCode(sitecode, function(err,site){
            if(err){}

            if(site){
                var buildings = site.getBuildings()
                    .on('success', function(buildings){
                        if(buildings && !buildings instanceof Array) {buildings=[];}

                        res.render('siteDetails', { title: 'MyInventory',
                                                    site: site,
                                                    buildings: buildings,
                                                    breadcrumbs: breadcrumbs});
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
    var site = req.body.site,
        code = req.body.code,
        address1 = req.body.address1,
        address2 = req.body.address2,
        city = req.body.city,
        state = req.body.state,
        zipcode = req.body.zipcode;

    var error='';
    if(!site || site==='') { error = 'Missing the Site name'; }
    if(!code || code==='') { error = 'Missing the Site Code'; }

    model.createSite(site,code,address1,address2,city,state,zipcode, function(err,site){
        console.log("----------");
        req.method = 'get';
        res.redirect('/Sites');
    } );

};

exports.delete = function(req, res, model){

    res.render('siteList', { title: 'MyInventory' });
};