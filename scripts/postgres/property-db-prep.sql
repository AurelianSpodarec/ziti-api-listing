-- Create the 'property_api' database
CREATE DATABASE property_api
WITH OWNER = property
ENCODING = 'UTF8'
LC_COLLATE = 'en_US.utf8'
LC_CTYPE = 'en_US.utf8'
TEMPLATE template0;

-- Grant privileges to the user 'property'
GRANT ALL PRIVILEGES ON DATABASE property_api TO property;

-- Connect to the 'property_api' database
\c property_api;

-- Create UUID extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Quit the psql client
\q
