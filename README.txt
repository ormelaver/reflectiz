DOMAIN SCANNER
-----------------
TO RUN:
--------
docker-compose up --build

A domain scanner that triggers every configured amount of time with node-cron.
Users may add domains for scanning and get information about domains.

To add a new scanner:
---------------------
1. Write your scanner class.
2. Add its name to the scanner list on scannerList.ts
3. Add its name to the ScannerType in types/scanner.ts

Involves 4 services:
--------------------
mongodb
rabbitmq
manager service
scanner service

rabbitmq and mongodb are from images from dockerhub

manager service
---------------
in charge of interacting with users: adding domains and fetching their information.
Exposes two endpoints:
GET '/domains/:domainName'
POST '/domains/add'

both enpoints expect a domain in valid format (example.com, example.co.uk, example.org, etc.)
Sub domains will not be accepted.

If a domain doesn't exist, the GET route adds it for scanning.


scanner service
---------------
triggers every configured amount of time (CRON_SCAN_INTERVAL in .env)
In charge of fetching the domains to scan from the database and running the scanners.
Updated results are stored in the domains collection.
Past results are stored in the histories collection.

To avoid overloading the results that are stored in memory, a queue is used.
