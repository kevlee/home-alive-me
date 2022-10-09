#CREATE DATABASE "homealiveme";
\c "homealiveme";


-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: homealiveme
-- ------------------------------------------------------
-- Server version	8.0.22


--
-- Table structure for table "nodes"
--

CREATE TABLE IF NOT EXISTS "nodes" (
  "nodeid" int NOT NULL,
  "nodeuid" varchar(32) NOT NULL,
  "productname" text,
  "type" text,
  PRIMARY KEY ("nodeuid")
);



--
-- Table structure for table "temperature"
--

CREATE TABLE IF NOT EXISTS "temperature" (
  "nodeuid" varchar(32) NOT NULL,
  "label" text,
  "value" text,
  "units" varchar(32) DEFAULT NULL,
  "date" timestamp  DEFAULT NULL,
  CONSTRAINT "temperature_ibfk_1" FOREIGN KEY ("nodeuid") REFERENCES "nodes" ("nodeuid") ON DELETE CASCADE
);

--
-- Table structure for table "lux"
--

CREATE TABLE IF NOT EXISTS "lux" (
  "nodeuid" varchar(32) NOT NULL,
  "label" text,
  "value" text,
  "units" varchar(32) DEFAULT NULL,
  "date" timestamp  DEFAULT NULL,
  CONSTRAINT "lux_ibfk_1" FOREIGN KEY ("nodeuid") REFERENCES "nodes" ("nodeuid") ON DELETE CASCADE
);


--
-- Table structure for table "task"
--

CREATE TABLE IF NOT EXISTS "task" (
  "id" varchar(36) NOT NULL,
  "taskname" varchar(36) DEFAULT NULL,
  "status" text,
  "result" json DEFAULT NULL,
  "date" timestamp DEFAULT NULL,
  PRIMARY KEY ("id")
);

--
-- Table structure for table "connection"
--

CREATE TABLE IF NOT EXISTS "connection" (
  "type" varchar(36) NOT NULL,
  "port" varchar(36) NOT NULL,
  PRIMARY KEY ("type")
) ;



