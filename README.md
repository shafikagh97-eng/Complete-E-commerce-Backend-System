# Project Description

Complete E-commerce Backend System
Build a full-featured e-commerce backend with authentication, product management, orders, payments, and admin dashboard
Node.js with Express.js framework

## Features

- Full CRUD (Create, Read, Update, Delete) operations for product ,user,review,order,cart
- RESTful API Design
  Built following REST principles with predictable, resource-based endpoints and standard HTTP methods.
- MongoDB with Mongoose ODM for database operations
- JWT authentication with refresh tokens stored in HTTP-only cookies
- Argon2 for secure password hashing during registration/login
- Express-validator for comprehensive request validation
- Multer for file uploads with Cloudinary integration for image storage
- Nodemailer for sending transactional emails (order confirmations, password reset)
- Helmet.js for setting secure HTTP headers
- CORS configuration for cross-origin requests
- Rate limiting to prevent brute force attacks
- XSS protection for input sanitization
- use ethereal.email to verify with email or updatepassword or confirm order

## Setup & Installation Instructions

1. Clone the Repository
   First, clone the project from GitHub:

2. Install Dependencies
   Make sure you have Node.js (v16+) and npm installed.
   Then, install all required dependencies:
   npm install

3. Configure Environment Variables

Create a .env file in the root directory and add the following variables:

MONGO_URL=mongodb+srv://shafikagh97_db_user:dda3vIgit5ttwrEE@e-commerce.9k0hpqa.mongodb.net/?appName=E-commerce

PORT=3000

SECRET_ACCESS_TOKEN_KEY="nB8xR2qL9pZ3mK6vT1sF7gH4jD5cW8yA2"

SECRET_REFRESH_TOKEN_KEY="X5tL9mR3pK8vB2sN6cJ4hG7fD1zQ9wE5"

ADMIN_EMAIL="admin@gmail.com"

ADMIN_PASS="admin12345@SUPER"

ADMIN_NAME="root"

CLOUD_NAME="dsynk5uka"

API_KEY_CLOUD='624211657916669'

API_SECRET_CLOUD='zGHw3E_9x6RarwNaFlZ37_YmmX8'

5. Start the Server
   Run the following command to start the API:

npm run start

6. create admin
   Run the following command to create admin:

   npm run admin:seed

Once running, the server will be available at:

http://localhost:3000

7.  Test the API
    Use Postman to test endpoints, or run the included collection:
    
    [visit] (https://documenter.getpostman.com/view/49214327/2sB3dQwpyC)
    
9. deployed to Render.com on domain :

    
    [visit] (https://complete-e-commerce-backend-system.onrender.com)
Configure the environment variables (base URL, etc.)

## Folder Structure :

```

├── src/
│ ├── models/
│ │ ├── User.js
│ │ ├── Product.js
│ │ ├── Category.js
│ │ ├── Cart.js
│ │ ├── Order.js
│ │ ├── Review.js
│ │ └── Token.js
│ │
│ ├── validation/
│ │ ├── authValidation.js
│ │ ├── productValidation.js
│ │ ├── orderValidation.js
│ │ ├── userValidation.js
│ │ └── tokenValidation.js
│ │
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── productController.js
│ │ ├── cartController.js
│ │ ├── orderController.js
│ │ ├── reviewController.js
│ │ ├── userController.js
│ │ └── adminController.js
│ │
│ ├── routes/
│ │ ├── authRoutes.js
│ │ ├── productRoutes.js
│ │ ├── cartRoutes.js
│ │ ├── orderRoutes.js
│ │ ├── reviewRoutes.js
│ │ ├── userRoutes.js
│ │ └── adminRoutes.js
│ │
│ ├── middlewares/
│ │ ├── authMiddleware.js
│ │ ├── errorMiddleware.js
│ │ ├── notFoundMiddleware.js
│ │ ├── validationMiddleware.js
│ │ ├── uploadMiddleware.js
│ │ ├── rateLimitMiddleware.js
│ │ └── tokenMiddleware.js
│ │
│ ├── utils/
│ │ ├── asyncHandler.js
│ │ ├── sendEmail.js
│ │ ├── cloudinary.js
│ │ ├── generateToken.js
│ │ ├── apiFeatures.js
│ │ ├── generateResetToken.js
│ │ └── passwordUtils.js
│ │
│ └── app.js
├── package.json
├── .env
├── .env.example
├── .gitignore
└── README.md
```
