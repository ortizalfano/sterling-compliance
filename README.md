# Sterling & Associates - Transaction Lookup System

A modern web application for Sterling & Associates to help customers find and manage their transactions. Built with React, TypeScript, and integrated with Airtable and Google Gemini AI.

## 🚀 Features

- **Transaction Lookup**: Search transactions using the last 4 digits of a card
- **AI-Powered Chatbot**: Intelligent assistance powered by Google Gemini
- **Airtable Integration**: Real-time data from Airtable database
- **Email Notifications**: Automated email system using EmailJS
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Dark Mode**: Toggle between light and dark themes

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **AI Integration**: Google Gemini AI
- **Database**: Airtable API
- **Email Service**: EmailJS
- **Icons**: Lucide React

## 📱 Pages

1. **Home Page**: Main landing with help options
2. **Transaction Lookup**: Search form for finding transactions
3. **Purchase Found**: Transaction details and action options
4. **Options Page**: Additional help options
5. **Chat Widget**: AI-powered assistance

## 🔧 Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Airtable account with Personal Access Token
- Google Gemini API key
- EmailJS account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/sterling-web.git
cd sterling-web
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Configure environment variables in `.env`:
```env
# Airtable Configuration
VITE_AIRTABLE_API_KEY=your_personal_access_token
VITE_AIRTABLE_BASE_ID=your_base_id
VITE_AIRTABLE_TABLE_NAME=Transactions

# Google Gemini Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

5. Start development server:
```bash
npm run dev
```

## 🌐 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push

### Other Platforms

- **Netlify**: Connect GitHub and configure environment variables
- **GitHub Pages**: For static hosting (requires public repo)

## 📊 Airtable Schema

The application expects the following Airtable table structure:

| Field Name | Type | Description |
|------------|------|-------------|
| Created | Date with time | Transaction date |
| Invoice | Single line text | Invoice number |
| Customer | Single line text | Customer name |
| Card Number | Single line text | Full card number |
| Card Type | Single select | Visa, Master, Amex, Discover |
| Auth | Number | Authorization code |
| Transaction ID | Single line text | Unique identifier |
| Message | Long text | Transaction message |
| User | Single line text | User information |
| Source | Single line text | Transaction source |
| Response | Single select | Approved, Declined |
| Status | Single select | Pending, Completed, Refunded |
| Type | Single select | Credit Card Sale, Refund, Other |
| Amount | Currency USD | Transaction amount |

## 🤖 AI Chatbot

The chatbot uses Google Gemini AI to:
- Help users find transactions
- Provide assistance with refunds, cancellations, and payment updates
- Send automated emails for user requests
- Maintain conversation context

## 📧 Email System

EmailJS integration handles:
- Refund requests
- Cancellation requests  
- Payment update requests
- Automatic email notifications

## 🎨 Design System

- **Primary Colors**: Amber/Gold (#FFD700, #F59E0B)
- **Typography**: Inter font family
- **Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: 1024px+

## 🔒 Security

- All sensitive data stored in environment variables
- No hardcoded credentials in source code
- Airtable Personal Access Tokens for secure API access
- EmailJS for secure email delivery

## 📝 License

This project is proprietary software for Sterling & Associates.

## 👥 Support

For technical support or questions, please contact the development team.

---

**Sterling & Associates** - Secure Transaction Management

