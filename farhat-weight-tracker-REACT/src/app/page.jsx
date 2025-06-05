'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Login from './components/login';
import Register from './components/register';

export default function Home() {
  const [mode, setMode] = useState('login');
  const [user, setUser] = useState(null);

  const [startWeight, setStartWeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [height, setHeight] = useState('');
  const [weightHistory, setWeightHistory] = useState([]);
  const [bmi, setBmi] = useState(0);

  useEffect(() => {
    if (currentWeight && height) {
      const heightInMeters = parseFloat(height) / 100;
      const bmiCalc = parseFloat(currentWeight) / (heightInMeters ** 2);
      setBmi(bmiCalc.toFixed(2));
    }
  }, [currentWeight, height]);

  // Fetch weight history on login
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/weight/history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user}`, // Assume user is token or email-based token
          },
        });

        if (!response.ok) throw new Error('Failed to fetch history');

        const data = await response.json();
        setWeightHistory(data.history || []);
      } catch (err) {
        console.error('Error fetching history:', err.message);
      }
    };

    if (user && user !== 'Guest') {
      fetchHistory();
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!currentWeight || user === 'Guest') return;

    try {
      const now = new Date().toISOString().split('T')[0];
      const response = await fetch('http://localhost:5000/api/weight/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user}`,
        },
        body: JSON.stringify({ date: now, weight: parseFloat(currentWeight) }),
      });

      if (!response.ok) throw new Error('Failed to add weight');

      // Optimistically update chart
      setWeightHistory((prev) => [...prev, { date: now, weight: parseFloat(currentWeight) }]);
    } catch (err) {
      console.error('Error updating weight:', err.message);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 py-10">
        {mode === 'login' ? (
          <>
            <Login onLogin={(email) => setUser(email)} />
            <div className="mt-6 text-center space-y-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  className="text-blue-600 font-medium hover:underline"
                  onClick={() => setMode('register')}
                >
                  Register here
                </button>
              </p>
              <div className="flex items-center justify-center">
                <span className="h-px bg-gray-300 w-1/5"></span>
                <span className="mx-3 text-gray-500 text-sm">OR</span>
                <span className="h-px bg-gray-300 w-1/5"></span>
              </div>
              <button
                onClick={() => setUser('Guest')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded shadow inline-flex items-center transition duration-200"
              >
                Continue as Guest
              </button>
            </div>
          </>
        ) : (
          <>
            <Register onRegister={(email) => setUser(email)} />
            <p className="text-center mt-4">
              Already have an account?{' '}
              <button
                className="text-blue-600 underline"
                onClick={() => setMode('login')}
              >
                Log In
              </button>
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 relative">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setUser(null)}
          className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Log Out
        </button>
      </div>

      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">Welcome, {user}</h1>
        <h2 className="text-xl font-semibold mb-4 text-center">Farhat Gym Weight Tracker</h2>

        <div className="space-y-4">
          <input
            className="w-full p-2 border rounded"
            placeholder="Starting Weight (kg)"
            type="number"
            value={startWeight}
            onChange={(e) => setStartWeight(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Current Weight (kg)"
            type="number"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Goal Weight (kg)"
            type="number"
            value={goalWeight}
            onChange={(e) => setGoalWeight(e.target.value)}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Height (cm)"
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleUpdate}
          >
            Update Progress
          </button>
        </div>

        {bmi > 0 && (
          <div className="mt-4 text-center">
            <p className="text-lg font-medium">Your BMI: {bmi}</p>
          </div>
        )}

        {weightHistory.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Progress Chart</h2>
            <LineChart width={400} height={250} data={weightHistory}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line type="monotone" dataKey="weight" stroke="#3b82f6" />
            </LineChart>
          </div>
        )}
      </div>
    </div>
  );
}
