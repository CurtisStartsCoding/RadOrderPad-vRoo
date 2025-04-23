#!/bin/bash
echo "===== Inserting Test Data into Production Database ====="
node insert-test-data.js
echo "===== Test Data Insertion Complete ====="
read -p "Press any key to continue..."