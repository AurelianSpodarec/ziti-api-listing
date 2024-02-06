-- Create the 'listing_api' database
CREATE DATABASE listing_api
WITH OWNER = listing
ENCODING = 'UTF8'
LC_COLLATE = 'en_US.utf8'
LC_CTYPE = 'en_US.utf8'
TEMPLATE template0;

-- Grant privileges to the user 'listing'
GRANT ALL PRIVILEGES ON DATABASE listing_api TO listing;

-- Connect to the 'listing_api' database
\c listing_api;

-- Create UUID extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Quit the psql client
\q
