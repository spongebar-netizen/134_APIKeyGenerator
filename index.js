const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const port = 3000;
const db = require('./models');

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Ini biar HTML bisa dibuka di localhost:3000

// ==========================================
// 1. REGISTER USER (SIMPAN DATA)
// ==========================================
app.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;

        // Generate Key
        const newApiKey = crypto.randomBytes(16).toString('hex');
        
        // Simpan ke Database
        const newUser = await db.User.create({
            firstName, lastName, email, api_key: newApiKey, status: 'Aktif'
        });

        res.status(201).json({ success: true, message: 'Berhasil disimpan', data: newUser });
    } catch (error) {
        console.error("Error Register:", error); // Cek terminal kalo gagal!
        res.status(500).json({ message: 'Gagal menyimpan user (Cek database/Email duplikat)' });
    }
});

// ==========================================
// 2. ADMIN LOGIN (LOGIN)
// ==========================================
app.post('/admin-login', (req, res) => {
    const { email, password } = req.body;
    
    // Cek console terminal biar tau ada request masuk
    console.log("Login attempt:", email, password);

    if (email === 'admin@admin.com' && password === 'admin') {
        res.json({ success: true, message: "Login Berhasil" });
    } else {
        res.status(401).json({ success: false, message: 'Email atau Password Salah' });
    }
});

// ==========================================
// 3. GET USERS (DASHBOARD)
// ==========================================
app.get('/users', async (req, res) => {
    try {
        const users = await db.User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error database' });
    }
});

// ==========================================
// 4. DELETE USER
// ==========================================
app.delete('/users/:id', async (req, res) => {
    try {
        await db.User.destroy({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Gagal hapus' });
    }
});

app.listen(port, () => console.log(`Server PWSPRAK8 jalan di port ${port}`));