#!/bin/bash

cat sql/create-tables.sql | docker compose exec -T mysql mysql --user=root --password=rootpassword