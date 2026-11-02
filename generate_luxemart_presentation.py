import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette Definitions
    COLOR_NAVY_DARK   = RGBColor(10, 25, 47)       # #0A192F Deep Navy
    COLOR_NAVY_CARD   = RGBColor(17, 34, 64)       # #112240 Dark Card
    COLOR_SLATE_BG    = RGBColor(248, 250, 252)    # #F8FAFC Clean Light BG
    COLOR_WHITE       = RGBColor(255, 255, 255)
    COLOR_CARD_BORDER = RGBColor(226, 232, 240)    # #E2E8F0 Subtle Border
    COLOR_TEXT_DARK   = RGBColor(15, 23, 42)       # #0F172A Slate 900
    COLOR_TEXT_BODY   = RGBColor(51, 65, 85)       # #334155 Slate 700
    COLOR_TEXT_MUTED  = RGBColor(100, 116, 139)    # #64748B Slate 500
    COLOR_GOLD        = RGBColor(217, 119, 6)      # #D97706 Luxury Amber/Gold
    COLOR_GOLD_LIGHT  = RGBColor(254, 243, 199)    # #FEF3C7 Soft Gold Fill
    COLOR_BLUE        = RGBColor(37, 99, 235)      # #2563EB Capgemini / Accent Blue
    COLOR_BLUE_LIGHT  = RGBColor(239, 246, 255)    # #EFF6FF Soft Blue Fill
    COLOR_CYAN        = RGBColor(14, 165, 233)     # #0EA5E9 Vibrant Cyan
    COLOR_EMERALD     = RGBColor(16, 185, 129)     # #10B981 Emerald Green
    COLOR_EMERALD_BG  = RGBColor(236, 253, 245)    # #ECFDF5 Light Green
    COLOR_ROSE        = RGBColor(225, 29, 72)      # #E11D48 Rose Accent

    FONT_TITLE = "Arial"
    FONT_BODY = "Arial"
    TOTAL_SLIDES = 16

    def add_header(slide, tag_text, title_text, subtitle_text, dark_mode=False):
        # Category Tag Badge
        tag_box = slide.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE,
            Inches(0.8), Inches(0.42), Inches(3.2), Inches(0.30)
        )
        tag_box.fill.solid()
        tag_box.fill.fore_color.rgb = COLOR_GOLD_LIGHT if not dark_mode else RGBColor(30, 41, 59)
        tag_box.line.color.rgb = COLOR_GOLD
        tag_box.line.width = Pt(1)
        tf = tag_box.text_frame
        tf.word_wrap = True
        tf.margin_top = tf.margin_bottom = tf.margin_left = tf.margin_right = 0
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = tag_text.upper()
        p.font.name = FONT_BODY
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_GOLD

        # Slide Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.78), Inches(11.733), Inches(0.52))
        tf = title_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.name = FONT_TITLE
        p.font.size = Pt(21)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE if dark_mode else COLOR_TEXT_DARK

        # Subtitle
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.34), Inches(11.733), Inches(0.35))
        tf = sub_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = subtitle_text
        p.font.name = FONT_BODY
        p.font.size = Pt(11)
        p.font.color.rgb = RGBColor(148, 163, 184) if dark_mode else COLOR_TEXT_MUTED

    def add_footer(slide, slide_num, total_slides=TOTAL_SLIDES, dark_mode=False):
        # Footer line
        line = slide.shapes.add_shape(
            MSO_SHAPE.RECTANGLE,
            Inches(0.8), Inches(7.02), Inches(11.733), Inches(0.015)
        )
        line.fill.solid()
        line.fill.fore_color.rgb = RGBColor(51, 65, 85) if dark_mode else COLOR_CARD_BORDER
        line.line.fill.background()

        # Footer Left text
        left_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.08), Inches(8.5), Inches(0.3))
        tf = left_box.text_frame
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = "LuxeMart Enterprise E-Commerce & Grounded AI Concierge  |  Capgemini L1 Architecture Review"
        p.font.name = FONT_BODY
        p.font.size = Pt(9.5)
        p.font.color.rgb = RGBColor(148, 163, 184) if dark_mode else COLOR_TEXT_MUTED

        # Footer Right slide number
        right_box = slide.shapes.add_textbox(Inches(9.5), Inches(7.08), Inches(3.033), Inches(0.3))
        tf = right_box.text_frame
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.RIGHT
        p.text = f"Slide {slide_num:02d} of {total_slides:02d}"
        p.font.name = FONT_BODY
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_GOLD if dark_mode else COLOR_BLUE

    def create_card(slide, left, top, width, height, bg_color=COLOR_WHITE, border_color=COLOR_CARD_BORDER, border_width=1):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        if border_color:
            card.line.color.rgb = border_color
            card.line.width = Pt(border_width)
        else:
            card.line.fill.background()
        return card

    # =========================================================================
    # SLIDE 1: TITLE SLIDE (Executive Dark Theme Hero)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    bg1 = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = COLOR_NAVY_DARK
    bg1.line.fill.background()

    top_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.12))
    top_bar.fill.solid()
    top_bar.fill.fore_color.rgb = COLOR_GOLD
    top_bar.line.fill.background()

    # Tag Badge
    badge1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(0.85), Inches(3.8), Inches(0.35))
    badge1.fill.solid()
    badge1.fill.fore_color.rgb = RGBColor(26, 38, 57)
    badge1.line.color.rgb = COLOR_GOLD
    badge1.line.width = Pt(1.2)
    tf = badge1.text_frame
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "CAPGEMINI L1 ARCHITECTURE REVIEW"
    p.font.name = FONT_BODY
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    # Main Title (Single Text Box with calibrated heights)
    t_box = slide1.shapes.add_textbox(Inches(1.0), Inches(1.35), Inches(11.333), Inches(1.8))
    tf = t_box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    p.text = "LuxeMart: Enterprise Full-Stack E-Commerce"
    p.font.name = FONT_TITLE
    p.font.size = Pt(34)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE

    p2 = tf.add_paragraph()
    p2.space_before = Pt(4)
    p2.text = "& Grounded Generative AI Concierge"
    p2.font.name = FONT_TITLE
    p2.font.size = Pt(28)
    p2.font.bold = True
    p2.font.color.rgb = COLOR_GOLD

    # Description
    desc_box = slide1.shapes.add_textbox(Inches(1.0), Inches(3.1), Inches(11.333), Inches(0.65))
    tf = desc_box.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    p = tf.paragraphs[0]
    p.text = "A production-grade luxury commerce platform fusing rigid transactional integrity (SQL Server 2022) with zero-hallucination dynamic catalog grounding via the Capgemini Generative Engine."
    p.font.name = FONT_BODY
    p.font.size = Pt(12.5)
    p.font.color.rgb = RGBColor(203, 213, 225)

    # 4 Tech Pills
    tech_items = [
        ("Angular 21", "Zoneless Signals & SSR"),
        ("FastAPI 0.115", "Python 3.12 & Async"),
        ("MS SQL Server 2022", "PyODBC & ACID 3NF"),
        ("Capgemini GenEngine", "GPT-5, Claude 4.5, Phi-4")
    ]
    pill_w = Inches(2.65)
    for i, (tech_title, tech_sub) in enumerate(tech_items):
        px = Inches(1.0) + i * Inches(2.88)
        p_card = create_card(slide1, px, Inches(4.0), pill_w, Inches(1.15), bg_color=COLOR_NAVY_CARD, border_color=RGBColor(51, 65, 85))
        tf = p_card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = tech_title
        p.font.name = FONT_TITLE
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = COLOR_CYAN

        p_sub = tf.add_paragraph()
        p_sub.alignment = PP_ALIGN.CENTER
        p_sub.space_before = Pt(4)
        p_sub.text = tech_sub
        p_sub.font.name = FONT_BODY
        p_sub.font.size = Pt(10)
        p_sub.font.color.rgb = RGBColor(148, 163, 184)

    # Author Metadata Card
    meta_card = create_card(slide1, Inches(1.0), Inches(5.55), Inches(11.333), Inches(0.95), bg_color=RGBColor(15, 23, 42), border_color=COLOR_GOLD, border_width=1)
    tf = meta_card.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "Architect & Lead: Vijay Kumar   |   Enterprise Review Track: Full-Stack & Generative AI   |   Framework: Capgemini GenAI Engine"
    p.font.name = FONT_BODY
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = COLOR_WHITE
    p.alignment = PP_ALIGN.CENTER

    p_sub = tf.add_paragraph()
    p_sub.space_before = Pt(3)
    p_sub.text = "Validated Environment: Windows 11 / MSSQL LIN-5CD6268KRS / Python 3.12 / Node 20 / Angular 21"
    p_sub.font.name = FONT_BODY
    p_sub.font.size = Pt(9.5)
    p_sub.font.color.rgb = COLOR_GOLD
    p_sub.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 2: EXECUTIVE SUMMARY & STRATEGIC VALUE
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    bg2 = slide2.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg2.fill.solid()
    bg2.fill.fore_color.rgb = COLOR_SLATE_BG
    bg2.line.fill.background()

    add_header(slide2, "Executive Overview", "Executive Summary & Strategic Vision", "Bridging enterprise transactional rigor with next-generation conversational commerce intelligence.")
    add_footer(slide2, 2)

    # Left Column: Problem & Challenge (Card)
    card_prob = create_card(slide2, Inches(0.8), Inches(1.85), Inches(5.65), Inches(4.95), bg_color=COLOR_WHITE)
    tf = card_prob.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "THE E-COMMERCE DILEMMA"
    p.font.name = FONT_TITLE
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_ROSE

    bullets_prob = [
        ("Disconnected AI Chatbots", "Standard e-commerce chatbots hallucinate non-existent inventory, incorrect prices, or expired discount codes, destroying buyer trust."),
        ("Monolithic Architectural Debt", "Traditional legacy suites struggle with high catalog read latency, tight presentation coupling, and poor mobile/desktop responsiveness."),
        ("Inventory & Settlement Friction", "Concurrency race conditions cause over-ordering, inconsistent cart calculation, and lack of clear milestone delivery tracking."),
        ("Operational Visibility Gaps", "Store operators lack unified administrative controls, instant KPI telemetry, and direct inventory fulfillment workflows.")
    ]
    for b_title, b_desc in bullets_prob:
        p_item = tf.add_paragraph()
        p_item.space_before = Pt(12)
        p_item.text = f"•  {b_title}: {b_desc}"
        p_item.font.name = FONT_BODY
        p_item.font.size = Pt(10)
        p_item.font.color.rgb = COLOR_TEXT_BODY

    # Right Column: The LuxeMart Solution & Value (Card)
    card_sol = create_card(slide2, Inches(6.8), Inches(1.85), Inches(5.733), Inches(4.95), bg_color=COLOR_WHITE)
    tf = card_sol.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "THE LUXEMART ARCHITECTURAL SOLUTION"
    p.font.name = FONT_TITLE
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE

    bullets_sol = [
        ("Zero-Hallucination AI Grounding", "Dynamic injection of active SQL Server records into Capgemini Generative Engine prompts guarantees 100% truthful prices, stock, and orders."),
        ("Decoupled Headless Topology", "Angular 21 signals-based frontend paired with FastAPI asynchronous backend achieves sub-150ms catalog responses."),
        ("ACID-Strict Transactional Core", "Microsoft SQL Server 2022 guarantees atomic stock decrementing, foreign key integrity, and multi-gateway payment logging."),
        ("Enterprise Dual-Persona Portal", "Seamless customer discovery journey alongside an executive admin dashboard with real-time gross revenue, order fulfillment, and low-stock alerts.")
    ]
    for b_title, b_desc in bullets_sol:
        p_item = tf.add_paragraph()
        p_item.space_before = Pt(12)
        p_item.text = f"✔  {b_title}: {b_desc}"
        p_item.font.name = FONT_BODY
        p_item.font.size = Pt(10)
        p_item.font.color.rgb = COLOR_TEXT_BODY

    # =========================================================================
    # SLIDE 3: VISUAL PLATFORM ECOSYSTEM SHOWCASE (Banner Feature)
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    bg3 = slide3.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg3.fill.solid()
    bg3.fill.fore_color.rgb = COLOR_NAVY_DARK
    bg3.line.fill.background()

    add_header(slide3, "Visual Architecture Showcase", "LuxeMart Enterprise Ecosystem & AI Waves", "Integrated visual topology showcasing GenAI neural waves, real-time analytics, and secure commerce.", dark_mode=True)
    add_footer(slide3, 3, dark_mode=True)

    banner_path = os.path.abspath("luxemart_poster_banner.jpg")
    if os.path.exists(banner_path):
        # Embed the banner image in 16:9 proportion
        slide3.shapes.add_picture(
            banner_path,
            Inches(0.8), Inches(1.8), Inches(8.5), Inches(4.74)
        )

    # Right side 3 Callout Cards
    side_cards = [
        ("NEURAL GENAI WAVES", COLOR_CYAN, "Grounds Capgemini LLMs directly with live SQL Server tables, delivering conversational discovery without hallucinated prices or phantom stock."),
        ("ENTERPRISE INFRASTRUCTURE", COLOR_GOLD, "FastAPI async micro-engine paired with Microsoft SQL Server 2022 ACID transactions guarantees atomic inventory locks & P95 < 150ms catalog lookups."),
        ("OMNICHANNEL PORTAL", COLOR_EMERALD, "Seamless responsive Angular 21 interface serving both customers (faceted search, live cart) and administrators (KPI telemetry, inventory CRUD).")
    ]
    sy_start = Inches(1.8)
    for i, (stitle, scol, sdesc) in enumerate(side_cards):
        sy = sy_start + i * Inches(1.65)
        scard = create_card(slide3, Inches(9.5), sy, Inches(3.033), Inches(1.5), bg_color=COLOR_NAVY_CARD, border_color=scol, border_width=1)
        tf = scard.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = Inches(0.12)
        tf.margin_top = tf.margin_bottom = Inches(0.1)
        p = tf.paragraphs[0]
        p.text = stitle
        p.font.name = FONT_TITLE
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = scol

        p_desc = tf.add_paragraph()
        p_desc.space_before = Pt(4)
        p_desc.text = sdesc
        p_desc.font.name = FONT_BODY
        p_desc.font.size = Pt(8.8)
        p_desc.font.color.rgb = RGBColor(203, 213, 225)

    # =========================================================================
    # SLIDE 4: ARCHITECTURAL PRINCIPLES & INNOVATION
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    bg4 = slide4.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg4.fill.solid()
    bg4.fill.fore_color.rgb = COLOR_SLATE_BG
    bg4.line.fill.background()

    add_header(slide4, "System Principles", "Architectural Pillars & Core Innovations", "Engineered around four foundational pillars ensuring high scalability, data consistency, and intelligent discovery.")
    add_footer(slide4, 4)

    pillars = [
        ("1. Layered Modular Separation", COLOR_BLUE, [
            ("Strict Decoupling", "Frontend presentation, API gateway, business services, and database persistence operate in isolated modular boundaries."),
            ("Domain-Driven Routers", "Dedicated FastAPI routers for user, catalog, cart, order, payment, admin, and AI domains."),
            ("Maintainability", "Clean separation allows independent scaling, testing, and continuous deployment of micro-services.")
        ]),
        ("2. Real-Time DB Grounding", COLOR_GOLD, [
            ("Zero-Hallucination Context", "Dynamic database queries fetch live items, active pricing, and user orders directly into the LLM system prompt."),
            ("In-Chat Action Cards", "Special prompt syntax parses suggested product IDs and renders interactive 'Add to Bag' cards in the chat UI."),
            ("4 Foundation LLMs", "Runtime model switching across GPT-5, Claude 4.5 Sonnet, Phi-4 Mini, and Mistral 7B.")
        ]),
        ("3. Strict ACID & Concurrency", COLOR_EMERALD, [
            ("SQL Server 2022 Engine", "Relational 3NF integrity with foreign keys, unique constraints, and PyODBC connection pool with fast_executemany."),
            ("Atomic Stock Locking", "Inventory decrements atomically upon order placement to eliminate overselling and race conditions."),
            ("Auditable Transactions", "Every settlement creates a unique reference tracking status, gateway payloads, and timestamps.")
        ]),
        ("4. Stateless RBAC & Security", COLOR_NAVY_DARK, [
            ("Dual-Layer RBAC", "Role claims embedded in JWT tokens (Admin vs Customer), verified on both Angular route guards and FastAPI dependencies."),
            ("Bcrypt Salted Hashing", "Zero plain-text storage; cryptographic password hashing for all user accounts."),
            ("SQL Injection Immunity", "100% parameterized queries via SQLAlchemy/SQLModel ORM layer.")
        ])
    ]

    col_w = Inches(2.78)
    for i, (p_title, p_color, p_items) in enumerate(pillars):
        px = Inches(0.8) + i * Inches(2.98)
        card = create_card(slide4, px, Inches(1.85), col_w, Inches(4.95), bg_color=COLOR_WHITE)
        
        # Header banner inside card
        card_hdr = slide4.shapes.add_shape(MSO_SHAPE.RECTANGLE, px, Inches(1.85), col_w, Inches(0.55))
        card_hdr.fill.solid()
        card_hdr.fill.fore_color.rgb = p_color
        card_hdr.line.fill.background()
        tf = card_hdr.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = p_title
        p.font.name = FONT_TITLE
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE

        # Content
        content_box = slide4.shapes.add_textbox(px + Inches(0.12), Inches(2.45), col_w - Inches(0.24), Inches(4.2))
        tf = content_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        for idx, (head, body) in enumerate(p_items):
            p_item = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
            if idx > 0:
                p_item.space_before = Pt(10)
            p_item.text = f"•  {head}\n"
            p_item.font.name = FONT_BODY
            p_item.font.size = Pt(10)
            p_item.font.bold = True
            p_item.font.color.rgb = COLOR_TEXT_DARK

            p_desc = tf.add_paragraph()
            p_desc.text = body
            p_desc.font.name = FONT_BODY
            p_desc.font.size = Pt(9.2)
            p_desc.font.color.rgb = COLOR_TEXT_BODY

    # =========================================================================
    # SLIDE 5: END-TO-END SYSTEM TOPOLOGY & ARCHITECTURE
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    bg5 = slide5.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg5.fill.solid()
    bg5.fill.fore_color.rgb = COLOR_SLATE_BG
    bg5.line.fill.background()

    add_header(slide5, "System Topology", "High-Level Architecture & End-to-End Topology", "Physical and logical tiering orchestrating the client, API gateway, database, and enterprise AI engines.")
    add_footer(slide5, 5)

    tiers = [
        ("1. Presentation Tier (Port 4200)", "Angular 21 Client (SPA / SSR)", COLOR_BLUE, [
            "Zoneless Signals architecture for fine-grained reactive DOM rendering.",
            "Standalone components with SCSS luxury tokens & responsive viewports.",
            "Dynamic floating AI Concierge widget with real-time message streaming.",
            "Client HTTP Interceptors handling JWT injection and unauthorized refreshes."
        ]),
        ("2. Application Gateway Tier (Port 8000)", "FastAPI 0.115 Async Micro-Engine", COLOR_GOLD, [
            "High-throughput ASGI server powered by Uvicorn and Python 3.12.",
            "CORS & Security Middleware validating stateless JWT Bearer tokens.",
            "Domain Routers: /catalog, /cart, /order, /payment, /admin, /ai.",
            "Pydantic v2 input contract validation with automated OpenAPI/Swagger generation."
        ]),
        ("3. Relational Persistence Tier", "Microsoft SQL Server 2022 (ECommerceDb)", COLOR_EMERALD, [
            "PyODBC 5.3+ high-performance connection pooling with fast_executemany.",
            "SQLModel ORM mapping 7 core entities with strict referential constraints.",
            "ACID transactional boundaries ensuring synchronized inventory and order states.",
            "Pre-seeded with 6 luxury taxonomies, 27+ products, specs, and verified reviews."
        ]),
        ("4. External Intelligence Tier", "Capgemini Generative Engine REST Gateway", COLOR_NAVY_DARK, [
            "Secure enterprise endpoint: https://openai.generative.engine.capgemini.com/v1.",
            "Multi-model execution: openai.gpt-5, claude-sonnet-4-5, phi-4-mini, mistral-7b.",
            "Catalog-grounded prompt assembly providing zero-hallucination luxury assistance.",
            "Structured response parsing extracting suggested product IDs directly into cards."
        ])
    ]

    t_w = Inches(5.65)
    t_h = Inches(2.32)
    coords = [
        (Inches(0.8), Inches(1.85)),
        (Inches(6.8), Inches(1.85)),
        (Inches(0.8), Inches(4.45)),
        (Inches(6.8), Inches(4.45))
    ]

    for (t_head, t_sub, t_col, t_bullets), (cx, cy) in zip(tiers, coords):
        card = create_card(slide5, cx, cy, t_w, t_h, bg_color=COLOR_WHITE)
        
        # Color bar on the left
        bar = slide5.shapes.add_shape(MSO_SHAPE.RECTANGLE, cx, cy, Inches(0.12), t_h)
        bar.fill.solid()
        bar.fill.fore_color.rgb = t_col
        bar.line.fill.background()

        tb = slide5.shapes.add_textbox(cx + Inches(0.25), cy + Inches(0.1), t_w - Inches(0.4), t_h - Inches(0.2))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = t_head
        p.font.name = FONT_TITLE
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = t_col

        p_sub = tf.add_paragraph()
        p_sub.text = t_sub
        p_sub.font.name = FONT_BODY
        p_sub.font.size = Pt(10)
        p_sub.font.bold = True
        p_sub.font.color.rgb = COLOR_TEXT_DARK

        for b in t_bullets:
            p_b = tf.add_paragraph()
            p_b.space_before = Pt(3)
            p_b.text = f"• {b}"
            p_b.font.name = FONT_BODY
            p_b.font.size = Pt(9.3)
            p_b.font.color.rgb = COLOR_TEXT_BODY

    # =========================================================================
    # SLIDE 6: FULL-STACK TECHNOLOGY STACK BREAKDOWN
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    bg6 = slide6.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg6.fill.solid()
    bg6.fill.fore_color.rgb = COLOR_SLATE_BG
    bg6.line.fill.background()

    add_header(slide6, "Technology Stack", "Enterprise Full-Stack Technology Stack", "Carefully curated modern tech stack optimizing developer velocity, runtime efficiency, and UI aesthetics.")
    add_footer(slide6, 6)

    stack_cards = [
        ("FRONTEND LAYER", COLOR_BLUE, [
            ("Framework", "Angular 21 (Latest Standalone)"),
            ("State & Reactivity", "Angular Zoneless Signals"),
            ("Styling System", "Modular SCSS Luxury Tokens"),
            ("Iconography", "Remixicon 4.2 Library"),
            ("Typography", "Outfit & Plus Jakarta Sans"),
            ("HTTP Client", "Angular ProvideHttpClient & Interceptors")
        ]),
        ("BACKEND ENGINE", COLOR_GOLD, [
            ("Runtime / Core", "Python 3.12 (64-bit)"),
            ("Web Framework", "FastAPI 0.115+ (Async)"),
            ("ASGI Server", "Uvicorn (High Throughput)"),
            ("Data Contracts", "Pydantic v2 Serialization"),
            ("Authentication", "PyJWT (HS256) + Passlib / Bcrypt"),
            ("HTTP Engine", "HTTPX Async & Requests")
        ]),
        ("DATA & PERSISTENCE", COLOR_EMERALD, [
            ("RDBMS", "Microsoft SQL Server 2022"),
            ("Driver", "ODBC Driver 18 for SQL Server"),
            ("ORM Engine", "SQLModel / SQLAlchemy 2.0"),
            ("DB Pooling", "PyODBC 5.3+ (Connection Pool)"),
            ("Optimization", "fast_executemany batching"),
            ("Schema Design", "3rd Normal Form (3NF) Relational")
        ]),
        ("AI & INTEGRATION", COLOR_NAVY_DARK, [
            ("AI Gateway", "Capgemini Generative Engine"),
            ("Endpoint", "/v1/chat/completions (REST)"),
            ("Flagship Model", "OpenAI GPT-5"),
            ("Reasoning Model", "Phi-4 Mini Reasoning"),
            ("Claude Model", "Anthropic Claude 3.5/4.5 Sonnet"),
            ("Open Model", "Mistral 7B Instruct v0.2")
        ])
    ]

    s_w = Inches(2.78)
    for i, (s_title, s_col, s_details) in enumerate(stack_cards):
        sx = Inches(0.8) + i * Inches(2.98)
        card = create_card(slide6, sx, Inches(1.85), s_w, Inches(4.95), bg_color=COLOR_WHITE)
        
        hdr = slide6.shapes.add_shape(MSO_SHAPE.RECTANGLE, sx, Inches(1.85), s_w, Inches(0.55))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = s_col
        hdr.line.fill.background()
        tf = hdr.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = s_title
        p.font.name = FONT_TITLE
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE

        tb = slide6.shapes.add_textbox(sx + Inches(0.15), Inches(2.45), s_w - Inches(0.3), Inches(4.2))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        for idx, (prop, val) in enumerate(s_details):
            p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
            if idx > 0:
                p.space_before = Pt(8)
            p.text = f"{prop}:\n"
            p.font.name = FONT_BODY
            p.font.size = Pt(9.5)
            p.font.bold = True
            p.font.color.rgb = COLOR_TEXT_MUTED

            p_val = tf.add_paragraph()
            p_val.text = val
            p_val.font.name = FONT_BODY
            p_val.font.size = Pt(9.8)
            p_val.font.bold = True
            p_val.font.color.rgb = COLOR_TEXT_DARK

    # =========================================================================
    # SLIDE 7: GROUNDED GENERATIVE AI CONCIERGE DEEP-DIVE
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    bg7 = slide7.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg7.fill.solid()
    bg7.fill.fore_color.rgb = COLOR_SLATE_BG
    bg7.line.fill.background()

    add_header(slide7, "Generative AI Concierge", "Zero-Hallucination Grounded AI Concierge", "Live-catalog database grounding guarantees authentic prices, active inventory, and instant in-chat checkout.")
    add_footer(slide7, 7)

    # 5-Stage Grounding Pipeline
    step_w = Inches(2.22)
    steps = [
        ("Step 1: User Query", "Customer asks query in conversational UI (e.g., 'Find mechanical watches under $800')."),
        ("Step 2: DB Aggregation", "Backend queries SQL Server for matching active products, stock levels, and user orders."),
        ("Step 3: Prompt Synthesis", "Injects live catalog context & system instructions into structured prompt payload."),
        ("Step 4: GenEngine API", "Dispatches to Capgemini Generative Engine using user-selected LLM endpoint."),
        ("Step 5: Card Extraction", "Parses [SUGGESTED_IDS: ...] tag to attach full interactive product cards in chat.")
    ]

    for i, (st_title, st_desc) in enumerate(steps):
        st_x = Inches(0.8) + i * Inches(2.38)
        st_card = create_card(slide7, st_x, Inches(1.85), step_w, Inches(1.8), bg_color=COLOR_WHITE, border_color=COLOR_BLUE if i == 2 else COLOR_CARD_BORDER)
        tf = st_card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = st_title
        p.font.name = FONT_TITLE
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_BLUE

        p_desc = tf.add_paragraph()
        p_desc.space_before = Pt(6)
        p_desc.text = st_desc
        p_desc.font.name = FONT_BODY
        p_desc.font.size = Pt(9.2)
        p_desc.font.color.rgb = COLOR_TEXT_BODY

    # 4 Foundation Models Comparison
    model_cards = [
        ("openai.gpt-5", "Flagship Concierge", COLOR_GOLD, "Flagship frontier intelligence providing deep conversational elegance, luxury styling advice, and complex constraint reasoning across diverse multi-item shopping bags."),
        ("phi-4-mini-reasoning", "Ultra-Low Latency", COLOR_BLUE, "Optimized for sub-second rapid recommendations, order milestone lookups, and fast answers on product specifications and shipping rules."),
        ("claude-sonnet-4-5", "Nuanced Discovery", COLOR_CYAN, "Excels at sophisticated multi-turn dialogue, stylistic matching, empathetic luxury appraisals, and detailed comparisons across product lines."),
        ("mistral-7b-instruct", "Cost-Efficient Inference", COLOR_EMERALD, "Compact open-weights architecture suitable for high-throughput edge tasks, basic product discovery, and cost-effective customer support queries.")
    ]

    m_w = Inches(2.78)
    for i, (m_id, m_role, m_col, m_detail) in enumerate(model_cards):
        mx = Inches(0.8) + i * Inches(2.98)
        card = create_card(slide7, mx, Inches(3.85), m_w, Inches(2.95), bg_color=COLOR_WHITE)
        
        bar = slide7.shapes.add_shape(MSO_SHAPE.RECTANGLE, mx, Inches(3.85), m_w, Inches(0.08))
        bar.fill.solid()
        bar.fill.fore_color.rgb = m_col
        bar.line.fill.background()

        tb = slide7.shapes.add_textbox(mx + Inches(0.12), Inches(4.0), m_w - Inches(0.24), Inches(2.7))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = m_id
        p.font.name = FONT_TITLE
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_TEXT_DARK

        p_role = tf.add_paragraph()
        p_role.text = m_role.upper()
        p_role.font.name = FONT_BODY
        p_role.font.size = Pt(9.5)
        p_role.font.bold = True
        p_role.font.color.rgb = m_col

        p_det = tf.add_paragraph()
        p_det.space_before = Pt(8)
        p_det.text = m_detail
        p_det.font.name = FONT_BODY
        p_det.font.size = Pt(9.3)
        p_det.font.color.rgb = COLOR_TEXT_BODY

    # =========================================================================
    # SLIDE 8: RELATIONAL DATABASE MODEL & 3NF SCHEMA
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    bg8 = slide8.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg8.fill.solid()
    bg8.fill.fore_color.rgb = COLOR_SLATE_BG
    bg8.line.fill.background()

    add_header(slide8, "Database Architecture", "Relational Data Model & 3NF Schema", "Engineered in Microsoft SQL Server 2022 with rigorous normalization, foreign key cascades, and atomic stock locks.")
    add_footer(slide8, 8)

    db_groups = [
        ("IDENTITY & TAXONOMY", COLOR_BLUE, [
            ("USERS", "id (PK), name, email (UK), hashed_password, role ('Admin' | 'Customer'), is_active, created_at"),
            ("CATEGORIES", "id (PK), name (UK), slug (UK), description, image_url, is_active"),
            ("Key Principle", "Stateless authentication uses JWT claims matching USERS.id and role. Strict email uniqueness.")
        ]),
        ("CATALOG & REVIEWS", COLOR_GOLD, [
            ("PRODUCTS", "id (PK), category_id (FK), name, slug (UK), description, price, discount_price, stock_quantity, sku (UK), specs_json, rating"),
            ("PRODUCT_REVIEWS", "id (PK), product_id (FK), user_id (FK), user_name, rating (1-5), comment, created_at"),
            ("Key Principle", "JSON-typed specs column stores dynamic technical attributes without table schema alterations.")
        ]),
        ("CARTS, ORDERS & PAYMENTS", COLOR_EMERALD, [
            ("CARTS / CART_ITEMS", "carts: id (PK), user_id (FK,UK) | cart_items: id, cart_id (FK), product_id (FK), quantity, unit_price"),
            ("ORDERS / ORDER_ITEMS", "orders: id (PK), user_id (FK), order_number (UK), total_amount, status, shipping_address | order_items: product snapshot"),
            ("PAYMENT_TRANSACTIONS", "id (PK), order_id (FK), user_id (FK), transaction_ref (UK), amount, payment_method, status, gateway_response_json"),
            ("Key Principle", "Checkout automatically decrements product stock and empties user cart inside a single transactional block.")
        ])
    ]

    db_w = Inches(3.75)
    for i, (g_title, g_col, g_tables) in enumerate(db_groups):
        gx = Inches(0.8) + i * Inches(3.98)
        card = create_card(slide8, gx, Inches(1.85), db_w, Inches(4.95), bg_color=COLOR_WHITE)
        
        hdr = slide8.shapes.add_shape(MSO_SHAPE.RECTANGLE, gx, Inches(1.85), db_w, Inches(0.55))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = g_col
        hdr.line.fill.background()
        tf = hdr.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = g_title
        p.font.name = FONT_TITLE
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE

        tb = slide8.shapes.add_textbox(gx + Inches(0.15), Inches(2.45), db_w - Inches(0.3), Inches(4.2))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        for idx, (tname, tcols) in enumerate(g_tables):
            p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
            if idx > 0:
                p.space_before = Pt(10)
            p.text = f"📊 {tname}\n"
            p.font.name = FONT_BODY
            p.font.size = Pt(10)
            p.font.bold = True
            p.font.color.rgb = COLOR_TEXT_DARK

            p_cols = tf.add_paragraph()
            p_cols.text = tcols
            p_cols.font.name = FONT_BODY
            p_cols.font.size = Pt(9.2)
            p_cols.font.color.rgb = COLOR_TEXT_BODY

    # =========================================================================
    # SLIDE 9: CUSTOMER EXPERIENCE & DISCOVERY JOURNEY
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    bg9 = slide9.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg9.fill.solid()
    bg9.fill.fore_color.rgb = COLOR_SLATE_BG
    bg9.line.fill.background()

    add_header(slide9, "Customer Journey", "Customer Discovery & Shopping Experience", "Frictionless end-to-end shopping journey with dynamic visual filtering, instant bag updates, and order steppers.")
    add_footer(slide9, 9)

    cx_stages = [
        ("1. Faceted Discovery", COLOR_BLUE, [
            "Live Search Bar: Instant substring search across product titles and descriptions.",
            "Category Pills: 6 taxonomy filters (Electronics, Fashion, Home, Health, Beauty, Books).",
            "Price Slider: Real-time range filtration ($0 to $3,000) with instant result counts.",
            "In-Stock Only Toggle: Instantly hides sold-out items to prevent customer drop-off.",
            "Smart Sort: Sort by Newest, Price (Low/High), Customer Rating, or Item Name."
        ]),
        ("2. Product Detail Suite", COLOR_GOLD, [
            "Multi-Angle Gallery: High-resolution preview thumbnails with interactive image switcher.",
            "Live Stock Badge: Real-time inventory pill (In Stock vs Low Stock vs Out of Stock).",
            "Dynamic Specs Table: Parses JSON specifications (dimensions, warranty, battery life).",
            "Verified Appraisals: Displays aggregate star ratings (1-5) and authentic customer reviews.",
            "Review Submission: Authenticated users can write verified feedback and ratings."
        ]),
        ("3. Dynamic Shopping Bag", COLOR_EMERALD, [
            "Real-Time Item Adjustments: Add, update quantity, or delete items with instant subtotal sync.",
            "Tiered Discount Engine: Automatically applies a 5% promotional discount on orders > $200.",
            "Express Shipping Progress: Visual progress bar encouraging carts to reach the $100 free shipping tier.",
            "Tax & Investment Summary: Clear breakdown of subtotal, discounts, $15 shipping fee, and 8% tax.",
            "Persistent State: Bag synchronizes seamlessly across desktop and mobile devices."
        ]),
        ("4. Checkout & Order Stepper", COLOR_NAVY_DARK, [
            "Multi-Step Consignment: Shipping address form with real-time postal code and phone checks.",
            "Multi-Gateway Payment: Simulated payment selector for Credit Card, UPI, Net Banking, and COD.",
            "Atomic Stock Lock: Deducts product quantities immediately upon order confirmation.",
            "Order Milestone Stepper: Visual progress timeline: Placed → Processing → Shipped → Delivered.",
            "Order History & Invoices: Customers can review all past orders and item snapshots anytime."
        ])
    ]

    for i, (st_name, st_col, st_points) in enumerate(cx_stages):
        cx = Inches(0.8) + i * Inches(2.98)
        card = create_card(slide9, cx, Inches(1.85), Inches(2.78), Inches(4.95), bg_color=COLOR_WHITE)
        
        hdr = slide9.shapes.add_shape(MSO_SHAPE.RECTANGLE, cx, Inches(1.85), Inches(2.78), Inches(0.55))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = st_col
        hdr.line.fill.background()
        tf = hdr.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = st_name
        p.font.name = FONT_TITLE
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE

        tb = slide9.shapes.add_textbox(cx + Inches(0.12), Inches(2.45), Inches(2.54), Inches(4.2))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        for idx, pt in enumerate(st_points):
            p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
            if idx > 0:
                p.space_before = Pt(8)
            p.text = f"• {pt}"
            p.font.name = FONT_BODY
            p.font.size = Pt(9.2)
            p.font.color.rgb = COLOR_TEXT_BODY

    # =========================================================================
    # SLIDE 10: STORE ADMINISTRATION & FULFILLMENT CONSOLE
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    bg10 = slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg10.fill.solid()
    bg10.fill.fore_color.rgb = COLOR_SLATE_BG
    bg10.line.fill.background()

    add_header(slide10, "Admin Control Console", "Store Administration Console & Fulfillment Operations", "Comprehensive administrative controls providing real-time telemetry, product CRUD, and order fulfillment.")
    add_footer(slide10, 10)

    # 4 KPI Cards
    kpis = [
        ("GROSS REVENUE", "$48,920.00", "Total settling order volume", COLOR_EMERALD),
        ("TOTAL ORDERS", "142 Placed", "100% auditable order logs", COLOR_BLUE),
        ("ACTIVE CATALOG", "27 Products", "6 taxonomies with rich specs", COLOR_GOLD),
        ("LOW STOCK ALERTS", "3 Items (<10)", "Automated inventory warnings", COLOR_ROSE)
    ]
    kw = Inches(2.78)
    for i, (ktitle, kval, ksub, kcol) in enumerate(kpis):
        kx = Inches(0.8) + i * Inches(2.98)
        kcard = create_card(slide10, kx, Inches(1.85), kw, Inches(1.5), bg_color=COLOR_WHITE, border_color=kcol, border_width=1.2)
        tf = kcard.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = ktitle
        p.font.name = FONT_TITLE
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = kcol

        pval = tf.add_paragraph()
        pval.space_before = Pt(4)
        pval.text = kval
        pval.font.name = FONT_TITLE
        pval.font.size = Pt(20)
        pval.font.bold = True
        pval.font.color.rgb = COLOR_TEXT_DARK

        psub = tf.add_paragraph()
        psub.space_before = Pt(2)
        psub.text = ksub
        psub.font.name = FONT_BODY
        psub.font.size = Pt(9)
        psub.font.color.rgb = COLOR_TEXT_MUTED

    # 3 Operational Modules
    ops = [
        ("Product Inventory CRUD (Full Lifecycle)", COLOR_BLUE, [
            ("Live Creation Modal", "Admin can create items specifying Name, Category, Price, Discount, Stock, SKU, and specs JSON."),
            ("Instant Image Preview", "Paste image URLs with real-time preview before publishing to the live catalog."),
            ("Pricing & Stock Updates", "Modify product pricing, promotional discounts, and inventory counts in real time."),
            ("Catalog Archival", "Soft-delete or deactivate discontinued products while preserving historical orders.")
        ]),
        ("Order Fulfillment & Status Lifecycle", COLOR_GOLD, [
            ("Consignment Inspection", "Inspect shipping names, physical addresses, postal codes, and customer contact details."),
            ("Fulfillment Progression", "Manually advance order lifecycle: Placed → Processing → Shipped → Delivered."),
            ("Payment Verification", "Verify gateway settlement transaction references and selected payment methods."),
            ("Customer Notification Sync", "Status changes trigger real-time updates in customer order tracking steppers.")
        ]),
        ("Category & Inventory Analytics", COLOR_NAVY_DARK, [
            ("Category Volume Breakdown", "Monitor item volume distribution across the 6 major luxury merchandise categories."),
            ("Low Stock Dashboard", "Automated alert badges highlight items below 10 units to expedite warehouse restocking."),
            ("Revenue Distribution", "Identify high-performing luxury items driving majority gross merchandise value."),
            ("Seeding Verification", "Verify automated database seeding health on application boot.")
        ])
    ]

    op_w = Inches(3.75)
    for i, (optitle, opcol, opitems) in enumerate(ops):
        ox = Inches(0.8) + i * Inches(3.98)
        card = create_card(slide10, ox, Inches(3.55), op_w, Inches(3.25), bg_color=COLOR_WHITE)
        
        hdr = slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, ox, Inches(3.55), op_w, Inches(0.5))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = opcol
        hdr.line.fill.background()
        tf = hdr.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = optitle
        p.font.name = FONT_TITLE
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE

        tb = slide10.shapes.add_textbox(ox + Inches(0.12), Inches(4.12), op_w - Inches(0.24), Inches(2.6))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        for idx, (head, body) in enumerate(opitems):
            p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
            if idx > 0:
                p.space_before = Pt(6)
            p.text = f"✔ {head}: "
            p.font.name = FONT_BODY
            p.font.size = Pt(9.3)
            p.font.bold = True
            p.font.color.rgb = COLOR_TEXT_DARK
            p.text += body
            run0 = p.runs[0]
            run0.font.bold = True
            run0.font.color.rgb = opcol

    # =========================================================================
    # SLIDE 11: SECURITY, AUTHENTICATION & NON-FUNCTIONAL REQUIREMENTS
    # =========================================================================
    slide11 = prs.slides.add_slide(blank_layout)
    bg11 = slide11.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg11.fill.solid()
    bg11.fill.fore_color.rgb = COLOR_SLATE_BG
    bg11.line.fill.background()

    add_header(slide11, "Security & NFRs", "Security Architecture & Non-Functional Requirements", "Enterprise-grade defensive controls paired with high availability and low-latency benchmarks.")
    add_footer(slide11, 11)

    # Left: Security Architecture
    sec_card = create_card(slide11, Inches(0.8), Inches(1.85), Inches(5.65), Inches(4.95), bg_color=COLOR_WHITE)
    tf = sec_card.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "DEFENSIVE SECURITY ARCHITECTURE"
    p.font.name = FONT_TITLE
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_NAVY_DARK

    sec_items = [
        ("Cryptographic Password Hashing", "Zero plain-text password persistence; implemented using passlib with bcrypt and individual cryptographic salts."),
        ("Stateless JWT Bearer Tokens", "HMAC-SHA256 signed tokens containing user ID, role claims, and strict expiration timestamps, preventing session tampering."),
        ("Dual-Layer RBAC Authorization", "Frontend route guards (authGuard, adminGuard) paired with backend FastAPI dependency guards (get_current_admin)."),
        ("SQL Injection Immunity", "100% parameterized SQL queries enforced via SQLModel / SQLAlchemy ORM; eliminates raw SQL concatenation vulnerabilities."),
        ("Strict CORS & Input Validation", "Strict cross-origin resource whitelisting and deep Pydantic v2 schema validation rejecting malformed payloads.")
    ]
    for stitle, sdesc in sec_items:
        p_item = tf.add_paragraph()
        p_item.space_before = Pt(10)
        p_item.text = f"🛡️  {stitle}: {sdesc}"
        p_item.font.name = FONT_BODY
        p_item.font.size = Pt(9.8)
        p_item.font.color.rgb = COLOR_TEXT_BODY
        run0 = p_item.runs[0]
        run0.font.bold = True
        run0.font.color.rgb = COLOR_TEXT_DARK

    # Right: Non-Functional Requirements (NFRs)
    nfr_card = create_card(slide11, Inches(6.8), Inches(1.85), Inches(5.733), Inches(4.95), bg_color=COLOR_WHITE)
    tf = nfr_card.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "NON-FUNCTIONAL REQUIREMENTS (NFRS) & SLA"
    p.font.name = FONT_TITLE
    p.font.size = Pt(12)
    p.font.bold = True
    p.font.color.rgb = COLOR_BLUE

    nfr_items = [
        ("Latency Benchmark (P95 < 150ms)", "PyODBC connection pooling combined with fast_executemany ensures sub-150ms catalog lookups under high concurrency."),
        ("High Availability & Fault Isolation", "Stateless micro-engine design permits seamless horizontal replication behind reverse proxies (e.g. NGINX)."),
        ("AI Graceful Degradation", "Intelligent error-handling wraps remote GenEngine API calls; defaults to structured catalog search if external AI is temporarily offline."),
        ("ACID Transactional Consistency", "Full database foreign key constraints, unique constraints, and atomic checkout blocks prevent data drift."),
        ("Auditability & Compliance", "Every order checkout logs immutable recipient details, item unit prices, and payment gateway references.")
    ]
    for ntitle, ndesc in nfr_items:
        p_item = tf.add_paragraph()
        p_item.space_before = Pt(10)
        p_item.text = f"⚡  {ntitle}: {ndesc}"
        p_item.font.name = FONT_BODY
        p_item.font.size = Pt(9.8)
        p_item.font.color.rgb = COLOR_TEXT_BODY
        run0 = p_item.runs[0]
        run0.font.bold = True
        run0.font.color.rgb = COLOR_TEXT_DARK

    # =========================================================================
    # SLIDE 12: KEY BENCHMARK METRICS & ARCHITECTURAL SCORECARD
    # =========================================================================
    slide12 = prs.slides.add_slide(blank_layout)
    bg12 = slide12.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg12.fill.solid()
    bg12.fill.fore_color.rgb = COLOR_SLATE_BG
    bg12.line.fill.background()

    add_header(slide12, "Benchmark Scorecard", "Key Benchmark Metrics & Performance Validation", "Quantitative results validating architectural robustness, response times, and AI precision.")
    add_footer(slide12, 12)

    table_shape = slide12.shapes.add_table(7, 4, Inches(0.8), Inches(1.85), Inches(11.733), Inches(4.95))
    table = table_shape.table
    table.columns[0].width = Inches(2.6)
    table.columns[1].width = Inches(2.2)
    table.columns[2].width = Inches(3.8)
    table.columns[3].width = Inches(3.133)

    headers = ["METRIC / ATTRIBUTE", "TARGET / SCORE", "ARCHITECTURAL IMPLEMENTATION", "BUSINESS & UX IMPACT"]
    for j, h in enumerate(headers):
        cell = table.cell(0, j)
        cell.fill.solid()
        cell.fill.fore_color.rgb = COLOR_NAVY_DARK
        tf = cell.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = h
        p.font.name = FONT_TITLE
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE

    benchmarks = [
        ("Catalog Read Latency", "P95 < 150 ms", "PyODBC Connection Pool + fast_executemany", "Instantaneous faceted search and pagination"),
        ("AI Hallucination Rate", "0.0%", "Live SQL Server catalog & user order context injection", "Zero phantom inventory or incorrect pricing"),
        ("Foundation Models", "4 LLMs Active", "OpenAI GPT-5, Claude 4.5, Phi-4 Mini, Mistral 7B", "User flexibility & cost-latency optimization"),
        ("Database Data Integrity", "100% ACID Strict", "SQL Server 2022 constraints & atomic stock locks", "Guaranteed prevention of inventory overselling"),
        ("RBAC Authorization", "100% Segregation", "PyJWT HS256 claims + Angular & FastAPI guards", "Complete isolation of Admin vs Customer roles"),
        ("Pre-Seeded Catalog", "6 Taxonomies / 27+ Items", "Automated DB startup verification with Unsplash CDN", "Turnkey immediate evaluation out of the box")
    ]

    for i, row in enumerate(benchmarks):
        row_idx = i + 1
        bg_row = COLOR_WHITE if i % 2 == 0 else RGBColor(241, 245, 249)
        for j, val in enumerate(row):
            cell = table.cell(row_idx, j)
            cell.fill.solid()
            cell.fill.fore_color.rgb = bg_row
            tf = cell.text_frame
            p = tf.paragraphs[0]
            p.text = val
            p.font.name = FONT_BODY
            p.font.size = Pt(9.8)
            if j == 0:
                p.font.bold = True
                p.font.color.rgb = COLOR_TEXT_DARK
            elif j == 1:
                p.font.bold = True
                p.alignment = PP_ALIGN.CENTER
                p.font.color.rgb = COLOR_BLUE if "P95" in val or "4" in val else (COLOR_EMERALD if "0.0%" in val or "100%" in val else COLOR_GOLD)
            else:
                p.font.color.rgb = COLOR_TEXT_BODY

    # =========================================================================
    # SLIDE 13: GENERATIVE AI ASSISTED DEVELOPMENT & PROMPTS PLAYBOOK
    # =========================================================================
    slide13 = prs.slides.add_slide(blank_layout)
    bg13 = slide13.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg13.fill.solid()
    bg13.fill.fore_color.rgb = COLOR_SLATE_BG
    bg13.line.fill.background()

    add_header(slide13, "GenAI Playbook", "Generative AI-Assisted Development & Master Prompts", "Accelerating enterprise delivery through systematic prompt engineering, architecture blueprints, and validation.")
    add_footer(slide13, 13)

    prompt_phases = [
        ("Phase 1: Architecture Blueprinting", COLOR_BLUE, [
            ("Master Prompt Intent", "Generated High-Level Design (HLD) and Low-Level Design (LLD) diagrams and 3NF schemas."),
            ("Rigorous Constraints", "Enforced strict decoupling between Angular 21, FastAPI, and Microsoft SQL Server 2022."),
            ("Data Contract Specification", "Generated complete OpenAPI/Pydantic schemas before writing any application code.")
        ]),
        ("Phase 2: Backend Engine Synthesis", COLOR_GOLD, [
            ("Master Prompt Intent", "Constructed asynchronous FastAPI routers, PyODBC connection pool, and JWT middleware."),
            ("Zero Dummy Data Rule", "Scripted automated database seeder populating 6 rich taxonomies and 27+ luxury items with JSON specs."),
            ("Error Handling Directives", "Mandated transactional rollback on failed order fulfillment and stock checks.")
        ]),
        ("Phase 3: Angular 21 UI Synthesis", COLOR_EMERALD, [
            ("Master Prompt Intent", "Built modern standalone Angular 21 components using zoneless signals and SCSS luxury tokens."),
            ("Dynamic State Signals", "Eliminated legacy RxJS boilerplate for cart counters, filter pills, and active user state."),
            ("Interactive Concierge Widget", "Created floating AI widget parsing suggested product IDs directly into UI cards.")
        ]),
        ("Phase 4: Grounding & Validation", COLOR_NAVY_DARK, [
            ("Master Prompt Intent", "Crafted the real-time AI grounding system prompt incorporating SQL Server catalog context."),
            ("Safety Directives", "Explicit rules preventing hallucinated inventory, out-of-scope discounts, or off-topic dialogue."),
            ("Multi-Model Compatibility", "Validated consistent behavior across GPT-5, Claude 4.5, Phi-4 Mini, and Mistral 7B.")
        ])
    ]

    pr_w = Inches(2.78)
    for i, (pr_title, pr_col, pr_items) in enumerate(prompt_phases):
        px = Inches(0.8) + i * Inches(2.98)
        card = create_card(slide13, px, Inches(1.85), pr_w, Inches(4.95), bg_color=COLOR_WHITE)
        
        hdr = slide13.shapes.add_shape(MSO_SHAPE.RECTANGLE, px, Inches(1.85), pr_w, Inches(0.55))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = pr_col
        hdr.line.fill.background()
        tf = hdr.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = pr_title
        p.font.name = FONT_TITLE
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE

        tb = slide13.shapes.add_textbox(px + Inches(0.12), Inches(2.45), pr_w - Inches(0.24), Inches(4.2))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        for idx, (head, body) in enumerate(pr_items):
            p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
            if idx > 0:
                p.space_before = Pt(10)
            p.text = f"🎯 {head}\n"
            p.font.name = FONT_BODY
            p.font.size = Pt(9.8)
            p.font.bold = True
            p.font.color.rgb = COLOR_TEXT_DARK

            p_b = tf.add_paragraph()
            p_b.text = body
            p_b.font.name = FONT_BODY
            p_b.font.size = Pt(9.2)
            p_b.font.color.rgb = COLOR_TEXT_BODY

    # =========================================================================
    # SLIDE 14: PROJECT STRUCTURE, SETUP & DEPLOYMENT STRATEGY
    # =========================================================================
    slide14 = prs.slides.add_slide(blank_layout)
    bg14 = slide14.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg14.fill.solid()
    bg14.fill.fore_color.rgb = COLOR_SLATE_BG
    bg14.line.fill.background()

    add_header(slide14, "Deployment & DevOps", "Project Structure & Deployment Strategy", "Clean monorepo architecture with rapid local bootstrapping and enterprise container readiness.")
    add_footer(slide14, 14)

    cols14 = [
        ("MONOREPO REPOSITORY STRUCTURE", COLOR_NAVY_DARK, [
            ("backend/", "FastAPI application root with app/api routers, app/db database models, and app/services business logic."),
            ("frontend/", "Angular 21 project containing src/app components (catalog, cart, checkout, admin, ai-concierge, auth)."),
            ("deployment/", "Docker compose profiles, database migration scripts, and production environment configurations."),
            ("documentation/", "Master HLD, LLD, prompts playbook, and architecture posters.")
        ]),
        ("RAPID LOCAL BOOTSTRAP WORKFLOW", COLOR_BLUE, [
            ("1. Database Initialization", "Execute 'python -m app.db.init_db' to verify tables and seed initial luxury catalog."),
            ("2. Launch FastAPI Engine", "Execute 'uvicorn app.main:app --port 8000 --reload' for interactive Swagger at /docs."),
            ("3. Launch Angular UI", "Run 'npm start -- --port 4200' for hot-reloading client served at http://localhost:4200."),
            ("4. Instant Demo Profiles", "One-click login buttons for Admin (Vijay Kumar) and Customer (Rohan Verma).")
        ]),
        ("PRODUCTION DEPLOYMENT TOPOLOGY", COLOR_EMERALD, [
            ("Containerized Microservices", "Dockerized FastAPI containers running behind an NGINX reverse proxy with SSL termination."),
            ("Static Frontend CDN", "Angular production SSR build deployed to Azure Static Web Apps or AWS CloudFront for global caching."),
            ("Database High Availability", "Microsoft SQL Server 2022 Always On availability group ensuring 99.99% uptime."),
            ("API Rate Limiting", "Token bucket throttling on the /api/v1/ai/chat endpoint to protect Generative Engine quotas.")
        ])
    ]

    d_w = Inches(3.75)
    for i, (d_title, d_col, d_items) in enumerate(cols14):
        dx = Inches(0.8) + i * Inches(3.98)
        card = create_card(slide14, dx, Inches(1.85), d_w, Inches(4.95), bg_color=COLOR_WHITE)
        
        hdr = slide14.shapes.add_shape(MSO_SHAPE.RECTANGLE, dx, Inches(1.85), d_w, Inches(0.55))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = d_col
        hdr.line.fill.background()
        tf = hdr.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = d_title
        p.font.name = FONT_TITLE
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE

        tb = slide14.shapes.add_textbox(dx + Inches(0.15), Inches(2.45), d_w - Inches(0.3), Inches(4.2))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        for idx, (head, body) in enumerate(d_items):
            p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
            if idx > 0:
                p.space_before = Pt(8)
            p.text = f"⚙️ {head}\n"
            p.font.name = FONT_BODY
            p.font.size = Pt(9.8)
            p.font.bold = True
            p.font.color.rgb = COLOR_TEXT_DARK

            p_b = tf.add_paragraph()
            p_b.text = body
            p_b.font.name = FONT_BODY
            p_b.font.size = Pt(9.2)
            p_b.font.color.rgb = COLOR_TEXT_BODY

    # =========================================================================
    # SLIDE 15: FUTURE ROADMAP & STRATEGIC ENHANCEMENTS
    # =========================================================================
    slide15 = prs.slides.add_slide(blank_layout)
    bg15 = slide15.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg15.fill.solid()
    bg15.fill.fore_color.rgb = COLOR_SLATE_BG
    bg15.line.fill.background()

    add_header(slide15, "Strategic Roadmap", "Future Enhancements & Strategic Roadmap", "Planned evolution to scale LuxeMart into an international omnichannel enterprise platform.")
    add_footer(slide15, 15)

    phases15 = [
        ("PHASE 2: VECTOR RAG & VISUAL DISCOVERY", COLOR_BLUE, [
            ("Vector Search Integration", "Implement SQL Server 2024 / pgvector embeddings for semantic similarity and natural language search."),
            ("Visual Product Discovery", "Allow customers to upload photos of outfits or luxury accessories to find catalog matches."),
            ("Customer Style Profiles", "Vectorize customer browsing history to build persistent, personalized style recommendations.")
        ]),
        ("PHASE 3: PRODUCTION PAYMENTS & WEBSOCKETS", COLOR_GOLD, [
            ("Live Payment Gateways", "Integrate Stripe and Razorpay webhook callbacks for instant reconciliation and refunds."),
            ("Real-Time Order Tracking", "WebSocket or SSE notifications pushing immediate order status transitions directly to user devices."),
            ("Automated Tax Jurisdictions", "Integrate Avalara / Stripe Tax for automated multi-state and international tax calculation.")
        ]),
        ("PHASE 4: MULTI-TENANCY & GLOBAL SCALE", COLOR_EMERALD, [
            ("Multi-Tenant Architecture", "Support multiple boutique brands and multi-storefront routing on a single infrastructure."),
            ("Multi-Currency & Localization", "Dynamic currency conversions and multi-lingual AI concierge translations in 15+ languages."),
            ("Warehouse Inventory Federation", "Multi-warehouse stock allocation based on customer geographical proximity.")
        ]),
        ("PHASE 5: ENTERPRISE CI/CD & TELEMETRY", COLOR_NAVY_DARK, [
            ("Automated Pipeline", "GitHub Actions CI/CD with automated unit tests, end-to-end Cypress tests, and linting."),
            ("Full Telemetry & APM", "OpenTelemetry, Prometheus, and Grafana tracking backend P99 latency and AI inference costs."),
            ("Autonomous Inventory Reordering", "AI agent triggers automated supplier purchase orders when item stock reaches safety thresholds.")
        ])
    ]

    r_w = Inches(2.78)
    for i, (r_title, r_col, r_items) in enumerate(phases15):
        rx = Inches(0.8) + i * Inches(2.98)
        card = create_card(slide15, rx, Inches(1.85), r_w, Inches(4.95), bg_color=COLOR_WHITE)
        
        hdr = slide15.shapes.add_shape(MSO_SHAPE.RECTANGLE, rx, Inches(1.85), r_w, Inches(0.55))
        hdr.fill.solid()
        hdr.fill.fore_color.rgb = r_col
        hdr.line.fill.background()
        tf = hdr.text_frame
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = r_title
        p.font.name = FONT_TITLE
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = COLOR_WHITE

        tb = slide15.shapes.add_textbox(rx + Inches(0.12), Inches(2.45), r_w - Inches(0.24), Inches(4.2))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        for idx, (head, body) in enumerate(r_items):
            p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
            if idx > 0:
                p.space_before = Pt(10)
            p.text = f"🚀 {head}\n"
            p.font.name = FONT_BODY
            p.font.size = Pt(9.8)
            p.font.bold = True
            p.font.color.rgb = COLOR_TEXT_DARK

            p_b = tf.add_paragraph()
            p_b.text = body
            p_b.font.name = FONT_BODY
            p_b.font.size = Pt(9.2)
            p_b.font.color.rgb = COLOR_TEXT_BODY

    # =========================================================================
    # SLIDE 16: CONCLUSION, SIGN-OFF & REVIEW RECAP (Executive Dark Theme)
    # =========================================================================
    slide16 = prs.slides.add_slide(blank_layout)
    bg16 = slide16.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg16.fill.solid()
    bg16.fill.fore_color.rgb = COLOR_NAVY_DARK
    bg16.line.fill.background()

    top_bar16 = slide16.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(0.12))
    top_bar16.fill.solid()
    top_bar16.fill.fore_color.rgb = COLOR_GOLD
    top_bar16.line.fill.background()

    add_header(slide16, "Review Sign-Off", "Conclusion & Architectural Review Summary", "LuxeMart demonstrates production readiness across decoupled full-stack engineering and enterprise GenAI.", dark_mode=True)
    add_footer(slide16, 16, dark_mode=True)

    concl_cards = [
        ("ENTERPRISE ARCHITECTURE", COLOR_CYAN, [
            "Decoupled Angular 21 (Zoneless Signals) & FastAPI 0.115 backend delivering P95 < 150ms catalog performance.",
            "3NF relational schema in Microsoft SQL Server 2022 with atomic checkout transactions and stock consistency.",
            "Stateless JWT Bearer security with 100% RBAC role segregation between Admin and Customer personas."
        ]),
        ("GENAI INNOVATION", COLOR_GOLD, [
            "Dynamic database catalog grounding delivering zero hallucination across prices, inventory, and orders.",
            "Runtime model switcher across 4 foundation LLMs (OpenAI GPT-5, Claude 4.5, Phi-4 Mini, Mistral 7B).",
            "Interactive in-chat product recommendation cards enabling direct checkout conversion."
        ]),
        ("REVIEW SIGN-OFF", COLOR_EMERALD, [
            "Fully seeded turnkey repository with 6 luxury categories and 27+ detailed products.",
            "Complete technical documentation suite: Readme, HLD, LLD, API Contracts, and Playbooks.",
            "All Capgemini L1 Architecture Review criteria satisfied with production-grade engineering standards."
        ])
    ]

    c_w = Inches(3.75)
    for i, (ctitle, ccol, cpoints) in enumerate(concl_cards):
        cx = Inches(0.8) + i * Inches(3.98)
        card = create_card(slide16, cx, Inches(1.85), c_w, Inches(3.7), bg_color=COLOR_NAVY_CARD, border_color=ccol, border_width=1.2)
        
        tb = slide16.shapes.add_textbox(cx + Inches(0.2), Inches(2.0), c_w - Inches(0.4), Inches(3.4))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        
        p = tf.paragraphs[0]
        p.text = ctitle
        p.font.name = FONT_TITLE
        p.font.size = Pt(11.5)
        p.font.bold = True
        p.font.color.rgb = ccol

        for pt in cpoints:
            p_pt = tf.add_paragraph()
            p_pt.space_before = Pt(10)
            p_pt.text = f"✔ {pt}"
            p_pt.font.name = FONT_BODY
            p_pt.font.size = Pt(9.8)
            p_pt.font.color.rgb = RGBColor(226, 232, 240)

    # Bottom Contact & Review Banner
    btm_card = create_card(slide16, Inches(0.8), Inches(5.75), Inches(11.733), Inches(0.95), bg_color=RGBColor(15, 23, 42), border_color=COLOR_GOLD, border_width=1)
    tf = btm_card.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.alignment = PP_ALIGN.CENTER
    p.text = "Thank You! Questions & Live System Demonstration"
    p.font.name = FONT_TITLE
    p.font.size = Pt(13.5)
    p.font.bold = True
    p.font.color.rgb = COLOR_GOLD

    p_sub = tf.add_paragraph()
    p_sub.space_before = Pt(3)
    p_sub.alignment = PP_ALIGN.CENTER
    p_sub.text = "Project Lead: Vijay Kumar   |   API Swagger: http://127.0.0.1:8000/docs   |   Client Web: http://localhost:4200"
    p_sub.font.name = FONT_BODY
    p_sub.font.size = Pt(10)
    p_sub.font.color.rgb = RGBColor(203, 213, 225)

    # Save presentation
    output_path = os.path.join(os.getcwd(), "LuxeMart_Enterprise_Architecture_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation successfully saved to: {output_path}")

if __name__ == "__main__":
    build_presentation()
