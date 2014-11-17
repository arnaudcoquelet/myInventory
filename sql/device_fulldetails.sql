CREATE  VIEW `device_fulldetails` AS
    select 
        `sites`.`id` AS `site_id`,
        `sites`.`name` AS `site_name`,
        `sites`.`code` AS `site_code`,
        `addresses`.`address1` AS `site_address1`,
        `addresses`.`address2` AS `site_address2`,
        `addresses`.`city` AS `site_city`,
        `addresses`.`state` AS `site_state`,
        `addresses`.`zipcode` AS `site_zipcode`,
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
        `products`.`name` AS `device_type`
    from
        ((((((((((((`buildings`
        join `buildingssites` ON ((`buildings`.`id` = `buildingssites`.`buildingId`)))
        join `sites` ON ((`buildingssites`.`siteId` = `sites`.`id`)))
        join `addressessites` ON ((`sites`.`id` = `addressessites`.`siteId`)))
        join `addresses` ON ((`addressessites`.`addressId` = `addresses`.`id`)))
        join `buildingsfloors` ON ((`buildings`.`id` = `buildingsfloors`.`buildingId`)))
        join `floors` ON ((`buildingsfloors`.`floorId` = `floors`.`id`)))
        join `closetsfloors` ON ((`floors`.`id` = `closetsfloors`.`floorId`)))
        join `closets` ON ((`closetsfloors`.`closetId` = `closets`.`id`)))
        join `closetsdevices` ON ((`closets`.`id` = `closetsdevices`.`closetId`)))
        join `devices` ON ((`closetsdevices`.`deviceId` = `devices`.`id`)))
        join `devicesproducts` ON ((`devices`.`id` = `devicesproducts`.`deviceId`)))
        join `products` ON ((`devicesproducts`.`productId` = `products`.`id`)))
    order by `sites`.`code` , `buildings`.`name` , `floors`.`name` , `closets`.`name` , `devices`.`name`
