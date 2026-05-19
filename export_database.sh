#!/bin/bash

# Database Export Script for BSEntrepSystem (Linux/Mac)
# This script exports your local MySQL database for Railway deployment

echo ""
echo "========================================"
echo " Database Export Script"
echo "========================================"
echo ""

# Set variables - adjust if needed
MYSQL_USER="root"
MYSQL_HOST="127.0.0.1"
DB_NAME="capstter"
OUTPUT_FILE="capstter_backup_$(date +%Y%m%d_%H%M%S).sql"

echo "Exporting database: $DB_NAME"
echo "Output file: $OUTPUT_FILE"
echo ""
echo "NOTE: You will be prompted to enter the MySQL password."
echo "If your password is empty, just press Enter."
echo ""

# Export database
mysqldump -u "$MYSQL_USER" -h "$MYSQL_HOST" -p "$DB_NAME" > "$OUTPUT_FILE"

if [ $? -ne 0 ]; then
    echo ""
    echo "ERROR: Export failed! Check your MySQL credentials."
    exit 1
fi

echo ""
echo "========================================"
echo " SUCCESS!"
echo "========================================"
echo ""
echo "Database exported successfully!"
echo ""
echo "File: $OUTPUT_FILE"
echo "Size: $(du -h "$OUTPUT_FILE" | cut -f1)"
echo ""
echo "Next steps:"
echo "1. Create MySQL plugin in Railway"
echo "2. Connect to Railway MySQL"
echo "3. Import this file:"
echo "   railway connect --service mysql"
echo "   SOURCE $OUTPUT_FILE"
echo ""
