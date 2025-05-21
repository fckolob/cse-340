-- Assignment 2 queries.

-- Query 1.

INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starknet.com', 'Iam1ronM@n');

-- Query 2.

UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = (SELECT account_id FROM public.account WHERE account_firstname = 'Tony' AND account_lastname = 'Stark');

-- Query 3.

DELETE FROM public.account
WHERE account_id = (SELECT account_id FROM public.account WHERE account_firstname = 'Tony' AND account_lastname = 'Stark');

-- Query 4.

UPDATE public.inventory
SET inv_description = REPLACE(inv_description,'small interiors', 'a huge interior')
WHERE inv_id = (SELECT inv_id FROM public.inventory WHERE inv_make = 'GM' AND inv_model = 'Hummer');

-- Query 5.

SELECT inv_make, inv_model, classification_name
FROM public.classification INNER JOIN public.inventory
ON public.inventory.classification_id = public.classification.classification_id
WHERE classification_name = 'Sport';

-- Query 6.

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');
