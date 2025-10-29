CREATE ROLE admin LOGIN PASSWORD --PASSWORD_HERE; --insert password here from discord
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT USAGE, SELECT ON SEQUENCE public.product_id_seq TO admin;

CREATE TABLE ACCOUNT(
	id BIGSERIAL PRIMARY KEY,
	username TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL,
	age INTEGER NOT NULL,
	email TEXT UNIQUE NOT NULL 
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
	key TEXT,
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
	productKey TEXT,
	date_of_purchase TEXT,
	FOREIGN KEY (accountID) REFERENCES account(id),
	FOREIGN KEY (productID) REFERENCES product(id)
);

CREATE TABLE WEBPAGE_CONTENT(
	id BIGSERIAL PRIMARY KEY,
	image TEXT,
	descrption TEXT,
	name TEXT
);

--TABLE POPULATION
INSERT INTO account (username,password,age,email)
VALUES ('Ethan','Mypass',21,'elm210004@utdallas.edu');

INSERT INTO product (name_of_product, developer, price, description, esrb_rating)
VALUES
('Battlefield 6', 'Electronic Arts', '$69.99', 'The ultimate all-out warfare experience. Fight in high-intensity infantry combat. Rip through the skies in aerial dogfights. Demolish your environment for a strategic advantage. Harness complete control over every action and movement using the Kinesthetic Combat System. In a war of tanks, fighter jets, and massive combat arsenals, the deadliest weapon is your squad. This is Battlefield 6.', 'M'),
('Megabonk', 'vedinad', '$9.99', 'Megabonk is a roguelike survival game where you must fight your way through hordes of enemies and bosses in randomly generated maps. Grab loot on the way, level up your character, upgrade your weapons and survive for as long as you can! How far can you make it?', 'none');

INSERT INTO user_wishlist (user_id, product_id, date_added, rank)
VALUES (2, 1, '10/19/2025', 1),
		(2, 2, '10/28/2025', 2);

INSERT INTO USER_PURCHASE_HISTORY (productid, accountid, productkey, date_of_purchase)
VALUES (1, 2, '1234', '10/14/25')

INSERT INTO PRODUCT_KEY (productid, key)
VALUES (1, 'E1234'),
		(1, 'J3897')
		(1, 'M23R5'),
		(2, 'K3467');

--VIEW TABLE RECORDS
SELECT * FROM account;
SELECT * FROM PRODUCT --SELECT * PRODUCTS AND KEYS
RIGHT JOIN PRODUCT_KEY ON PRODUCT.id = PRODUCT_KEY.productid;

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






