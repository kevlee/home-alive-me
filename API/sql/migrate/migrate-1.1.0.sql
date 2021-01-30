USE `homealiveme`;

--
-- Table structure for table `connection`
--

CREATE TABLE IF NOT EXISTS `rooms` (
  `name` varchar(50) NOT NULL,
  `temperature` decimal DEFAULT 0.0  ,
  `lux` decimal DEFAULT 0.0 ,
  PRIMARY KEY (`name`)
) ;

#add in node table the room location
ALTER TABLE `nodes` ADD COLUMN `name` varchar(50);
ALTER TABLE `nodes` ADD CONSTRAINT `nodes_ibfk_1` FOREIGN KEY (`name`) REFERENCES `rooms` (`name`);