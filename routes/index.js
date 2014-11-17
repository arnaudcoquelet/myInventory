
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.redirect('/sitegroup');
    //res.render('index', { user: req.user, title: 'MyInventory' });
};