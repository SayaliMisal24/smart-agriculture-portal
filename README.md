🌱 Smart Agriculture Portal

A modern, bilingual Smart Agriculture Portal designed to help farmers make better farming decisions using digital technology. The portal provides useful information and recommendations related to crops, fertilizers, pesticides, irrigation, and market prices in English and Marathi.

📌 Project Overview

The Smart Agriculture Portal is a full-stack web application developed to provide farmers with easy access to digital agricultural services through a simple and user-friendly platform.

The main goal of this project is to reduce difficulties faced by farmers in selecting crops, using fertilizers and pesticides, managing irrigation, and finding suitable market prices.

🎯 Objectives

- Provide useful agricultural information through a single platform.
- Help farmers select suitable crops.
- Provide fertilizer recommendations based on crop and farming requirements.
- Provide pesticide recommendations with proper usage guidance.
- Provide smart irrigation guidance.
- Help farmers check market prices and trends.
- Provide the platform in both English and Marathi.
- Promote the use of digital technology in agriculture.

✨ Main Features

🌾 Crop Recommendation

- Crop suggestions based on farming conditions.
- Season and location-based recommendations.
- Recommended and alternative crops.
- Growing period and water requirement information.

🧪 Fertilizer Recommendation

- Fertilizer suggestions based on crop requirements.
- Organic and chemical fertilizer recommendations.
- Quantity and application guidance.
- Estimated fertilizer cost.

🐛 Pesticide Recommendation

- Pesticide recommendations based on crop problems.
- Dosage and application guidance.
- Spray schedule.
- Safety precautions.
- Organic alternatives.

💧 Smart Irrigation

- Water requirement guidance.
- Irrigation scheduling.
- Moisture-based recommendations.
- Water-saving tips.

📊 Market Information

- Current crop prices.
- Market price comparison.
- Price trends.
- Best market suggestions.
- Profit-related information.

🌐 Bilingual Support

The portal supports:

- 🇬🇧 English
- 🇮🇳 Marathi

Users can switch languages easily from the navigation bar.

👨‍🌾 Farmer Dashboard

- Farmer profile
- Crop information
- Recommendations
- Irrigation information
- Market prices
- Activity history

🔐 Authentication

- User Registration
- Login
- Logout
- JWT Authentication
- Protected Routes
- Role-based access

🛠️ Admin Panel

- Manage users
- Manage crops
- Manage fertilizers
- Manage pesticides
- Manage market information
- Manage notifications
- Manage feedback

🏠 Home Page

The Home Page includes:

- Navigation Bar
- Hero Section
- Today's Farming Information
- Daily Farming Tips
- Market Trends
- Farmer Success Stories
- Feature Cards
- Call-to-Action Sections
- Footer

💻 Technology Stack

Frontend

- HTML5
- CSS3
- JavaScript
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Framer Motion
- React Icons
- Chart.js
- i18next

Backend

- Node.js
- Express.js
- JWT
- Multer
- Nodemailer
- REST API

Database

- MongoDB
- Mongoose
- MongoDB Atlas

Deployment

- Vercel – Frontend
- Render – Backend
- MongoDB Atlas – Database

Version Control

- Git
- GitHub

📁 Project Structure

Smart-Agriculture-Portal/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── assets/
│   │   └── utils/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore

🗄️ Database Collections

The application can use MongoDB collections such as:

- Users
- Farmers
- Crops
- Fertilizers
- Pesticides
- Crop Recommendations
- Irrigation Records
- Market Prices
- Notifications
- Feedback
- Reviews
- Complaints
- Admins

🔄 Working Flow

Farmer
   ↓
Frontend (React)
   ↓
REST API
   ↓
Backend (Node.js + Express)
   ↓
MongoDB
   ↓
Response
   ↓
Frontend
   ↓
Information / Recommendation

🔒 Security

The application includes:

- JWT Authentication
- Password Hashing
- Protected Routes
- Role-Based Access
- Input Validation
- File Validation
- Helmet
- Rate Limiting
- Environment Variables

📱 Responsive Design

The portal is designed to work on:

- 📱 Mobile
- 📱 Tablet
- 💻 Laptop
- 🖥️ Desktop

🚀 Installation

1. Clone the Repository

git clone <your-github-repository-url>
cd Smart-Agriculture-Portal

2. Install Frontend Dependencies

cd frontend
npm install

3. Install Backend Dependencies

cd ../backend
npm install

4. Configure Environment Variables

Create a ".env" file in the backend folder and add the required database and API credentials.

Example:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

5. Run Backend

npm run dev

6. Run Frontend

Open another terminal:

cd frontend
npm run dev

🧪 Testing

Each module will be tested individually before integrating it into the final application.

Testing includes:

- User Registration
- Login
- Authentication
- Crop Recommendation
- Fertilizer Recommendation
- Pesticide Recommendation
- Smart Irrigation
- Market Information
- Language Switching
- Responsive Design
- Admin Functions

📌 Future Scope

- AI-based crop recommendations
- Advanced yield prediction
- IoT-based soil and moisture monitoring
- Voice-based farmer assistance
- More regional languages
- Advanced market price prediction
- Mobile application

👥 Team

Project: Smart Agriculture Portal
Type: Full-Stack Web Application
Languages: English & Marathi

Team Members

1. Member 1 – __________________
2. Member 2 – __________________
3. Member 3 – __________________
4. Member 4 – __________________
5. Member 5 – __________________

📄 License

This project is developed for educational and academic purposes as a Computer Science Engineering project.
