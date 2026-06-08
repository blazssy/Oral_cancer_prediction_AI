# 🚀 Oral Cancer Prediction AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-4.2-brightgreen)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB)](https://reactjs.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.12-orange)](https://www.tensorflow.org/)

A comprehensive deep learning solution for early detection and prediction of oral cancer using clinical images and patient data, built with modern web technologies.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Model Architecture](#-model-architecture)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)
- [Contact](#-contact)

## ✨ Features

### 🔍 Multi-modal Analysis
- Combines image analysis with comprehensive patient data
- Analyzes clinical images of oral lesions
- Processes demographic and lifestyle factors

### 🤖 AI/ML Capabilities
- Deep learning model for accurate prediction
- Real-time image processing and analysis
- Risk assessment with confidence scoring

### 💻 User Interface
- Responsive and intuitive web interface
- Secure user authentication and authorization
- Interactive data visualization
- Patient record management system

### 📊 Data Management
- Secure patient data storage
- Image upload and management
- Comprehensive reporting system
- Data export capabilities

## 🛠 Tech Stack

### Backend
- **Framework**: Django 4.2 & Django REST Framework
- **Database**: PostgreSQL 12+ with psycopg2
- **AI/ML**: TensorFlow 2.12, scikit-learn, Keras
- **Image Processing**: OpenCV, Pillow
- **API**: RESTful API with JWT Authentication
- **Caching**: Redis
- **Task Queue**: Celery
- **Testing**: Pytest, Factory Boy

### Frontend
- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS with custom components
- **Data Visualization**: Chart.js, D3.js
- **Form Handling**: Formik with Yup validation
- **Routing**: React Router v6
- **Testing**: Jest, React Testing Library

## 📋 Prerequisites

### System Requirements
- Python 3.8 or higher
- Node.js 16.x or higher
- PostgreSQL 12 or higher
- Redis (for caching and task queue)
- Git

### Development Tools
- pip (Python package manager)
- npm or yarn (Node.js package manager)
- Virtual Environment (venv, virtualenv, or conda)
- Docker (optional, for containerization)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/Oral_cancer_prediction_AI.git
cd Oral_cancer_prediction_AI
```

### 2. Set Up Python Environment
```bash
# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Unix/macOS:
source venv/bin/activate

# Install Python dependencies
pip install -r requirements/requirements.txt
pip install -r requirements/dev.txt  # For development
```

### 3. Set Up Frontend
```bash
cd frontend
npm install
# or
yarn install
```

### 4. Database Setup
1. Create a PostgreSQL database
2. Update database configuration in `backend/settings.py`
3. Run migrations:
   ```bash
   python manage.py migrate
   ```

### 5. Environment Variables
Create a `.env` file in the project root with the following variables:
```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=your-jwt-secret
JWT_ALGORITHM=HS256
```

## ⚙️ Configuration

### Backend Configuration
- Update `backend/settings.py` with your specific configurations
- Configure media and static file settings
- Set up email backend for notifications
- Configure CORS settings if needed

### Frontend Configuration
- Update API endpoints in `frontend/src/config.js`
- Configure environment variables in `.env`
- Set up proxy configuration for development

## 🏃 Running the Application

### Development Mode

#### Backend
```bash
# Start Redis server (in a separate terminal)
redis-server

# Start Celery worker (in a separate terminal)
celery -A backend worker -l info

# Start Celery beat for scheduled tasks (in a separate terminal)
celery -A backend beat -l info

# Start Django development server
python manage.py runserver
```

#### Frontend
```bash
cd frontend
npm start
# or
yarn start
```

### Production Mode
```bash
# Build frontend for production
cd frontend
npm run build

# Collect static files
python manage.py collectstatic --noinput

# Run production server
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

## 📁 Project Structure

```
Oral_cancer_prediction_AI/
├── backend/                  # Django backend
│   ├── api/                  # API endpoints
│   ├── core/                 # Core functionality
│   ├── ml/                   # Machine learning models
│   ├── patients/             # Patient management
│   ├── predictions/          # Prediction logic
│   ├── static/               # Static files
│   ├── media/                # Uploaded media files
│   ├── manage.py             # Django management script
│   └── settings/             # Django settings
│       ├── __init__.py
│       ├── base.py
│       ├── development.py
│       └── production.py
├── frontend/                 # React frontend
│   ├── public/               # Static files
│   └── src/                  # Source files
│       ├── components/       # Reusable components
│       ├── pages/            # Page components
│       ├── services/         # API services
│       ├── store/            # Redux store
│       └── utils/            # Utility functions
├── docs/                     # Documentation
├── scripts/                  # Utility scripts
├── tests/                    # Test files
├── .env.example              # Example environment variables
├── .gitignore
├── docker-compose.yml        # Docker Compose configuration
├── Dockerfile                # Backend Dockerfile
├── Dockerfile.frontend       # Frontend Dockerfile
└── README.md                 # This file
```

## 🧠 Model Architecture

The deep learning model is built using TensorFlow and Keras, featuring:

### Model Architecture
- **Base Model**: Pre-trained EfficientNetB4
- **Custom Head**:
  - GlobalAveragePooling2D
  - Dense layers with Dropout
  - Batch Normalization
  - Output layer with Sigmoid activation

### Training Process
- **Dataset**: [Describe your dataset]
- **Input Size**: 224x224 pixels (RGB)
- **Optimizer**: Adam with learning rate scheduling
- **Loss Function**: Binary Cross-Entropy
- **Metrics**: Accuracy, Precision, Recall, AUC-ROC
- **Data Augmentation**: Random rotations, flips, brightness adjustments

### Performance Metrics
- **Accuracy**: [To be updated with actual metrics]
- **Precision**: [To be updated with actual metrics]
- **Recall**: [To be updated with actual metrics]
- **AUC-ROC**: [To be updated with actual metrics]
- **F1-Score**: [To be updated with actual metrics]

## 📚 API Documentation

### Authentication
All API endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer your-jwt-token
```

### Endpoints

#### Authentication
- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login and get JWT token
- `POST /api/auth/refresh/` - Refresh JWT token

#### Patients
- `GET /api/patients/` - List all patients (staff only)
- `POST /api/patients/` - Create a new patient
- `GET /api/patients/{id}/` - Get patient details
- `PUT /api/patients/{id}/` - Update patient
- `DELETE /api/patients/{id}/` - Delete patient

#### Images
- `POST /api/images/upload/` - Upload clinical image
- `GET /api/images/{id}/` - Get image details
- `DELETE /api/images/{id}/` - Delete image

#### Predictions
- `POST /api/predict/` - Get prediction for an image
- `GET /api/predictions/` - List all predictions
- `GET /api/predictions/{id}/` - Get prediction details

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
pytest

# Run specific test file
pytest path/to/test_file.py

# Run with coverage report
coverage run -m pytest
coverage report -m
```

### Frontend Tests
```bash
cd frontend
npm test
# or
yarn test
```

### Linting
```bash
# Backend
flake8 .
black . --check
isort . --check-only

# Frontend
cd frontend
npm run lint
```

## 🚀 Deployment

### Docker Deployment
1. Update environment variables in `.env`
2. Build and start containers:
   ```bash
   docker-compose up --build -d
   ```
3. Run migrations:
   ```bash
   docker-compose exec backend python manage.py migrate
   ```
4. Collect static files:
   ```bash
   docker-compose exec backend python manage.py collectstatic --noinput
   ```

### Manual Deployment
1. Set up a production server (Nginx + Gunicorn)
2. Configure SSL certificates (Let's Encrypt)
3. Set up a production database
4. Configure environment variables
5. Follow the production setup in the installation section

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Workflow
1. Create an issue describing the feature/bug
2. Assign the issue to yourself
3. Create a feature branch from `main`
4. Write tests for your changes
5. Ensure all tests pass
6. Update documentation if needed
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TensorFlow](https://www.tensorflow.org/) - For the deep learning framework
- [Django REST Framework](https://www.django-rest-framework.org/) - For building the API
- [React](https://reactjs.org/) - For the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) - For utility-first CSS
- [Chart.js](https://www.chartjs.org/) - For data visualization
- All contributors and open-source libraries used in this project

## 📧 Contact

Project Maintainer: [Your Name]

- Email: [your-email@example.com](mailto:your-email@example.com)
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

---

<div align="center">
  Made with ❤️ by [Your Name/Team Name]
</div>