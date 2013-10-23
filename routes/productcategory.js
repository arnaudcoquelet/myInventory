/**
 * Created by ArnaudCoquelet on 10/4/13.
 */

exports.list = function(req, res, model){
    var productcategories = [];
    var breadcrumbs = [{name:'Product Category',url:'/admin/ProductCategory',class: 'active'}];

    if(model){
        model.findProductCategoryAll( function(err,productcategories) {
            res.render('ProductCategoryList', { title: 'MyInventory', productcategories: productcategories, breadcrumbs: breadcrumbs }); })
    }
    else{
        res.render('siteList', { title: 'MyInventory', productcategories: productcategories, breadcrumbs: breadcrumbs });
    }
};

exports.list_json = function(req, res, model){
    if(model){
        model.findProductCategoryAll( function(err,productcategories) {
            res.json(productcategories );
        });
    }
    else{
        res.json([]);
    }
};

exports.details = function(req, res, model){
    var ProductCategoryid = req.params.ProductCategoryid;
    var breadcrumbs = [{name:'Product Category',url:'/admin/ProductCategory',class: ''}, {name:ProductCategoryid,url:'',class: 'active'}];

    if(ProductCategoryid && model){
        model.findProductCategoryById(ProductCategoryid, function(err,ProductCategory){
            if(err){}

            if(ProductCategory){
                var products = ProductCategory.getProducts()
                    .on('success', function(products){
                        if(products && !products instanceof Array) {products=[];}

                        breadcrumbs = [{name:'Product Category',url:'/admin/ProductCategory',class: ''}, {name:ProductCategory.name ,url:'',class: 'active'}];

                        res.render('ProductCategoryDetails', { title: 'MyInventory',
                                                    ProductCategoryId: ProductCategoryid,
                                                    ProductCategory: ProductCategory,
                                                    products: products,
                                                    breadcrumbs: breadcrumbs});
                });
            }
        })
    }
    else
    {
        res.redirect("/admin/ProductCategory");
    }
};

exports.details_json = function(req, res, model){
    var ProductCategoryid = req.params.ProductCategoryid;
    var breadcrumbs = [{name:'Product Category',url:'/admin/ProductCategory',class: ''}, {name:ProductCategoryid,url:'',class: 'active'}];

    if(ProductCategoryid && model){
        model.findProductCategoryById(ProductCategoryid, function(err,ProductCategory){
            if(err){}

            if(ProductCategory){
                var products = ProductCategory.getProducts({where: {deleted: false} ,attributes: ['id', 'name', 'part']})
                    .on('success', function(products){
                        if(products && !products instanceof Array) {res.json([]);}
                        res.json(products);
                });
            }
        })
    }
    else
    {
        res.json([]);
    }
};

exports.create = function(req, res, model){
    var ProductCategoryName = req.body.ProductCategory;
    var error='';
    if(!ProductCategoryName || ProductCategoryName==='') { error = 'Missing the product family name'; }

    model.createProductCategory({name: ProductCategoryName}, function(err,ProductCategory){
        res.method = 'get';
        res.redirect('/admin/ProductCategory');
    } );

};

exports.delete = function(req, res, model){
    var ProductCategoryid = req.params.ProductCategoryId;
    if(! ProductCategoryid || ProductCategoryid==='undefined' ) {ProductCategoryid = req.body.ProductCategoryId;}

    if(model && ProductCategoryid)
    {
        model.deleteProductCategoryById(ProductCategoryid, function(err, ProductCategory){
            if(err){}

            res.redirect('/admin/ProductCategory');
        });
    }
    else{
        res.redirect('/admin/ProductCategory');
    }
};

exports.update = function(req, res, model){
    var ProductCategoryid = req.body.ProductCategoryId;
    var productcategoryname = req.body.ProductCategoryName;

    if(model && ProductCategoryid)
    {
        model.updateProductCategoryById(ProductCategoryid, {name: productcategoryname}, function(err, ProductCategory){
            if(err){}
            res.redirect('/admin/ProductCategory');
        });
    }
    else{
        res.redirect('/admin/ProductCategory');
    }
};