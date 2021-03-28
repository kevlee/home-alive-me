USE `homealiveme`;

--
-- Table structure for table `connection`
--

CREATE TABLE IF NOT EXISTS `rooms` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL UNIQUE,
  `temperature` decimal DEFAULT 0.0  ,
  `lux` decimal DEFAULT 0.0 ,
  PRIMARY KEY (`id`,`name`)
) ;

#add in node table the room location
ALTER TABLE `nodes` ADD COLUMN IF NOT EXISTS `name` varchar(50);
ALTER TABLE `nodes` ADD CONSTRAINT  `nodes_ibfk_1` FOREIGN KEY IF NOT EXISTS(`name`) REFERENCES `rooms` (`name`)
 ON DELETE SET NULL
 ON UPDATE CASCADE;