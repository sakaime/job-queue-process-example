#!/bin/bash

aws sqs purge-queue --queue-url http://localhost:9324/queue/greetings --endpoint-url http://localhost:9324