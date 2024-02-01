INSERT INTO "PropertyTypes" ("land", "landDetails", "apartment", "apartmentDetails", "house", "houseDetails", "createdAt", "updatedAt") VALUES
(true, '{"size": "500 sqm", "location": "rural"}', false, NULL, false, NULL, NOW(), NOW()),
(false, NULL, true, '{"floors": 2, "amenities": ["pool", "gym"]}', false, NULL, NOW(), NOW()),
(false, NULL, false, NULL, true, '{"size": "300 sqm", "garage": true}', NOW(), NOW());
