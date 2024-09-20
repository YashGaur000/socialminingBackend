process.env.NODE_OPTIONS = '--tls-min-v1.2';
const app = require('./app');
require('dotenv').config();
const { getDatabase } = require('./config/db');
getDatabase();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
