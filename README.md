# 🚀 Rentkar Booking Assignment

A concurrency-safe booking management system built with **Next.js**, **MongoDB**, and **Redis**, demonstrating distributed locking, atomic updates, and containerized deployment using **Docker Compose**.

---

## 🧩 Project Overview

This application simulates a real-world partner assignment workflow — ensuring that:
- Each booking is assigned to only **one partner** (even under concurrent requests).
- **Redis Redlock** is used to prevent race conditions and double booking.
- **MongoDB** handles transactional consistency for booking and partner updates.
- A minimal **Next.js UI** shows bookings, partners, and real-time status updates.

---

## 🧱 Architecture

| Component | Description |
|------------|-------------|
| **Next.js App** | UI + API backend for managing bookings and partner assignments. |
| **MongoDB** | Stores all bookings, partners, and status information. |
| **Redis** | Handles concurrency locks, rate-limiting, and pub/sub messaging. |
| **Seed Service** | Initializes MongoDB with sample data (partners + bookings). |

All services run seamlessly using Docker Compose with a single command.

---

## ⚙️ How to Run

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/rentkar-assignment.git
cd rentkar-assignment
