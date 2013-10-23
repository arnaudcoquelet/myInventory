/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.list = function (req, res, model) {
    var sitegroupid = req.params.sitegroupid;
    var breadcrumbs = [
        {name: 'SiteGroup', url: '', class: ''}
    ];

    res.render('sitegroupList',
        {
            title: 'MyInventory',
            breadcrumbs: breadcrumbs
        }
    );
};

exports.list_json = function (req, res, model) {
    if (model) {
        model.findSiteGroupAll(function (err, sitegroups) {
            if (err) {res.json([]);}
            if (sitegroups) { res.json(sitegroups); }
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
    var name = req.body.name;
    var code = req.body.code;
    var error = '';
    res.method = 'get';

    if (!name || name === '') { error = 'Missing the SiteGroup'; }
    if (!code || code === '') { error = 'Missing the Code'; }
    if(model){
        model.createSiteGroup({name: name, code: code}, function (err, sitegroup) {
            res.redirect('/sitegroup/' + sitegroup.id);
        });
    }
    else { res.redirect('/sitegroup');}
};

exports.update = function (req, res, model) {
    var id   = req.body.id;
    var name = req.body.name;
    var code = req.body.code;
    var error = '';
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the SiteGroup Id'; }
    if (!name || name === '') { error = 'Missing the SiteGroup'; }
    if (!code || code === '') { error = 'Missing the Code'; }
    if(model){
        model.updateSiteGroupById(id, {name:name, code:code} , function (err, sitegroup) {
            res.redirect('/sitegroup/' + sitegroup.id);
        });
    }
    else { res.redirect('/sitegroup');}
};

exports.delete = function (req, res, model) {
    var id = req.body.id;
    res.method = 'get';

    if (!id   ||   id === '') { error = 'Missing the SiteGroup Id'; }
    if(id && model){
        model.deleteSiteGroupById(id, function(err, sitegroup){
            res.redirect('/sitegroup');
        })
    }
    else {
        res.redirect('/sitegroup');
    }
};