CREATE VIEW `view_productsalldetails` AS
    select
		`ProductCategories`.name as `productcategories_name`,
		`products`.id as `product_id`,
		`products`.name as `product_name`,
		`products`.part as `product_part`
    from
        ProductCategories
        join `products` ON (`ProductCategories`.`id` = `products`.`ProductCategoryId`)
    where
        `products`.`deleted` = 0 AND `ProductCategories`.`deleted` = 0
    order by `ProductCategories`.name, `products`.name, `products`.part