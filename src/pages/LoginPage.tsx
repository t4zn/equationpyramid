
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { authState, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      await signUp(email, password, username);
    } else {
      await signIn(email, password);
    }
  };

  // Redirect if already logged in
  React.useEffect(() => {
    if (authState.user) {
      navigate('/home');
    }
  }, [authState.user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md">
        <Card className="border-yellow-500">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-yellow-400">
              Equation Pyramid Challenge
            </CardTitle>
            <CardDescription className="text-gray-400">
              {isSignUp ? 'Create a new account' : 'Sign in to your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-gray-200">
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="bg-gray-700 text-white border-gray-600"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-200">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-200">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-700 text-white border-gray-600"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold"
                disabled={authState.loading}
              >
                {authState.loading ? 'Processing...' : isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              variant="link" 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-yellow-400 hover:text-yellow-300"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Button>
            
            {authState.error && (
              <p className="text-red-400 text-sm text-center">{authState.error}</p>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
