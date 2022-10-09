\c "homealiveme";
DROP USER "zwave";
CREATE USER "zwave"  WITH PASSWORD 'ppI3h4uwaz*UgT#s';
GRANT CONNECT ON DATABASE "homealiveme" TO "zwave";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "zwave";

