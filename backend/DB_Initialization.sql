CREATE ROLE admin LOGIN PASSWORD '18BzeQ2yuOP96342!';

CREATE TABLE ACCOUNT(
	id BIGSERIAL PRIMARY KEY,
	username TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL,
	age INTEGER NOT NULL,
	email TEXT UNIQUE NOT NULL 
);

CREATE TABLE PRODUCT(
	id BIGSERIAL PRIMARY KEY,
	digital_key TEXT,
	name_of_product TEXT,
	developer TEXT,
	price TEXT,
	image_url TEXT,
	description TEXT,
	esrb_rating TEXT
);

CREATE TABLE USER_WISHLIST(
	id BIGSERIAL PRIMARY KEY,
	user_id BIGINT,
	product_id BIGINT,
	date_added TEXT,
	rank INTEGER UNIQUE,
	FOREIGN KEY (user_id) REFERENCES account(id) ON DELETE CASCADE,
	FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);

CREATE TABLE WEBPAGE_CONTENT(
	id BIGSERIAL PRIMARY KEY,
	image TEXT,
	descrption TEXT,
	name TEXT
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(200) NOT NULL
);


--TABLE POPULATION
INSERT INTO account (username,password,age,email)
VALUES ('Ethan','Mypass',21,'elm210004@utdallas.edu');

INSERT INTO product (digital_key, name_of_product, developer, price, description, esrb_rating)
VALUES
('1234', 'Battlefield 6', 'Electronic Arts', '$69.99', 'The ultimate all-out warfare experience. Fight in high-intensity infantry combat. Rip through the skies in aerial dogfights. Demolish your environment for a strategic advantage. Harness complete control over every action and movement using the Kinesthetic Combat System. In a war of tanks, fighter jets, and massive combat arsenals, the deadliest weapon is your squad. This is Battlefield 6.', 'M'),
('6897', 'Megabonk', 'vedinad', '$9.99', 'Megabonk is a roguelike survival game where you must fight your way through hordes of enemies and bosses in randomly generated maps. Grab loot on the way, level up your character, upgrade your weapons and survive for as long as you can! How far can you make it?', 'none');

INSERT INTO user_wishlist (user_id, product_id, date_added, rank)
VALUES (2, 1, '10/19/2025', 1);

--VIEW TABLE RECORDS
SELECT * FROM account;
SELECT * FROM PRODUCT;
SELECT * FROM USER_WISHLIST;
SELECT * FROM WEBPAGE_CONTENT;

--MODIFY TABLE RECORD
UPDATE TABLE
SET column = value
where condition;

--MODFY TABLE STRUCTURE
ALTER TABLE table
ADD CONSTRAINT CONST_NAME CONSTRAINT FIELD(S);

--DELETE FROM RECORD
DELETE FROM TABLE
WHERE condition;

DELETE FROM ACCOUNT
WHERE ID = 1;







