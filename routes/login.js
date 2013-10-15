/**
 * Created by ArnaudCoquelet on 10/4/13.
 */
exports.login = function(req, res){
    if(req.session.flash && req.session.flash.error){
        console.log(req.session.flash.error);
        req.flash('error');
    }


    res.render('login', { title: 'MyInventory' });
};