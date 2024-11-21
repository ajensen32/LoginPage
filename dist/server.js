"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3000;
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: process.env.SECRET_KEY || "default_secret_key",
    resave: false,
    saveUninitialized: true,
}));
// Serve static files from the "public" directory
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// In-memory user store
const users = {};
// Home route with registration form
app.get("/", (req, res) => {
    res.send(`
    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="/styles.css">
      </head>
      <body>
        <div class="container">
          <h1>Welcome to the Registration Page</h1>
          <form action="/register" method="post">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <br>
            <button type="submit">Register</button>
          </form>
          <br>
          <a href="/login">Login</a>
        </div>
      </body>
    </html>
  `);
});
// Handle registration form submission
app.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
        res.send(`
      <html>
        <head>
          <link rel="stylesheet" type="text/css" href="/styles.css">
        </head>
        <body>
          <div class="container">
            <p>User ${username} already exists!</p>
            <a href="/login">Login</a>
          </div>
        </body>
      </html>
    `);
    }
    else {
        users[username] = password;
        console.log(`New user registered: ${username}`);
        res.send(`
      <html>
        <head>
          <link rel="stylesheet" type="text/css" href="/styles.css">
        </head>
        <body>
          <div class="container">
            <p>User ${username} registered successfully!</p>
            <a href="/login">Login</a>
          </div>
        </body>
      </html>
    `);
    }
});
// Login form route
app.get("/login", (req, res) => {
    res.send(`
    <html>
      <head>
        <link rel="stylesheet" type="text/css" href="/styles.css">
      </head>
      <body>
        <div class="container">
          <h1>Login Page</h1>
          <form action="/login" method="post">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <br>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <br>
            <button type="submit">Login</button>
          </form>
        </div>
      </body>
    </html>
  `);
});
// Handle login form submission
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        req.session.user = username;
        res.send(`
      <html>
        <head>
          <link rel="stylesheet" type="text/css" href="/styles.css">
        </head>
        <body>
          <div class="container">
            <p>User ${username} logged in successfully!</p>
            <a href="/logout">Logout</a>
          </div>
        </body>
      </html>
    `);
    }
    else {
        res.send(`
      <html>
        <head>
          <link rel="stylesheet" type="text/css" href="/styles.css">
        </head>
        <body>
          <div class="container">
            <p>Invalid username or password</p>
            <a href="/login">Try again</a>
          </div>
        </body>
      </html>
    `);
    }
});
// Logout route
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send(`
        <html>
          <head>
            <link rel="stylesheet" type="text/css" href="/styles.css">
          </head>
          <body>
            <div class="container">
              <p>Error logging out</p>
              <a href="/profile">Go back</a>
            </div>
          </body>
        </html>
      `);
        }
        res.send(`
      <html>
        <head>
          <link rel="stylesheet" type="text/css" href="/styles.css">
        </head>
        <body>
          <div class="container">
            <p>Logged out successfully!</p>
            <a href="/login">Login again</a>
          </div>
        </body>
      </html>
    `);
    });
});
// Page to display the username of the logged-in user
app.get("/profile", (req, res) => {
    if (req.session.user) {
        res.send(`
      <html>
        <head>
          <link rel="stylesheet" type="text/css" href="/styles.css">
        </head>
        <body>
          <div class="container">
            <h1>Hello, ${req.session.user}!</h1>
            <a href="/logout">Logout</a>
          </div>
        </body>
      </html>
    `);
    }
    else {
        res.send(`
      <html>
        <head>
          <link rel="stylesheet" type="text/css" href="/styles.css">
        </head>
        <body>
          <div class="container">
            <p>You are not logged in.</p>
            <a href="/login">Login</a>
          </div>
        </body>
      </html>
    `);
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
