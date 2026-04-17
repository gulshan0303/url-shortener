# 🔗 URL Shortener (Scalable System Design)

A production-ready URL shortener similar to Bitly, built with a focus on scalability, performance, and system design principles.

---

## 🚀 Features

* 🔗 Convert long URLs into short URLs
* ⚡ Fast redirection using Redis caching
* 🔐 Rate limiting to prevent abuse
* ✨ Custom short URLs (user-defined slugs)
* ⏳ Expiry links (time-based invalidation)
* 📊 Click analytics tracking
* 🧠 Base62 encoding for scalable ID generation

---

## 🏗️ Tech Stack

* **Backend:** Node.js, Express, TypeScript
* **Database:** PostgreSQL (Prisma ORM)
* **Cache:** Redis
* **Dev Tools:** tsx, Docker

---

## 🧠 System Design Highlights

### 1. Scalable ID Generation

* Used **auto-increment IDs + Base62 encoding**
* Ensures:

  * No collisions
  * Short and readable URLs
  * Horizontal scalability

---

### 2. Caching Strategy

* Redis used for **read-heavy optimization**
* Flow:

  * Cache HIT → instant redirect ⚡
  * Cache MISS → DB lookup → cache store

---

### 3. Rate Limiting

* Implemented using Redis counters
* Prevents abuse and protects system

---

### 4. Expiry Handling

* Links can expire after a defined time
* Expiry validated during redirect
* TTL-based caching for cleanup

---

### 5. Analytics Tracking

* Click count tracking implemented
* Optimized using Redis for high performance

---

## 📦 API Endpoints

### ➤ Create Short URL

```
POST /api/shorten
```

**Body:**

```json
{
  "url": "https://example.com",
  "customCode": "optional",
  "expiresIn": 3600
}
```

---

### ➤ Redirect

```
GET /:shortCode
```

---

### ➤ Example Response

```json
{
  "shortUrl": "http://localhost:3000/abc123"
}
```

---

## ⚙️ Installation & Setup

```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
npm install
```

---

### Environment Variables

Create a `.env` file:

```
DATABASE_URL=your_postgres_url
REDIS_URL=your_redis_url
PORT=3000
```

---

### Run the Project

```bash
npm run dev
```

---

## 🧪 Testing

* Use Postman or Thunder Client
* Test:

  * Short URL creation
  * Redirect
  * Expiry behavior
  * Rate limiting

---

## 📚 Key Learnings

* 🧠 Designing **read-heavy scalable systems**
* ⚡ Using **Redis for caching & performance optimization**
* 🔐 Implementing **rate limiting to prevent abuse**
* 🔄 Handling **cache consistency with expiry logic**
* 🏗️ Applying **clean architecture (controller-service pattern)**
* 📊 Managing **analytics in high-traffic systems**
* 🚀 Understanding **real-world system design trade-offs**

---

## 🔥 Future Improvements

* Background jobs for analytics batching
* Distributed caching (cluster mode)
* CDN integration for global performance
* User authentication & dashboard
* Link preview & metadata

---

## 💡 Inspiration

Inspired by real-world systems like Bitly.

---

## 👨‍💻 Author

Gulshan Kathare
