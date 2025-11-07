CREATE TABLE users (
  id bigint NOT NULL AUTO_INCREMENT,
  fullName varchar(300) NOT NULL,
  email varchar(700) UNIQUE ,
  about longtext DEFAULT NULL,
  pass varchar(500),
  accountCreateDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  verificationFlag  int DEFAULT 0 NOT NULL ,
  isEmailVerified  int DEFAULT 0 NOT NULL
  PRIMARY KEY (id)
);