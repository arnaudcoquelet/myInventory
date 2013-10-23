/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;

    if(model){
        model.findSiteGroupById(sitegroupid, function(err, sitegroup){
            if(err){res.redirect('/sitegroup');}
            if(!sitegroup){res.redirect('/sitegroup');}

            model.findSiteById(siteid, function(err, site){
                if(err){res.redirect('/sitegroup/' + sitegroup.id + '/site');}
                if(!site){res.redirect('/sitegroup/' + sitegroup.id + '/site');}

                var breadcrumbs = [
                    {name: 'SiteGroup', url: '/sitegroup', class: ''},
                    {name: sitegroup.name , url: '/sitegroup/' + sitegroup.id, class: ''},
                    {name: site.name , url: '', class: 'active'}
                ];

                res.render('buildingList',
                    {
                        title: 'MyInventory',
                        sitegroup: sitegroup,
                        site: site,
                        breadcrumbs: breadcrumbs
                    });

            });
        });
    }
    else {res.redirect('/sitegroup'); }
};

exports.list_json = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;

    if (model) {
        model.findBuildingAllBySiteId(siteid, function (err, buidlings) {
            if (err) {res.json([]);}
            res.json(buidlings);
        })
    }
    else {
        res.json([]);
    }
};


exports.create = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var name = req.body.name;
    var error = '';
    res.method = 'get';

    if (!name || name === '') { error = 'Missing the Site name'; }

    if(model){
        model.createBuildingWithSiteId(siteid,{name: name}, function (err, buidling) {
            res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid);
        });
    }
    else { res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid);}
};

exports.update = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var id   = req.body.id;
    var name = req.body.name;

    var error = '';
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the SiteGroup Id'; }
    if (!name || name === '') { error = 'Missing the SiteGroup'; }

    if(model){
        model.updateBuildingById(id, {name: name}, function (err, buidling) {
            res.redirect('/sitegroup/' + sitegroupid + '/site/' + siteid);
        });
    }
    else { res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid);}
};

exports.delete = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var siteid = req.params.siteid;
    var id = req.body.id;
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the SiteGroup Id'; }
    if(id && model){
        model.deleteBuildingById(id, function(err, site){
            res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid);
        })
    }
    else {
        res.redirect('/sitegroup/'+ sitegroupid + '/site/' + siteid);
    }
};