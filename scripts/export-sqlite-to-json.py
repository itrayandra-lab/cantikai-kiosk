#!/usr/bin/env python3
"""
Export SQLite data to JSON for IndexedDB import
"""
import sqlite3
import json
import sys
from pathlib import Path

# Database path
DB_PATH = Path(__file__).parent.parent / 'backend-python' / 'cantik_ai.db'
OUTPUT_DIR = Path(__file__).parent.parent / 'public' / 'data'

def export_table(cursor, table_name):
    """Export a table to list of dicts"""
    cursor.execute(f"SELECT * FROM {table_name}")
    columns = [description[0] for description in cursor.description]
    rows = cursor.fetchall()
    
    return [dict(zip(columns, row)) for row in rows]

def main():
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Connect to database
    conn = sqlite3.connect(str(DB_PATH))
    cursor = conn.cursor()
    
    # Export tables
    tables_to_export = ['users', 'products', 'articles', 'banners']
    
    for table in tables_to_export:
        try:
            data = export_table(cursor, table)
            output_file = OUTPUT_DIR / f'{table}.json'
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            print(f'✅ Exported {len(data)} rows from {table} to {output_file}')
        except Exception as e:
            print(f'❌ Error exporting {table}: {e}')
    
    conn.close()
    print('\n✅ Export complete!')

if __name__ == '__main__':
    main()
