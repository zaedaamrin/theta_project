const express = require('express');
const path = require("path");
const app = express();
const fs = require('fs');
const PORT = process.env.PORT || 8000;
app.use(express.json());

const routersPath = path.join(__dirname, "routes");

fs.readdirSync(routersPath).forEach((file) => {
  if (file.endsWith(".js")) {
    const routerModule = require(path.join(routersPath, file));

    const router = routerModule.router;

    app.use(router);
  }
});

// const router = new Router();

// // Testing our server:
// app.get('/', (req, res) => {
//   res.send('Welcome to Smart Memory!');
// });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
