\c "homealiveme";

--
-- Table structure for table "connection"
--

CREATE TABLE IF NOT EXISTS "rooms" (
  "id" smallserial,
  "name" varchar(255) NOT NULL UNIQUE,
  "temperature" decimal DEFAULT 0.0  ,
  "lux" decimal DEFAULT 0.0 ,
  PRIMARY KEY ("id","name")
) ;

--add in node table the room location
ALTER TABLE "nodes" ADD COLUMN IF NOT EXISTS "roomname" varchar(255);
ALTER TABLE "nodes" ALTER COLUMN nodeuid TYPE varchar(60);
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_ibfk_1" FOREIGN KEY("roomname") REFERENCES "rooms" ("name")
 ON DELETE SET NULL
 ON UPDATE CASCADE;

 --add in node table connection
ALTER TABLE "nodes" ADD COLUMN IF NOT EXISTS "connection" varchar(255);
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_ibfk_2" FOREIGN KEY("connection") REFERENCES "connection" ("type")
 ON DELETE SET NULL
 ON UPDATE CASCADE;