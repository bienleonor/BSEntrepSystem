import app from './app.js';
import fs from 'fs';

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT,  () => {
  console.log(`Server running on port ${PORT}`);
});
