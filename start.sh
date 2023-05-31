#!/bin/bash
echo "Building the project..."
yarn run build

echo "Starting the application..."
node dist/main.js
