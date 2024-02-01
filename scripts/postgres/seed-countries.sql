-- seed-countries.sql
-- Make sure the order of columns in the file matches the order in the table

\c auth_api;

COPY countries (name, alpha2Code, alpha3Code, numericCode)
FROM './countries.tsv'
WITH (FORMAT 'csv', HEADER true, DELIMITER E'\t');
