#!/usr/bin/env python3
"""
Simple Database Viewer for Cantik AI
Run: python view_database.py
"""
import sqlite3
import json
from datetime import datetime

def view_database():
    try:
        conn = sqlite3.connect('backend-python/cantik_ai.db')
        cursor = conn.cursor()
        
        print("\n" + "=" * 70)
        print("📊 CANTIK AI DATABASE VIEWER")
        print("=" * 70)
        
        # Users
        print("\n👥 USERS:")
        print("-" * 70)
        cursor.execute("SELECT id, username, email, full_name, created_at FROM users")
        users = cursor.fetchall()
        if users:
            for user in users:
                print(f"  ID: {user[0]:3d} | {user[1]:20s} | {user[2]:30s}")
                print(f"       Name: {user[3] or 'N/A':30s} | Created: {user[4]}")
        else:
            print("  No users found")
        print(f"  📊 Total: {len(users)} users")
        
        # Analyses
        print("\n🔬 ANALYSES:")
        print("-" * 70)
        cursor.execute("""
            SELECT a.id, u.username, a.overall_score, a.skin_type, a.predicted_age, a.created_at 
            FROM analyses a
            JOIN users u ON a.user_id = u.id
            ORDER BY a.created_at DESC 
            LIMIT 10
        """)
        analyses = cursor.fetchall()
        if analyses:
            for analysis in analyses:
                print(f"  ID: {analysis[0]:3d} | User: {analysis[1]:20s} | Score: {analysis[2]:5.1f}%")
                print(f"       Type: {analysis[3] or 'N/A':15s} | Age: {analysis[4] or 'N/A'} | Date: {analysis[5]}")
        else:
            print("  No analyses found")
        
        cursor.execute("SELECT COUNT(*) FROM analyses")
        total_analyses = cursor.fetchone()[0]
        print(f"  📊 Total: {total_analyses} analyses (showing last 10)")
        
        # Articles
        print("\n📰 ARTICLES:")
        print("-" * 70)
        cursor.execute("SELECT id, title, category, status FROM articles LIMIT 10")
        articles = cursor.fetchall()
        if articles:
            for article in articles:
                title = article[1][:50] + "..." if len(article[1]) > 50 else article[1]
                print(f"  ID: {article[0]:3d} | {title:53s}")
                print(f"       Category: {article[2]:15s} | Status: {article[3]:10s}")
        else:
            print("  No articles found")
        
        cursor.execute("SELECT COUNT(*) FROM articles")
        total_articles = cursor.fetchone()[0]
        print(f"  📊 Total: {total_articles} articles (showing first 10)")
        
        # Products
        print("\n🧴 PRODUCTS:")
        print("-" * 70)
        cursor.execute("SELECT id, name, brand, category, price FROM products LIMIT 10")
        products = cursor.fetchall()
        if products:
            for product in products:
                name = product[1][:40] + "..." if len(product[1]) > 40 else product[1]
                print(f"  ID: {product[0]:3d} | {name:43s}")
                print(f"       Brand: {product[2]:20s} | Category: {product[3]:15s} | ${product[4]:.2f}")
        else:
            print("  No products found")
        
        cursor.execute("SELECT COUNT(*) FROM products")
        total_products = cursor.fetchone()[0]
        print(f"  📊 Total: {total_products} products (showing first 10)")
        
        # Statistics
        print("\n📈 STATISTICS:")
        print("-" * 70)
        
        # Average skin score
        cursor.execute("SELECT AVG(overall_score) FROM analyses")
        avg_score = cursor.fetchone()[0]
        if avg_score:
            print(f"  Average Skin Score: {avg_score:.1f}%")
        
        # Most common skin type
        cursor.execute("""
            SELECT skin_type, COUNT(*) as count 
            FROM analyses 
            WHERE skin_type IS NOT NULL 
            GROUP BY skin_type 
            ORDER BY count DESC 
            LIMIT 1
        """)
        common_type = cursor.fetchone()
        if common_type:
            print(f"  Most Common Skin Type: {common_type[0]} ({common_type[1]} analyses)")
        
        # Published articles
        cursor.execute("SELECT COUNT(*) FROM articles WHERE status = 'published'")
        published = cursor.fetchone()[0]
        print(f"  Published Articles: {published}")
        
        # Active products
        cursor.execute("SELECT COUNT(*) FROM products WHERE is_active = 1")
        active_products = cursor.fetchone()[0]
        print(f"  Active Products: {active_products}")
        
        print("\n" + "=" * 70)
        print("✅ Database viewed successfully!")
        print("=" * 70 + "\n")
        
        conn.close()
        
    except sqlite3.Error as e:
        print(f"\n❌ Database Error: {e}")
        print("Make sure the database file exists at: backend-python/cantik_ai.db")
    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    view_database()
