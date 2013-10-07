
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.redirect('/sites');
    //res.render('index', { user: req.user, title: 'MyInventory' });
};