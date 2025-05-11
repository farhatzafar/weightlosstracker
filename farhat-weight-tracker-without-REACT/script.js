document.addEventListener('DOMContentLoaded', function () {
    const app = document.getElementById('app');
    let mode = 'login';
    let user = null;
    let token = null;

    const updateBMI = (weight, height) => {
        const hMeters = parseFloat(height) / 100;
        return (parseFloat(weight) / (hMeters ** 2)).toFixed(2);
    };

    const API_BASE = 'http://localhost:3000'; // Change if backend uses a different port

    const loginUser = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) throw new Error('Login failed');
            const data = await response.json();
            token = data.token;
            user = email;
            renderWeightTrackerPage();
        } catch (err) {
            alert('Login failed: ' + err.message);
        }
    };

    const registerUser = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (!response.ok) throw new Error('Registration failed');
            const data = await response.json();
            token = data.token;
            user = email;
            renderWeightTrackerPage();
        } catch (err) {
            alert('Registration failed: ' + err.message);
        }
    };

    const postWeight = async (weight) => {
        try {
            const response = await fetch(`${API_BASE}/weight`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ weight })
            });
            if (!response.ok) throw new Error('Failed to save weight');
            console.log('Weight updated');
        } catch (err) {
            alert('Error saving weight: ' + err.message);
        }
    };

    const renderLoginPage = () => {
        app.innerHTML = `
            <div class="max-w-md mx-auto bg-white p-6 rounded shadow">
                <div class="space-y-4">
                    <h2 class="text-2xl font-bold text-center mb-4">Login</h2>
                    <form id="login-form">
                        <input type="email" id="login-email" placeholder="Email" required class="w-full p-2 border mb-4 rounded" />
                        <input type="password" id="login-password" placeholder="Password" required class="w-full p-2 border mb-4 rounded" />
                        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Log In</button>
                    </form>
                    <p class="text-center mt-4">Don't have an account? <a href="#" id="register-link" class="text-blue-600">Register here</a></p>
                    <button id="guest-button" class="w-full bg-gray-100 text-gray-800 py-2 rounded mt-4">Continue as Guest</button>
                </div>
            </div>
        `;

        document.getElementById('login-form').addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            loginUser(email, password);
        });

        document.getElementById('register-link').addEventListener('click', (e) => {
            e.preventDefault();
            renderRegisterPage();
        });

        document.getElementById('guest-button').addEventListener('click', () => {
            user = 'Guest';
            renderWeightTrackerPage();
        });
    };

    const renderRegisterPage = () => {
        app.innerHTML = `
            <div class="max-w-md mx-auto bg-white p-6 rounded shadow">
                <h2 class="text-2xl text-center mb-4">Register</h2>
                <form id="register-form">
                    <input type="email" id="register-email" placeholder="Email" required class="w-full p-2 border mb-4 rounded" />
                    <input type="password" id="register-password" placeholder="Password" required class="w-full p-2 border mb-4 rounded" />
                    <button type="submit" class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Register</button>
                </form>
                <p class="text-center mt-4">Already have an account? <a href="#" id="login-link" class="text-blue-600">Log In</a></p>
            </div>
        `;

        document.getElementById('register-form').addEventListener('submit', function (e) {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            registerUser(email, password);
        });

        document.getElementById('login-link').addEventListener('click', (e) => {
            e.preventDefault();
            renderLoginPage();
        });
    };

    const renderWeightTrackerPage = () => {
        app.innerHTML = `
            <div class="max-w-md mx-auto bg-white p-6 rounded shadow">
                <h2 class="text-2xl text-center mb-4">Welcome, ${user}</h2>
                <div class="space-y-4">
                    <input id="current-weight" type="number" placeholder="Current Weight (kg)" class="w-full p-2 border rounded" />
                    <input id="height" type="number" placeholder="Height (cm)" class="w-full p-2 border rounded" />
                    <button id="update-progress" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update Progress</button>
                </div>
                <div id="bmi-result" class="text-center mt-4 hidden">
                    <p class="text-lg font-medium">Your BMI: <span id="bmi-value"></span></p>
                </div>
                <button id="logout-button" class="w-full bg-red-500 text-white py-2 rounded mt-4">Log Out</button>
            </div>
        `;

        document.getElementById('update-progress').addEventListener('click', async function () {
            const weight = document.getElementById('current-weight').value;
            const height = document.getElementById('height').value;
            if (weight && height) {
                const bmi = updateBMI(weight, height);
                document.getElementById('bmi-value').innerText = bmi;
                document.getElementById('bmi-result').classList.remove('hidden');
                if (user !== 'Guest') {
                    await postWeight(weight);
                }
            }
        });

        document.getElementById('logout-button').addEventListener('click', function () {
            user = null;
            token = null;
            renderLoginPage();
        });
    };

    renderLoginPage();
});
