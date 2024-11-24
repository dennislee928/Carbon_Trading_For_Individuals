# Carbon Offset Trading Platform

This project provides a carbon offset trading platform targeting individual users in Taiwan. The system integrates with ClimateTrade API for carbon offset services, using Next.js for the frontend, Golang for the backend, Heroku for compute instances, Supabase for the database, and Greenworld ECPay for payment processing.

## System Architecture

### 1. Frontend

- **Framework:** [Next.js](https://nextjs.org/)
- **Features:**
  - Dynamic rendering using Server-Side Rendering (SSR) and Static Site Generation (SSG).
  - API Routes for lightweight backend logic.
  - User-friendly interface for purchasing carbon offsets.

### 2. Backend

- **Language:** [Golang](https://golang.org/)
- **Responsibilities:**
  - Business logic for processing carbon offset orders.
  - Integration with ClimateTrade API.
  - Communication with the Supabase database and Greenworld ECPay payment system.

### 3. Database

- **Platform:** [Supabase](https://supabase.com/)
- **Features:**
  - Real-time updates for user transactions.
  - Role-based access and authentication for users.
  - Scalable cloud-hosted PostgreSQL backend.

### 4. Payment Integration

- **Provider:** [Greenworld ECPay](https://www.ecpay.com.tw/)
- **Capabilities:**
  - Credit card and bank transfer support.
  - Webhook integration for payment status updates.
  - Secure handling of user financial data.

### 5. Deployment

- **Compute Instance:** [Heroku](https://www.heroku.com/)
- **Benefits:**
  - Simplified deployment for rapid development.
  - Scalable to handle traffic growth.
  - Seamless integration with Golang and Supabase.

## Integrations

- climatiq(information caculate api)
- Patch(trade pot api)

## Workflow

1. **User Interaction:**

   - Users access the platform via the Next.js frontend.
   - They can calculate their carbon footprint and place carbon offset orders.

2. **Order Processing:**

   - Orders are sent to the Golang backend.
   - The backend communicates with ClimateTrade API to execute transactions.

3. **Payment Handling:**

   - Payment requests are processed via Greenworld ECPay.
   - Webhooks confirm payment success and update the Supabase database.

4. **Data Management:**
   - Supabase handles real-time transaction updates.
   - Users can view their transaction history and carbon offset certificates.

## Installation

### Prerequisites

- Node.js and npm for frontend development.
- Go environment for backend development.
- Supabase account for database integration.
- Heroku CLI for deployment.

### Steps

1. Clone this repository:

   ```bash
   git clone https://github.com/your-repo-name/carbon-offset-platform.git
   cd carbon-offset-platform
   ```

2. Set up the environment variables for:

   - ClimateTrade API
   - Supabase database connection
   - Greenworld ECPay credentials

3. Install dependencies:

   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   go mod tidy
   ```

4. Deploy the system:
   - Deploy frontend using your preferred hosting provider (e.g., Vercel, Netlify).
   - Deploy backend to Heroku using Docker or Go buildpack.

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request to propose changes or enhancements.
