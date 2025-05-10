import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export function AuthForm() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const fn = isSignUp ? signUp : signIn;
    const { error } = await fn(email, password);
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xs mx-auto mt-8">
      <input
        className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <input
        className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white"
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        required
      />
      <button
        className="w-full p-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        type="submit"
        disabled={loading}
      >
        {loading ? (isSignUp ? 'Signing up...' : 'Signing in...') : (isSignUp ? 'Sign Up' : 'Sign In')}
      </button>
      <button
        className="w-full p-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp ? 'Have an account? Sign In' : 'No account? Sign Up'}
      </button>
      {error && <div className="text-red-400 text-sm text-center">{error}</div>}
    </form>
  );
} 