import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import session from "express-session";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY || "default_secret_key",
    resave: false,
    saveUninitialized: true,
  })
);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "../public")));

// Extend the Session interface
declare module "express-session" {
  interface Session {
    user?: string;
  }
}

// In-memory user store
const users: { [key: string]: string } = {};

// Home route with registration form
app.get("/", (req: Request, res: Response) => {
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
app.post("/register", (req: Request, res: Response) => {
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
  } else {
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
app.get("/login", (req: Request, res: Response) => {
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
app.post("/login", (req: Request, res: Response) => {
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
  } else {
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
app.get("/logout", (req: Request, res: Response) => {
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
app.get("/profile", (req: Request, res: Response) => {
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
  } else {
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
