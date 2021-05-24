DROP USER IF EXISTS 'zwave';
CREATE USER IF NOT EXISTS 'zwave' IDENTIFIED BY 'ppI3h4uwaz*UgT#s';
GRANT ALL PRIVILEGES ON homealiveme.* to 'zwave'@'%';
flush privileges ;