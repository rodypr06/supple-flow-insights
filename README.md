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

- **Data Storage**
  - Local browser storage (localStorage-based database)
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
   VITE_OPENAI_API_KEY=your_openai_api_key
   ```
   
   **Note:** The OpenAI API key is optional. If not provided, AI insights will not be available, but all other features will work normally.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Data Storage

SuppleFlow now uses **local browser storage** instead of a remote database. All your data is stored locally in your browser's localStorage, which means:

- **No server required** - runs entirely in your browser
- **Privacy-focused** - your data never leaves your device
- **Offline capable** - works without internet connection (except for AI insights)
- **Instant performance** - no network latency

### Data Schema

Your data is automatically organized into three main collections:

**Profiles**
- User profiles for multi-user support
- Stores username and creation timestamps

**Supplements**  
- Supplement definitions with dosage information
- Includes name, description, dosage units, recommended/max dosages
- Links to user profiles

**Intakes**
- Logged supplement intakes with timestamps
- Tracks dosage, time taken, and optional notes
- Links to both supplements and user profiles

### Data Export/Import

You can backup or transfer your data using the browser's developer tools:
1. Open Developer Tools (F12)
2. Go to Application/Storage tab
3. Find localStorage > your-domain
4. Look for the `suppleflow_db` key

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
- [OpenAI](https://openai.com/) for the AI capabilities
- [React Query](https://tanstack.com/query/latest) for data fetching and caching
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for the fast build tool
