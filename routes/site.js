/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function (req, res, model) {
    var id = req.params.sitegroupid;

    if(model){
        model.findSiteGroupById(id, function(err, sitegroup){
            if(err){res.redirect('/sitegroup');}
            if(!sitegroup){res.redirect('/sitegroup');}

            var breadcrumbs = [
                {name: 'SiteGroup', url: '/sitegroup', class: ''},
                {name: sitegroup.name , url: '', class: 'active'}
            ];

            res.render('siteList',
                {
                    title: 'MyInventory',
                    sitegroup: sitegroup,
                    breadcrumbs: breadcrumbs
                });

        });
    }
    else {res.redirect('/sitegroup'); }
};

exports.list_json = function (req, res, model) {
    var id = req.params.sitegroupid;
    if (model) {
        model.findSiteAllBySiteGroupId(id, function (err, sites) {
            if (err) {res.json([]);}
            res.json(sites);
        })
    }
    else {
        res.json([]);
    }
};

exports.details = function (req, res, model) {
    var id = req.params.id;
    var breadcrumbs = [ {name: 'SiteGroup', url: '/sitegroup', class: ''} ];

    if (id && model) {
        model.findSiteGroupById(id, function(err, sitegroup) {
            if (err) {
                res.redirect("/sitegroup");
            }
            if (sitegroup) {
                sitegroup.getSites().on('success', function(sites){
                    breadcrumbs = [
                        {name: 'SiteGroup', url: '/sitegroup', class: ''},
                        {name: sitegroup.name, url: '', class: 'active'}
                    ];

                    res.render('siteList', { title: 'MyInventory',
                        sitegroup: sitegroup,
                        sites: sites,
                        breadcrumbs: breadcrumbs });
                });
            }
        })
    }
    else {
        res.redirect("/sitegroup");
    }
};

exports.create = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var name = req.body.name;
    var code = req.body.code;
    var error = '';
    res.method = 'get';

    if (!name || name === '') { error = 'Missing the Site name'; }
    if (!code || code === '') { error = 'Missing the Code'; }
    if(model){
        model.createSiteWithSiteGroupId(sitegroupid,{name: name,code: code}, function (err, site) {
            res.redirect('/sitegroup/' + sitegroupid + '/site');
        });
    }
    else { res.redirect('/sitegroup/' + sitegroupid + '/site');}
};

exports.update = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var id   = req.body.id;
    var name = req.body.name;
    var code = req.body.code;
    var error = '';
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the SiteGroup Id'; }
    if (!name || name === '') { error = 'Missing the SiteGroup'; }
    if (!code || code === '') { error = 'Missing the Code'; }
    if(model){
        model.updateSiteById(id, {name:name, code:code}, function (err, site) {
            res.redirect('/sitegroup/' + sitegroupid + '/site');
        });
    }
    else { res.redirect('/sitegroup/'+ sitegroupid + '/site');}
};

exports.delete = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var id = req.body.id;
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the SiteGroup Id'; }
    if(id && model){
        model.deleteSiteById(id, function(err, site){
            res.redirect('/sitegroup/'+ sitegroupid + '/site');
        })
    }
    else {
        res.redirect('/sitegroup/'+ sitegroupid + '/site');
    }
};