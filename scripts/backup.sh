#!/bin/bash

# MongoDB backup script
# Usage: ./backup.sh [MONGODB_URI] [BACKUP_DIR]

DB_URI=${1:-"mongodb://localhost:27017/sweetshop"}
BACKUP_PARENT_DIR=${2:-"./backups"}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="$BACKUP_PARENT_DIR/backup_$TIMESTAMP"

echo "📂 Initializing MongoDB Backup..."
echo "🔗 Connection String: $DB_URI"
echo "📍 Target Directory: $BACKUP_DIR"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Execute mongodump
mongodump --uri="$DB_URI" --out="$BACKUP_DIR"

if [ $? -eq 0 ]; then
  echo "✅ Backup Completed Successfully!"
  echo "📦 Location: $BACKUP_DIR"
else
  echo "❌ Backup Failed. Please check connectivity or parameters."
  exit 1
fi
