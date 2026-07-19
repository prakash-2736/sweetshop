#!/bin/bash

# MongoDB restore script
# Usage: ./restore.sh <BACKUP_DIR_PATH> [MONGODB_URI]

BACKUP_DIR=$1
DB_URI=${2:-"mongodb://localhost:27017/sweetshop"}

if [ -z "$BACKUP_DIR" ]; then
  echo "❌ Error: Backup directory path is required."
  echo "Usage: ./restore.sh <BACKUP_DIR_PATH> [MONGODB_URI]"
  exit 1
fi

if [ ! -d "$BACKUP_DIR" ]; then
  echo "❌ Error: Directory '$BACKUP_DIR' does not exist."
  exit 1
fi

echo "🔄 Restoring MongoDB Database..."
echo "📂 Source Directory: $BACKUP_DIR"
echo "🔗 Connection String: $DB_URI"

# Execute mongorestore
mongorestore --uri="$DB_URI" "$BACKUP_DIR"

if [ $? -eq 0 ]; then
  echo "✅ Database Restored Successfully!"
else
  echo "❌ Restore Failed. Please verify parameters or connection."
  exit 1
fi
