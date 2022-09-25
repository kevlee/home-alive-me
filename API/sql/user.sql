DROP USER IF EXISTS 'zwave';
CREATE USER IF NOT EXISTS 'zwave' IDENTIFIED WITH mysql_native_password BY 'ppI3h4uwaz*UgT#s';
GRANT ALL PRIVILEGES ON homealiveme.* to 'zwave'@'%';
flush privileges ;