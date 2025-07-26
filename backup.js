import express from 'express';
const app = express();
app.use(express.json());


// Define routes
app.get('/', (req, res) => {
  res.json({ message: 'Email service is running' });
});

app.post('/send-email', sendEmail);

// Error handling for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
