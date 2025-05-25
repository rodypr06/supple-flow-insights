# SuppleFlow - Supplement Tracking & Management

SuppleFlow is a modern web application designed to help users track and manage their supplement intake, get AI-powered insights, and maintain a healthy supplement regimen.

## Features

- **User Profile Management**
  - Create and manage multiple user profiles
  - Secure authentication with Supabase
  - Persistent data storage

- **Supplement Management**
  - Add and track multiple supplements
  - Set recommended dosages and units
  - Track supplement inventory
  - View supplement history

- **Intake Tracking**
  - Log supplement intakes with dosage and notes
  - Calendar view of intake history
  - Daily dosage tracking
  - Intake history with filtering

- **AI-Powered Insights**
  - Personalized supplement recommendations
  - Intake pattern analysis
  - Safety and optimization suggestions
  - Real-time insights based on your data

- **Modern UI/UX**
  - Dark/Light theme support
  - Responsive design
  - Intuitive navigation
  - Loading states and error handling
  - Toast notifications

## Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - Shadcn UI Components
  - React Query for data fetching
  - React Router for navigation

- **Backend**
  - Supabase for database and authentication
  - OpenAI API for AI insights

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/supple-flow.git
   cd supple-flow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Database Schema

### Profiles
- id: string (primary key)
- username: string
- created_at: timestamp
- updated_at: timestamp

### Supplements
- id: string (primary key)
- name: string
- description: string
- dosage_unit: string
- recommended_dosage: number
- user_id: string (foreign key to profiles)
- created_at: timestamp
- updated_at: timestamp

### Intakes
- id: string (primary key)
- supplement_id: string (foreign key to supplements)
- user_id: string (foreign key to profiles)
- dosage: number
- taken_at: timestamp
- notes: string
- created_at: timestamp

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful UI components
- [Supabase](https://supabase.com/) for the backend infrastructure
- [OpenAI](https://openai.com/) for the AI capabilities
- [React Query](https://tanstack.com/query/latest) for data fetching and caching
- [Tailwind CSS](https://tailwindcss.com/) for styling
