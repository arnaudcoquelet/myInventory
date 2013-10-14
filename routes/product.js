/**
 * Created by ArnaudCoquelet on 10/4/13.
 */

exports.list = function(req, res, model){
    var productfamilies = [];
    var breadcrumbs = [{name:'Product Family',url:'/admin/productfamily',class: 'active'}];

    if(model){
        model.findProductFamilyAll( function(err,productfamilies) {
            res.render('productfamilyList', { title: 'MyInventory', productfamilies: productfamilies, breadcrumbs: breadcrumbs }); })
    }
    else{
        res.render('siteList', { title: 'MyInventory', productfamilies: productfamilies, breadcrumbs: breadcrumbs });
    }
};

exports.list_json = function(req, res, model){
    if(model){
        model.findProductFamilyAll( function(err,productfamilies) {
            res.json(productfamilies );
        });
    }
    else{
        res.json([]);
    }
};

exports.details = function(req, res, model){
    var productfamilyid = req.params.productfamilyid;
    var breadcrumbs = [{name:'Product Family',url:'/admin/productfamily',class: ''}, {name:productfamilyid,url:'',class: 'active'}];

    if(productfamilyid && model){
        model.findProductFamilyById(productfamilyid, function(err,productfamily){
            if(err){}

            if(productfamily){
                var products = productfamily.getProducts()
                    .on('success', function(products){
                        if(products && !products instanceof Array) {products=[];}

                        breadcrumbs = [{name:'Product Family',url:'/admin/productfamily',class: ''}, {name:productfamily.name ,url:'',class: 'active'}];

                        res.render('productfamilyDetails', { title: 'MyInventory',
                                                    productfamilyId: productfamilyid,
                                                    productfamily: productfamily,
                                                    products: products,
                                                    breadcrumbs: breadcrumbs});
                });
            }
        })
    }
    else
    {
        res.redirect("/admin/productfamily");
    }
};

exports.details_json = function(req, res, model){
    var productid = req.params.productid;
    var breadcrumbs = [{name:'Product Family',url:'/admin/productfamily',class: ''}, {name:productfamilyid,url:'',class: 'active'}];

    if(productfamilyid && model){/*
        model.findProductFamilyById(productfamilyid, function(err,productfamily){
            if(err){}

            if(productfamily){
                var products = productfamily.getProducts({attributes: ['id', 'name', 'part']})
                    .on('success', function(products){
                        if(products && !products instanceof Array) {res.json([]);}
                        res.json(products);
                });
            }
        })*/
    }
    else
    {
        res.json([]);
    }
};

exports.listAllDetails_json = function(req, res, model){
    if(model){
        model.getProductAllDetails( function(err,products){
            res.json(products);
        });
    }
    else{ res.json([]);}
};

exports.selectView = function(req, res, model){
    res.render('productSelect',{ title: 'MyInventory', breadcrumbs: [] });
};

exports.create = function(req, res, model){
    var productfamilyid = req.params.productfamilyid;
    var name = req.body.productName;
    var part = req.body.productPart;

    var error='';
    if(!name || name==='') { error = 'Missing the Product name'; }
    if(!part || part==='') { error = 'Missing the Product part #'; }
    if(!productfamilyid || productfamilyid==='') { error = 'Missing the Product family'; }

    model.createProductWithProductFamilyId(productfamilyid,name,part, function(err,site){
        res.method = 'get';
        res.redirect('/admin/productfamily/' + productfamilyid);
    } );

};

exports.delete = function(req, res, model){
    var productfamilyid = req.params.productfamilyid;
    var productid = req.params.productid;

    if(! productid || productid==='undefined' ) {productid = req.body.productId;}

    if(model && productid)
    {
        model.deleteProductById(productid, function(err, product){
            if(err){}

            res.redirect('/admin/productfamily/' + productfamilyid);
        });
    }
    else{
        res.redirect('/admin/productfamily/' + productfamilyid);
    }
};

exports.update = function(req, res, model){
    var productfamilyid = req.params.productfamilyid;
    var id = req.body.productId;
    var name = req.body.productName;
    var part = req.body.productPart;

    if(model && id)
    {
        model.updateProductById(id, name, part, function(err, product){
            if(err){}
            res.redirect('/admin/productfamily/' +productfamilyid );
        });
    }
    else{
        res.redirect('/admin/productfamily/' +productfamilyid );
    }
};