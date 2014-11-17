  CREATE  VIEW `view_devicesalldetails` AS
     select
          `sitegroups`.`id` AS `sitegroup_id`,
          `sitegroups`.`name` AS `sitegroup_name`,
  		  `sitegroups`.`code` AS `sitegroup_code`,
  		  `sites`.`id` AS `site_id`,
          `sites`.`name` AS `site_name`,
          `sites`.`code` AS `site_code`,
          `sites`.`canbedeleted` AS `site_canbedeleted`,
          `buildings`.`id` AS `building_id`,
          `buildings`.`name` AS `building_name`,
          `buildings`.`canbedeleted` AS `building_canbedeleted`,
          `floors`.`id` AS `floor_id`,
          `floors`.`name` AS `floor_name`,
          `floors`.`canbedeleted` AS `floor_canbedeleted`,
          `closets`.`id` AS `closet_id`,
          `closets`.`name` AS `closet_name`,
          `closets`.`spare` AS `closet_spare`,
          `closets`.`canbedeleted` AS `closet_canbedeleted`,
          `devices`.`id` AS `device_id`,
          `devices`.`name` AS `device_name`,
          `devices`.`serial` AS `device_serial`,
          `devices`.`deleted` AS `device_deleted`,
          `ProductCategories`.name as `productcategories_name`,
          `products`.id as `product_id`,
          `products`.name as `product_name`,
          `products`.part as `product_part`
      from
  		`sitegroups`
          join `sites` ON (`sitegroups`.`id` = `sites`.`sitegroupId`)
          join `buildings` ON (`buildings`.`siteId` = `sites`.`id`)
          join `floors` ON (`buildings`.`id` = `floors`.`buildingId`)
          join `closets` ON (`floors`.`id` = `closets`.`floorId`)
          join `devices` ON (`closets`.`id` = `devices`.`closetId`)
          join `products` ON (`devices`.`productId` = `products`.`id`)
  		  join `ProductCategories` ON (`ProductCategories`.`id` = `products`.`ProductCategoryId`)
      where
        `sitegroups`.`deleted` = 0 AND
        `sites`.`deleted` = 0 AND
        `buildings`.`deleted` = 0 AND
        `floors`.`deleted` = 0 AND
        `closets`.`deleted` = 0 AND
        `devices`.`deleted` = 0 AND
        `products`.`deleted` = 0 AND
        `ProductCategories`.`deleted` = 0
      order by `sitegroups`.`code`,`sites`.`code` , `buildings`.`name` , `floors`.`name` , `closets`.`name`, `devices`.`name`
