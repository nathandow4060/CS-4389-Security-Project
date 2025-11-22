--AUTHOR: Ethan McDonell
CREATE ROLE admin LOGIN PASSWORD --PASSWORD_HERE; --insert password here from discord
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT USAGE, SELECT ON SEQUENCE public.product_id_seq, public.user_wishlist_id_seq, public.user_purchase_history_id_seq TO admin;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE ACCOUNT(
	id BIGSERIAL PRIMARY KEY,
	username TEXT UNIQUE NOT NULL,
	password BYTEA NOT NULL,
	age INTEGER NOT NULL,
	email TEXT UNIQUE NOT NULL,
);

CREATE TABLE PRODUCT(
	id BIGSERIAL PRIMARY KEY,
	name_of_product TEXT,
	developer TEXT,
	price TEXT,
	image_url TEXT,
	description TEXT,
	esrb_rating TEXT
);

CREATE TABLE PRODUCT_KEY(
	productid BIGINT,
	key BYTEA,
	FOREIGN KEY (productid) REFERENCES product(id) ON DELETE CASCADE,
	UNIQUE(productid, key)
);

CREATE TABLE USER_WISHLIST(
	id BIGSERIAL PRIMARY KEY,
	user_id BIGINT,
	product_id BIGINT,
	date_added TEXT,
	rank INTEGER,
	FOREIGN KEY (user_id) REFERENCES account(id) ON DELETE CASCADE,
	FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
	UNIQUE(user_id, product_id, rank) -- each user must rank each product at a different level
);

CREATE TABLE USER_PURCHASE_HISTORY(
	id BIGSERIAL PRIMARY KEY,
	productID BIGINT,
	accountID BIGINT,
	productKey TEXT UNIQUE,
	date_of_purchase TIMESTAMPTZ NOT NULL DEFAULT now(),
	FOREIGN KEY (accountID) REFERENCES account(id),
	FOREIGN KEY (productID) REFERENCES product(id),
	UNIQUE(user_id, product_id),
	UNIQUE(user_id, rank)
);

drop table USER_PURCHASE_HISTORY


CREATE TABLE WEBPAGE_CONTENT(
	id BIGSERIAL PRIMARY KEY,
	image TEXT,
	descrption TEXT,
	name TEXT
);

-- SECRETS CONFIG (for .env file storage)

--TABLE POPULATION
INSERT INTO account (username,password,age,email)
VALUES ('Ethan',pgp_sym_encrypt('mypass', 'c65ef18bd3a0183cedce4ff720f1f437d070194f916479d5874aef0964b62f29'),21,'elm210004@utdallas.edu');

INSERT INTO product (name_of_product, developer, price, description, esrb_rating)
VALUES
('Battlefield 6', 'Electronic Arts', '$69.99', 'The ultimate all-out warfare experience. Fight in high-intensity infantry combat. Rip through the skies in aerial dogfights. Demolish your environment for a strategic advantage. Harness complete control over every action and movement using the Kinesthetic Combat System. In a war of tanks, fighter jets, and massive combat arsenals, the deadliest weapon is your squad. This is Battlefield 6.', 'M'),
('Megabonk', 'vedinad', '$9.99', 'Megabonk is a roguelike survival game where you must fight your way through hordes of enemies and bosses in randomly generated maps. Grab loot on the way, level up your character, upgrade your weapons and survive for as long as you can! How far can you make it?', 'none');

INSERT INTO user_wishlist (user_id, product_id, date_added, rank)
VALUES (2, 1, '10/19/2025', 1),
		(2, 2, '10/28/2025', 2);

INSERT INTO USER_PURCHASE_HISTORY (productid, accountid, productkey)
VALUES (1, 2, '1234');

INSERT INTO PRODUCT_KEY (productid, key)
VALUES (1, 'E1234'),
		(1, 'J3897')
		(1, 'M23R5'),
		(2, 'K3467');
--Using exaple key, a randomly generated key will be stored on server as a var in .env
INSERT INTO product_key (productid, key)
VALUES (1, pgp_sym_encrypt('E1234', 'b3fe0039a712cb658cc4477aa129d142c3352918de6dd010b6db7')),
		(1, pgp_sym_encrypt('J3897', 'b3fe0039a712cb658cc4477aa129d142c3352918de6dd010b6db7')),
		(1, pgp_sym_encrypt('M23R5', 'b3fe0039a712cb658cc4477aa129d142c3352918de6dd010b6db7')),
		(2, pgp_sym_encrypt('K3467', 'b3fe0039a712cb658cc4477aa129d142c3352918de6dd010b6db7'));

--VIEW TABLE RECORDS
SELECT id, username, pgp_sym_decrypt(password, 'c65ef18bd3a0183cedce4ff720f1f437d070194f916479d5874aef0964b62f29') as password, age, email FROM account;
 --View product AND assciated KEYS
 --decrepts key
 --Using exaple key, a randomly generated key will be stored on server as a var in .env
SELECT product.id, pgp_sym_decrypt(pk.key, 'b3fe0039a712cb658cc4477aa129d142c3352918de6dd010b6db7') as key, product.name_of_product FROM PRODUCT
RIGHT JOIN PRODUCT_KEY as pk ON PRODUCT.id = pk.productid;

SELECT * FROM ACCOUNT;
SELECT * FROM product_key;
SELECT * FROM PRODUCT;
SELECT * FROM user_purchase_history;
SELECT * FROM USER_WISHLIST;
SELECT * FROM WEBPAGE_CONTENT;


--VIEW WISHLIST by USER
SELECT * FROM USER_WISHLIST
WHERE user_id = 2
ORDER BY RANK

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
WHERE ID = id;

ALTER TABLE user_purchase_history
ALTER COLUMN date_of_purchase 
SET DEFAULT now(),




