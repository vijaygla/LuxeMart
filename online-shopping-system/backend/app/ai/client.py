import json
import logging
from typing import List, Optional, Dict, Any
import httpx
from sqlmodel import Session, select
from app.core.config import settings
from app.models.catalog import Product, Category
from app.models.order import Order
from app.schemas.ai import ChatMessage, ChatResponse
from app.schemas.catalog import ProductRead

logger = logging.getLogger(__name__)

class AIClient:
    def __init__(self):
        self.endpoint = settings.CAPGEMINI_AI_ENDPOINT.rstrip("/") + "/chat/completions"
        self.api_key = settings.CAPGEMINI_AI_API_KEY
        self.available_models = settings.ALLOWED_AI_MODELS

    def _build_system_context(self, db: Session, user_id: Optional[int] = None) -> str:
        """Inject real store data from database into system prompt."""
        # 1. Fetch categories
        categories = db.exec(select(Category).where(Category.is_active == True)).all()
        cat_summary = ", ".join([c.name for c in categories])

        # 2. Fetch top products (names, prices, discounts, stock, rating, id)
        products = db.exec(select(Product).where(Product.is_active == True)).all()
        prod_lines = []
        for p in products[:40]:  # feed comprehensive catalog context
            curr_price = p.discount_price if p.discount_price else p.price
            prod_lines.append(
                f"- [ID:{p.id}] {p.name} (Category: {p.category_id}, Price: ${curr_price:.2f}, "
                f"Original: ${p.price:.2f}, Stock: {p.stock_quantity}, Rating: {p.rating}★, SKU: {p.sku}): {p.description[:80]}..."
            )
        catalog_context = "\n".join(prod_lines)

        # 3. User order context if authenticated
        order_context = ""
        if user_id:
            orders = db.exec(
                select(Order).where(Order.user_id == user_id).order_by(Order.created_at.desc())
            ).all()
            if orders:
                user_orders = [
                    f"Order #{o.order_number}: Status='{o.status}', Total=${o.total_amount:.2f}, Placed on {o.created_at.strftime('%Y-%m-%d')}"
                    for o in orders[:5]
                ]
                order_context = "User's Recent Orders:\n" + "\n".join(user_orders) + "\n"

        prompt = f"""You are the intelligent AI Shopping Assistant for LuxeMart E-Commerce.
Your goal is to assist customers professionally, help them discover products, recommend the best items, answer questions on pricing, stock, specs, policies, and track their orders.

STORE DETAILS & POLICIES:
- Free shipping on all orders over $100. Otherwise, flat shipping is $15.
- 30-day hassle-free returns and full money-back guarantee.
- 100% genuine products with manufacturer warranty.
- Multiple payment options supported: Credit Card, Debit Card, UPI, Net Banking, Cash on Delivery.

AVAILABLE PRODUCT CATEGORIES:
{cat_summary}

REAL STORE CATALOG (REAL LIVE DATABASE DATA):
{catalog_context}

{order_context}

CRITICAL RULES:
1. Always base product answers strictly on the real store catalog data above. NEVER invent products or prices that are not in the list.
2. If you recommend or discuss specific products from the catalog, explicitly mention them clearly by name.
3. If a user asks about order tracking or recent orders, reference their order numbers and current status.
4. Keep answers friendly, concise, formatted with clear markdown bullet points when comparing or listing items.
5. In your response, if you mention any product from our catalog, also include their IDs inside a clean tag at the end like: [SUGGESTED_IDS: 1, 2] so the UI can render rich interactive product cards. If none, omit the tag.
"""
        return prompt

    async def chat(
        self,
        message: str,
        db: Session,
        model_name: Optional[str] = None,
        history: Optional[List[ChatMessage]] = None,
        user_id: Optional[int] = None
    ) -> ChatResponse:
        chosen_model = model_name if model_name in self.available_models else settings.DEFAULT_AI_MODEL
        system_prompt = self._build_system_context(db, user_id)

        messages_payload = [
            {"role": "system", "content": system_prompt}
        ]

        # Add prior conversation history
        if history:
            for item in history[-8:]:  # keep last 8 turns for context window
                messages_payload.append({"role": item.role, "content": item.content})

        # Add current user prompt
        messages_payload.append({"role": "user", "content": message})

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        body = {
            "model": chosen_model,
            "messages": messages_payload,
            "max_tokens": 800,
            "temperature": 0.7
        }

        reply_content = ""
        suggested_products: List[ProductRead] = []

        try:
            async with httpx.AsyncClient(timeout=25.0) as client:
                response = await client.post(self.endpoint, headers=headers, json=body)
                if response.status_code == 200:
                    data = response.json()
                    choices = data.get("choices", [])
                    if choices:
                        reply_content = choices[0].get("message", {}).get("content", "")
                else:
                    logger.error(f"GenerativeEngine error {response.status_code}: {response.text}")
                    reply_content = self._generate_fallback_response(message, db)
        except Exception as e:
            logger.exception(f"Exception calling GenerativeEngine with model {chosen_model}: {e}")
            reply_content = self._generate_fallback_response(message, db)

        # Parse suggested IDs if returned
        if "[SUGGESTED_IDS:" in reply_content:
            try:
                tag_start = reply_content.find("[SUGGESTED_IDS:")
                tag_end = reply_content.find("]", tag_start)
                if tag_end != -1:
                    ids_str = reply_content[tag_start + len("[SUGGESTED_IDS:"):tag_end]
                    ids = [int(i.strip()) for i in ids_str.split(",") if i.strip().isdigit()]
                    if ids:
                        prods = db.exec(select(Product).where(Product.id.in_(ids))).all()
                        suggested_products = [ProductRead.model_validate(p) for p in prods]
                    # Clean the tag from the final user-facing text
                    reply_content = reply_content[:tag_start].strip() + reply_content[tag_end+1:].strip()
            except Exception as e:
                logger.warning(f"Error extracting suggested IDs: {e}")

        # If no explicit suggestions but user asked about products, auto-match keyword from catalog
        if not suggested_products:
            keywords = [w.lower() for w in message.split() if len(w) > 3]
            for kw in keywords:
                matched = db.exec(
                    select(Product).where(Product.name.ilike(f"%{kw}%")).limit(3)
                ).all()
                if matched:
                    suggested_products = [ProductRead.model_validate(p) for p in matched]
                    break

        return ChatResponse(
            reply=reply_content.strip() or "I'm here to help you shop! How can I assist you with our catalog today?",
            model_used=chosen_model,
            suggested_products=suggested_products
        )

    def _generate_fallback_response(self, message: str, db: Session) -> str:
        """Intelligent local fallback if AI engine is temporarily unreachable."""
        msg_lower = message.lower()
        if "order" in msg_lower or "track" in msg_lower:
            return "You can view and track all your orders directly in the **My Orders** page. For immediate help, provide your order number!"
        if "return" in msg_lower or "refund" in msg_lower:
            return "LuxeMart provides a **30-Day Hassle-Free Return Policy**. You can return any item within 30 days of delivery for a 100% refund."
        if "shipping" in msg_lower or "delivery" in msg_lower:
            return "We offer **Free Standard Shipping** on all orders over $100! Standard delivery takes 2-4 business days."
        
        # Search catalog for keywords
        words = [w for w in msg_lower.split() if len(w) > 3]
        for w in words:
            matching = db.exec(select(Product).where(Product.name.ilike(f"%{w}%")).limit(2)).all()
            if matching:
                items = "\n".join([f"- **{p.name}** - ${p.price:.2f} (Stock: {p.stock_quantity})" for p in matching])
                return f"Here are relevant products from our store matching '{w}':\n\n{items}\n\nFeel free to add them to your cart!"

        return "Welcome to LuxeMart! We offer premium Electronics, Fashion, Home essentials, and more with free shipping over $100. How can I assist you today?"

ai_client = AIClient()
