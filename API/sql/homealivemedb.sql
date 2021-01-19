CREATE DATABASE  IF NOT EXISTS `homealiveme` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `homealiveme`;

GRANT ALL PRIVILEGES ON *.* TO 'zwave'@'%' IDENTIFIED BY 'password';
-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: homealiveme
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `nodes`
--

CREATE TABLE IF NOT EXISTS `nodes` (
  `nodeid` int NOT NULL,
  `nodeuid` varchar(32) NOT NULL,
  `productname` mediumtext,
  `type` tinytext,
  PRIMARY KEY (`nodeuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `temperature`
--

CREATE TABLE IF NOT EXISTS `temperature` (
  `nodeuid` varchar(32) NOT NULL,
  `label` tinytext,
  `value` tinytext,
  `units` varchar(32) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  KEY `nodeuid` (`nodeuid`),
  CONSTRAINT `temperature_ibfk_1` FOREIGN KEY (`nodeuid`) REFERENCES `nodes` (`nodeuid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

--
-- Table structure for table `lux`
--

CREATE TABLE IF NOT EXISTS `lux` (
  `nodeuid` varchar(32) NOT NULL,
  `label` tinytext,
  `value` tinytext,
  `units` varchar(32) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  KEY `nodeuid` (`nodeuid`),
  CONSTRAINT `lux_ibfk_1` FOREIGN KEY (`nodeuid`) REFERENCES `nodes` (`nodeuid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;



--
-- Table structure for table `task`
--

CREATE TABLE IF NOT EXISTS `task` (
  `id` varchar(36) NOT NULL,
  `taskname` varchar(36) DEFAULT NULL,
  `status` tinytext,
  `result` json DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `Connection`
--

CREATE TABLE IF NOT EXISTS `Connection` (
  `type` varchar(36) NOT NULL,
  `port` varchar(36) NOT NULL,
  PRIMARY KEY (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-18 21:48:51
