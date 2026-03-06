Nearby Services Finder API

Tech Stack
FastAPI
PostgreSQL
PostGIS
SQLAlchemy
JWT Authentication

Features
User Authentication
Role Based Access
Add Service Locations
Search Nearby Services
Distance Calculation
Category Filtering


## 1️⃣ Clone the Repository

git clone https://github.com/lalita8956/Nearby_Services_Finder.git

cd nearby-services-finder


## 2️⃣ Create Virtual Environment

python3 -m venv venv


## 3️⃣ Activate Virtual Environment

Linux 

source venv/bin/activate


## 4️⃣ Install Dependencies

pip install -r requirements.txt


## 5️⃣ Setup PostgreSQL Database

Login to PostgreSQL

psql -U postgres

Create database

CREATE DATABASE nearby_services;

Connect database

\c nearby_services


## 6️⃣ Enable PostGIS Extension

CREATE EXTENSION postgis;


## 7️⃣ Run FastAPI Server

uvicorn app.main:app --reload


## 8️⃣ Open API Documentation

Swagger UI

http://127.0.0.1:8000/docs



## 9️⃣ Test APIs

Register User

POST /auth/register

Login User

POST /auth/login

Add Service

POST /services/add

Get All Services

GET /services/list

Nearby Services

GET /services/nearby?latitude=19.07&longitude=72.87&radius=10