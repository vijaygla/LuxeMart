import json
from datetime import datetime, timezone
from sqlmodel import SQLModel, Session, select
from app.db.session import engine
from app.models.user import User
from app.models.catalog import Category, Product
from app.models.review import ProductReview
from app.models.order import Order, OrderItem
from app.models.payment import PaymentTransaction
from app.core.security import hash_password

def init_db():
    print("[DB INIT] Creating all database tables in SQL Server...")
    SQLModel.metadata.create_all(engine)
    print("[DB INIT] Tables verified/created successfully.")

    with Session(engine) as db:
        # 1. Seed Admin: Vijay Kumar
        admin_email = "vijaykumar@gmail.com"
        admin_user = db.exec(select(User).where(User.email == admin_email)).first()
        if not admin_user:
            admin_user = User(
                name="Vijay Kumar",
                email=admin_email,
                hashed_password=hash_password("VijayKumar@12345"),
                role="Admin",
                is_active=True
            )
            db.add(admin_user)
            print(f"[DB SEED] Admin user '{admin_email}' seeded.")
        else:
            admin_user.role = "Admin"
            admin_user.hashed_password = hash_password("VijayKumar@12345")
            db.add(admin_user)

        # Seed Demo Customer: Rohan Verma
        cust_email = "rohan@example.com"
        customer_user = db.exec(select(User).where(User.email == cust_email)).first()
        if not customer_user:
            customer_user = User(
                name="Rohan Verma",
                email=cust_email,
                hashed_password=hash_password("Rohan@12345"),
                role="Customer",
                is_active=True
            )
            db.add(customer_user)
            print(f"[DB SEED] Customer user '{cust_email}' seeded.")

        db.commit()
        db.refresh(admin_user)
        if customer_user:
            db.refresh(customer_user)

        # 2. Seed Categories
        categories_data = [
            {
                "name": "Electronics & Gadgets",
                "slug": "electronics-gadgets",
                "description": "Premium smartphones, noise-cancelling headphones, laptops, and smart wearables.",
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
            },
            {
                "name": "Fashion & Apparel",
                "slug": "fashion-apparel",
                "description": "Designer jackets, luxury watches, elegant sunglasses, and streetwear collections.",
                "image_url": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80"
            },
            {
                "name": "Home & Kitchen",
                "slug": "home-kitchen",
                "description": "Modern minimalist interior decor, espresso machines, and ergonomic living solutions.",
                "image_url": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80"
            },
            {
                "name": "Health & Fitness",
                "slug": "health-fitness",
                "description": "High-performance fitness gear, premium yoga mats, smart scales, and recovery equipment.",
                "image_url": "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80"
            },
            {
                "name": "Beauty & Personal Care",
                "slug": "beauty-personal-care",
                "description": "Organic skincare regimens, boutique fragrances, and luxury grooming essentials.",
                "image_url": "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80"
            },
            {
                "name": "Books & Stationery",
                "slug": "books-stationery",
                "description": "Bestselling architectural design books, handcrafted leather journals, and luxury fountain pens.",
                "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"
            }
        ]

        cat_map = {}
        for c_data in categories_data:
            cat = db.exec(select(Category).where(Category.slug == c_data["slug"])).first()
            if not cat:
                cat = Category(**c_data)
                db.add(cat)
                db.commit()
                db.refresh(cat)
            cat_map[c_data["slug"]] = cat.id

        # 3. Seed Products (30+ rich items)
        products_data = [
            # Electronics
            {
                "name": "Sony WH-1000XM5 Noise Cancelling Headphones",
                "slug": "sony-wh-1000xm5",
                "description": "Industry-leading noise cancellation with two processors and 8 microphones. Ultra-comfortable lightweight design with soft fit leather, 30-hour battery life, and crystal clear hands-free calling.",
                "price": 399.99,
                "discount_price": 348.00,
                "category_slug": "electronics-gadgets",
                "stock_quantity": 42,
                "sku": "ELEC-SNY-001",
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
                "additional_images": [
                    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
                    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80"
                ],
                "rating": 4.9,
                "review_count": 128,
                "is_featured": True,
                "specs": {"Driver": "30mm Carbon Fiber", "Battery": "30 Hours", "Bluetooth": "5.2", "Weight": "250g"}
            },
            {
                "name": "Apple MacBook Pro 16-Inch M3 Max",
                "slug": "apple-macbook-pro-16-m3-max",
                "description": "Engineered for beastly workflows. Liquid Retina XDR display with extreme dynamic range, up to 22 hours of battery life, unified memory, and seamless macOS performance.",
                "price": 2499.00,
                "discount_price": 2299.00,
                "category_slug": "electronics-gadgets",
                "stock_quantity": 18,
                "sku": "ELEC-APL-002",
                "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
                "additional_images": [
                    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80"
                ],
                "rating": 5.0,
                "review_count": 89,
                "is_featured": True,
                "specs": {"Chip": "Apple M3 Max", "RAM": "36GB Unified", "Storage": "1TB NVMe SSD", "Display": "16.2-inch XDR"}
            },
            {
                "name": "Fujifilm X-T5 Mirrorless Digital Camera",
                "slug": "fujifilm-x-t5-camera",
                "description": "Fifth-generation X-Trans CMOS 5 HR sensor delivering 40.2MP resolution. Classic tactile dials, 5-axis in-body image stabilization, and iconic film simulation modes.",
                "price": 1699.00,
                "discount_price": 1549.00,
                "category_slug": "electronics-gadgets",
                "stock_quantity": 12,
                "sku": "ELEC-FJI-003",
                "image_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
                "additional_images": [
                    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80"
                ],
                "rating": 4.8,
                "review_count": 64,
                "is_featured": False,
                "specs": {"Sensor": "40.2MP APS-C X-Trans", "Video": "6.2K/30p", "IBIS": "Up to 7 stops", "Weight": "557g"}
            },
            {
                "name": "Keychron Q1 Pro Wireless Mechanical Keyboard",
                "slug": "keychron-q1-pro",
                "description": "Full CNC aluminum body, double-gasket acoustic design, hot-swappable mechanical switches, and programmable VIA/QMK firmware over Bluetooth 5.1.",
                "price": 219.00,
                "discount_price": 189.00,
                "category_slug": "electronics-gadgets",
                "stock_quantity": 35,
                "sku": "ELEC-KCR-004",
                "image_url": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
                "additional_images": [],
                "rating": 4.7,
                "review_count": 45,
                "is_featured": False,
                "specs": {"Layout": "75%", "Switches": "Gateron Jupiter Red", "Connectivity": "Bluetooth + Type-C", "Plate": "Polycarbonate"}
            },
            {
                "name": "Logitech MX Master 3S Ergonomic Mouse",
                "slug": "logitech-mx-master-3s",
                "description": "Iconic quiet click ergonomic mouse with an 8K DPI any-surface glass tracking sensor and ultra-fast MagSpeed electromagnetic scrolling.",
                "price": 99.99,
                "discount_price": 89.99,
                "category_slug": "electronics-gadgets",
                "stock_quantity": 55,
                "sku": "ELEC-LOG-005",
                "image_url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80",
                "additional_images": [],
                "rating": 4.9,
                "review_count": 210,
                "is_featured": True,
                "specs": {"Sensor": "8000 DPI Darkfield", "Battery": "Up to 70 days", "Scroll": "MagSpeed Electro", "Pairs": "3 Devices"}
            },
            {
                "name": "Sonos Era 300 Spatial Audio Speaker",
                "slug": "sonos-era-300",
                "description": "Revolutionary acoustic design featuring six optimally positioned drivers all around the front, sides, and top to support Dolby Atmos Music.",
                "price": 449.00,
                "discount_price": None,
                "category_slug": "electronics-gadgets",
                "stock_quantity": 20,
                "sku": "ELEC-SNS-006",
                "image_url": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
                "additional_images": [],
                "rating": 4.8,
                "review_count": 38,
                "is_featured": False,
                "specs": {"Audio": "Dolby Atmos Spatial", "Voice": "Alexa Built-in", "Connectivity": "WiFi 6, AirPlay 2"}
            },

            # Fashion
            {
                "name": "Classic Italian Calfskin Leather Jacket",
                "slug": "italian-leather-jacket",
                "description": "Handcrafted in Florence using full-grain vegetable-tanned calfskin. Features bespoke antiqued brass hardware, breathable silk-blend lining, and tailored articulated sleeves.",
                "price": 680.00,
                "discount_price": 540.00,
                "category_slug": "fashion-apparel",
                "stock_quantity": 14,
                "sku": "FASH-JCK-001",
                "image_url": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
                "additional_images": [
                    "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&q=80"
                ],
                "rating": 4.9,
                "review_count": 52,
                "is_featured": True,
                "specs": {"Material": "100% Full-grain Calfskin", "Hardware": "Antiqued YKK Excella", "Origin": "Florence, Italy"}
            },
            {
                "name": "Seiko Prospex Automatic Diver's Watch",
                "slug": "seiko-prospex-automatic-watch",
                "description": "ISO-certified 200m diver watch featuring the robust 6R35 automatic caliber with 70-hour power reserve, anti-reflective sapphire crystal, and Lumibrite hands.",
                "price": 750.00,
                "discount_price": 625.00,
                "category_slug": "fashion-apparel",
                "stock_quantity": 9,
                "sku": "FASH-WTC-002",
                "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
                "additional_images": [
                    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80"
                ],
                "rating": 4.9,
                "review_count": 94,
                "is_featured": True,
                "specs": {"Movement": "Caliber 6R35 Auto", "Water Resistance": "200M", "Case": "316L Stainless Steel"}
            },
            {
                "name": "Tom Ford Polarized Aviator Sunglasses",
                "slug": "tom-ford-aviator-sunglasses",
                "description": "Refined aviator styling with signature metal T logo temple insets. Premium gradient polarized lenses providing 100% UV protection with anti-reflective coating.",
                "price": 420.00,
                "discount_price": 360.00,
                "category_slug": "fashion-apparel",
                "stock_quantity": 22,
                "sku": "FASH-GLS-003",
                "image_url": "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
                "additional_images": [],
                "rating": 4.7,
                "review_count": 31,
                "is_featured": False,
                "specs": {"Lens": "Polarized Category 3", "Frame": "Titanium Alloy", "Origin": "Made in Italy"}
            },
            {
                "name": "Cashmere Cable-Knit Crewneck Sweater",
                "slug": "cashmere-cable-knit-sweater",
                "description": "Spun from 100% Mongolian Grade-A cashmere. Exceptionally soft, insulating yet breathable, finished with ribbed collar, cuffs, and hem.",
                "price": 280.00,
                "discount_price": 220.00,
                "category_slug": "fashion-apparel",
                "stock_quantity": 28,
                "sku": "FASH-SWT-004",
                "image_url": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
                "additional_images": [],
                "rating": 4.8,
                "review_count": 41,
                "is_featured": False,
                "specs": {"Fabric": "100% Pure Cashmere", "Gauge": "7-Gauge 2-Ply", "Care": "Dry Clean or Hand Wash"}
            },
            {
                "name": "Heritage Waxed Canvas Duffel Bag",
                "slug": "waxed-canvas-duffel-bag",
                "description": "Heavy-duty 18oz stormproof waxed canvas reinforced with bridle leather trim and solid brass rivets. Water-resistant weekend travel companion.",
                "price": 195.00,
                "discount_price": None,
                "category_slug": "fashion-apparel",
                "stock_quantity": 30,
                "sku": "FASH-BAG-005",
                "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
                "additional_images": [],
                "rating": 4.9,
                "review_count": 67,
                "is_featured": False,
                "specs": {"Volume": "45 Liters", "Fabric": "18oz Cotton Canvas", "Zippers": "YKK Solid Brass"}
            },

            # Home & Kitchen
            {
                "name": "Breville Barista Touch Espresso Machine",
                "slug": "breville-barista-touch",
                "description": "Automated touchscreen simplicity creates cafe-quality third-wave specialty coffee. Integrated conical burr grinder delivers the right amount of coffee on demand.",
                "price": 999.95,
                "discount_price": 849.00,
                "category_slug": "home-kitchen",
                "stock_quantity": 16,
                "sku": "HOME-BRV-001",
                "image_url": "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80",
                "additional_images": [
                    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80"
                ],
                "rating": 4.9,
                "review_count": 112,
                "is_featured": True,
                "specs": {"Heating": "ThermoJet 3-Sec Startup", "Pump": "15 Bar Italian", "Water Tank": "2 Liters"}
            },
            {
                "name": "Le Creuset Enameled Cast Iron Dutch Oven (5.5 Qt)",
                "slug": "le-creuset-dutch-oven-5qt",
                "description": "The French culinary icon. Exceptional heat distribution and retention locks in flavor and moisture for braising, baking sourdough, and slow cooking stews.",
                "price": 420.00,
                "discount_price": 375.00,
                "category_slug": "home-kitchen",
                "stock_quantity": 25,
                "sku": "HOME-LEC-002",
                "image_url": "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
                "additional_images": [],
                "rating": 5.0,
                "review_count": 150,
                "is_featured": True,
                "specs": {"Capacity": "5.5 Qt", "Material": "Enameled Cast Iron", "Oven Safe": "Up to 500°F"}
            },
            {
                "name": "Dyson V15 Detect Absolute Cordless Vacuum",
                "slug": "dyson-v15-detect",
                "description": "Intelligent cordless vacuum engineered with laser illumination to reveal invisible dust, piezo sensor to count particles, and 60 minutes of run time.",
                "price": 749.99,
                "discount_price": 649.99,
                "category_slug": "home-kitchen",
                "stock_quantity": 19,
                "sku": "HOME-DYS-003",
                "image_url": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
                "additional_images": [],
                "rating": 4.8,
                "review_count": 78,
                "is_featured": False,
                "specs": {"Suction": "230 AW", "Filtration": "99.99% to 0.3 microns", "Weight": "3.1 kg"}
            },
            {
                "name": "Handmade Walnut Live-Edge Dining Table",
                "slug": "live-edge-walnut-table",
                "description": "Solid North American black walnut slab featuring preserved natural organic live edges, hand-rubbed zero-VOC matte finish, and industrial matte black steel trapezoid legs.",
                "price": 1450.00,
                "discount_price": 1290.00,
                "category_slug": "home-kitchen",
                "stock_quantity": 6,
                "sku": "HOME-WOD-004",
                "image_url": "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800&q=80",
                "additional_images": [],
                "rating": 4.9,
                "review_count": 22,
                "is_featured": False,
                "specs": {"Wood": "American Black Walnut", "Dimensions": "72\"L x 36\"W x 30\"H", "Capacity": "Seats 6"}
            },
            {
                "name": "Fellow Ode Gen 2 Conical Coffee Grinder",
                "slug": "fellow-ode-gen-2-grinder",
                "description": "Precision home grinder with 64mm professional-grade flat burrs, 31 grind settings, anti-static technology, and single-dose auto-stop.",
                "price": 345.00,
                "discount_price": 299.00,
                "category_slug": "home-kitchen",
                "stock_quantity": 21,
                "sku": "HOME-FLW-005",
                "image_url": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
                "additional_images": [],
                "rating": 4.7,
                "review_count": 48,
                "is_featured": False,
                "specs": {"Burrs": "64mm Stainless Flat", "Settings": "31 Stepped", "Hopper": "100g Single Dose"}
            },

            # Health & Fitness
            {
                "name": "Theragun PRO Gen 5 Percussive Massage Gun",
                "slug": "theragun-pro-gen-5",
                "description": "Professional-grade deep muscle treatment trusted by world-class athletes. QuietForce brushless motor, 16mm amplitude, OLED screen with preset wellness routines.",
                "price": 599.00,
                "discount_price": 499.00,
                "category_slug": "health-fitness",
                "stock_quantity": 24,
                "sku": "FIT-TRG-001",
                "image_url": "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&q=80",
                "additional_images": [],
                "rating": 4.9,
                "review_count": 86,
                "is_featured": True,
                "specs": {"Stall Force": "60 lbs", "Amplitude": "16mm", "Battery": "150 min swappable"}
            },
            {
                "name": "Manduka PRO Yoga & Pilates Mat (6mm)",
                "slug": "manduka-pro-yoga-mat",
                "description": "The ultra-dense, non-slip luxury yoga mat with high-density cushion and closed-cell surface that seals out sweat and moisture. Guaranteed for life.",
                "price": 138.00,
                "discount_price": 118.00,
                "category_slug": "health-fitness",
                "stock_quantity": 40,
                "sku": "FIT-MND-002",
                "image_url": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
                "additional_images": [],
                "rating": 4.8,
                "review_count": 130,
                "is_featured": False,
                "specs": {"Thickness": "6mm", "Dimensions": "71\" x 26\"", "Material": "Eco-certified PVC"}
            },
            {
                "name": "Withings Body Scan Smart Health Station",
                "slug": "withings-body-scan-scale",
                "description": "Advanced segmental body composition scale with 6-lead ECG, vascular age estimation, and nerve health score using retractable handle with electrodes.",
                "price": 399.95,
                "discount_price": 349.00,
                "category_slug": "health-fitness",
                "stock_quantity": 15,
                "sku": "FIT-WTH-003",
                "image_url": "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80",
                "additional_images": [],
                "rating": 4.7,
                "review_count": 42,
                "is_featured": False,
                "specs": {"Sensors": "4 Weight + 4 Handle Electrodes", "Connectivity": "Wi-Fi & Bluetooth", "Battery": "1-year rechargeable"}
            },
            {
                "name": "Bowflex SelectTech 552 Adjustable Dumbbells",
                "slug": "bowflex-selecttech-552",
                "description": "Replaces 15 sets of weights with a turn of a dial. Adjusts from 5 to 52.5 lbs in 2.5 lb increments for progressive strength training at home.",
                "price": 429.00,
                "discount_price": 379.00,
                "category_slug": "health-fitness",
                "stock_quantity": 11,
                "sku": "FIT-BWF-004",
                "image_url": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
                "additional_images": [],
                "rating": 4.9,
                "review_count": 180,
                "is_featured": True,
                "specs": {"Weight Range": "5 to 52.5 lbs per dumbbell", "Plates": "Durable molding", "Warranty": "2 Years"}
            },

            # Beauty & Personal Care
            {
                "name": "Aesop Resurrection Aromatique Hand & Body Balm",
                "slug": "aesop-resurrection-balm",
                "description": "Rich nourishing botanical balm infused with Mandarin Rind, Rosemary Leaf, and Cedar Atlas to deeply hydrate tired skin with a crisp citrus woody aroma.",
                "price": 105.00,
                "discount_price": 89.00,
                "category_slug": "beauty-personal-care",
                "stock_quantity": 50,
                "sku": "BEAU-ASP-001",
                "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
                "additional_images": [],
                "rating": 4.9,
                "review_count": 92,
                "is_featured": False,
                "specs": {"Volume": "500 mL", "Scent": "Citrus, Woody, Herbaceous", "Skin Type": "All Skin Types"}
            },
            {
                "name": "Dyson Supersonic Nural Hair Dryer",
                "slug": "dyson-supersonic-nural",
                "description": "Next-gen intelligent heat control with network of Nural sensors automatically adjusting airflow and temperature to protect scalp barrier and enhance natural shine.",
                "price": 499.00,
                "discount_price": 449.00,
                "category_slug": "beauty-personal-care",
                "stock_quantity": 22,
                "sku": "BEAU-DYS-002",
                "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
                "additional_images": [],
                "rating": 4.8,
                "review_count": 75,
                "is_featured": True,
                "specs": {"Motor": "Dyson V9 Digital", "Sensor": "Time of Flight Nural", "Attachments": "5 Magnetic Styling Heads"}
            },
            {
                "name": "Maison Francis Kurkdjian Baccarat Rouge 540 (70ml)",
                "slug": "baccarat-rouge-540",
                "description": "Luminous and sophisticated eau de parfum. Aerial notes of jasmine and the radiance of saffron carry mineral facets of ambergris and woody cedar accents.",
                "price": 325.00,
                "discount_price": None,
                "category_slug": "beauty-personal-care",
                "stock_quantity": 17,
                "sku": "BEAU-MFK-003",
                "image_url": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=80",
                "additional_images": [],
                "rating": 5.0,
                "review_count": 140,
                "is_featured": True,
                "specs": {"Volume": "70 ml / 2.4 fl oz", "Type": "Eau de Parfum", "Origin": "Paris, France"}
            },
            {
                "name": "Augustinus Bader The Rich Cream (50ml)",
                "slug": "augustinus-bader-rich-cream",
                "description": "Award-winning daily moisturizer powered by proprietary TFC8 technology. Clinically proven to reduce fine lines, redness, and hyperpigmentation.",
                "price": 290.00,
                "discount_price": 250.00,
                "category_slug": "beauty-personal-care",
                "stock_quantity": 27,
                "sku": "BEAU-AGB-004",
                "image_url": "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
                "additional_images": [],
                "rating": 4.8,
                "review_count": 63,
                "is_featured": False,
                "specs": {"Size": "50ml", "Key Complex": "TFC8 Amino Acid Blend", "Finish": "Dewy Rich"}
            },

            # Books & Stationery
            {
                "name": "Taschen: Architecture Now! Collector's Edition",
                "slug": "taschen-architecture-now",
                "description": "Hardcover monumental volume exploring revolutionary contemporary architecture worldwide. Filled with full-color photography, floor plans, and critical essays.",
                "price": 120.00,
                "discount_price": 99.00,
                "category_slug": "books-stationery",
                "stock_quantity": 33,
                "sku": "BOOK-TSH-001",
                "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
                "additional_images": [],
                "rating": 4.9,
                "review_count": 34,
                "is_featured": False,
                "specs": {"Pages": "650 Pages", "Format": "Hardcover Linen", "Publisher": "Taschen"}
            },
            {
                "name": "Montblanc Meisterstück Classique Fountain Pen",
                "slug": "montblanc-meisterstuck-pen",
                "description": "The quintessential icon of writing luxury. Deep black precious resin inlaid with the white Montblanc emblem and hand-crafted 14K gold nib with rhodium-coated inlay.",
                "price": 660.00,
                "discount_price": 580.00,
                "category_slug": "books-stationery",
                "stock_quantity": 8,
                "sku": "BOOK-MTB-002",
                "image_url": "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&q=80",
                "additional_images": [],
                "rating": 5.0,
                "review_count": 47,
                "is_featured": True,
                "specs": {"Nib": "Handcrafted 14K Gold", "Body": "Precious Resin", "Refill": "Piston Converter / Cartridge"}
            },
            {
                "name": "Midori Traveler's Notebook Leather Passport",
                "slug": "midori-travelers-notebook",
                "description": "Vegetable-tanned leather cover crafted in Chiang Mai, Thailand that patinas beautifully with use. Modular refillable design with Japanese fountain-pen friendly MD paper.",
                "price": 65.00,
                "discount_price": None,
                "category_slug": "books-stationery",
                "stock_quantity": 45,
                "sku": "BOOK-MDR-003",
                "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
                "additional_images": [],
                "rating": 4.8,
                "review_count": 58,
                "is_featured": False,
                "specs": {"Leather": "Thai Raw Tannage", "Paper": "Midori MD Bleedproof", "Size": "Passport 134 x 98mm"}
            }
        ]

        for p_data in products_data:
            existing_p = db.exec(select(Product).where(Product.sku == p_data["sku"])).first()
            cat_id = cat_map.get(p_data["category_slug"])
            if not existing_p and cat_id:
                prod = Product(
                    name=p_data["name"],
                    slug=p_data["slug"],
                    description=p_data["description"],
                    price=p_data["price"],
                    discount_price=p_data["discount_price"],
                    category_id=cat_id,
                    stock_quantity=p_data["stock_quantity"],
                    sku=p_data["sku"],
                    image_url=p_data["image_url"],
                    additional_images_json=json.dumps(p_data.get("additional_images", [])),
                    rating=p_data["rating"],
                    review_count=p_data["review_count"],
                    is_featured=p_data["is_featured"],
                    is_active=True,
                    specs_json=json.dumps(p_data.get("specs", {}))
                )
                db.add(prod)
                db.commit()
                db.refresh(prod)

                # Seed 1-2 verified sample customer reviews for rich details
                review1 = ProductReview(
                    product_id=prod.id,
                    user_id=customer_user.id if customer_user else 1,
                    user_name="Rohan Verma",
                    rating=5,
                    comment="Exceptional quality! Exactly as described, fast dispatch and premium packaging."
                )
                db.add(review1)
                db.commit()

        # 4. Seed initial sample order for customer so order history & admin dashboard has real live data
        sample_order = db.exec(select(Order).where(Order.order_number == "ORD-INIT1001")).first()
        if not sample_order and customer_user:
            first_prod = db.exec(select(Product).where(Product.sku == "ELEC-SNY-001")).first()
            if first_prod:
                order = Order(
                    user_id=customer_user.id,
                    order_number="ORD-INIT1001",
                    subtotal_amount=348.00,
                    discount_amount=0.0,
                    shipping_fee=0.0,
                    tax_amount=27.84,
                    total_amount=375.84,
                    status="Delivered",
                    shipping_name="Rohan Verma",
                    shipping_address="42 Cyber City, DLF Phase 2",
                    shipping_city="Gurugram",
                    shipping_state="Haryana",
                    shipping_postal_code="122002",
                    shipping_phone="+91 9876543210",
                    payment_method="Credit Card",
                    payment_status="Paid"
                )
                db.add(order)
                db.commit()
                db.refresh(order)

                order_item = OrderItem(
                    order_id=order.id,
                    product_id=first_prod.id,
                    product_name=first_prod.name,
                    product_image=first_prod.image_url,
                    quantity=1,
                    unit_price=348.00,
                    total_price=348.00
                )
                db.add(order_item)

                pay_tx = PaymentTransaction(
                    order_id=order.id,
                    user_id=customer_user.id,
                    transaction_reference="TXN-INIT1001-SUCCESS",
                    amount=375.84,
                    payment_method="Credit Card",
                    status="Success",
                    gateway_response_json=json.dumps({"gateway": "LuxeMart Gateway", "code": "AUTH_OK"})
                )
                db.add(pay_tx)
                db.commit()
                print("[DB SEED] Sample order 'ORD-INIT1001' seeded.")

    print("[DB INIT] Database initialization and rich seeding completed!")

if __name__ == "__main__":
    init_db()
