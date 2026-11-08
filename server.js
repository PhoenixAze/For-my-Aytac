const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Frontend faylları public qovluğunda olacaq

// Supabase bağlantısı
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Şəkil yükləmək üçün multer ayarı (yaddaşda saxlayıb supabase-ə atacağıq)
const upload = multer({ storage: multer.memoryStorage() });

// 1. Şifrə Yoxlanışı API
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.SITE_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Şifrə səhvdir! 😡" });
    }
});

// 2. Şəkil Yükləmə API
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        const caption = req.body.caption;
        const fileName = `${Date.now()}-${file.originalname}`;

        // Supabase Storage-ə yükləmə
        const { data: storageData, error: storageError } = await supabase.storage
            .from('album')
            .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (storageError) throw storageError;

        // Şəklin public URL-ni almaq
        const { data: publicUrlData } = supabase.storage.from('album').getPublicUrl(fileName);
        const imageUrl = publicUrlData.publicUrl;

        // Verilənlər bazasına (Table) yazmaq
        const { data: dbData, error: dbError } = await supabase
            .from('photos')
            .insert([{ image_url: imageUrl, caption: caption }]);

        if (dbError) throw dbError;

        res.json({ success: true, imageUrl, caption });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. Şəkilləri Gətirmə API
app.get('/api/photos', async (req, res) => {
    const { data, error } = await supabase.from('photos').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 4. Məktub Yazma API
app.post('/api/letters', async (req, res) => {
    const { message } = req.body;
    const { data, error } = await supabase.from('letters').insert([{ message }]);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// 5. Məktubları Gətirmə API
app.get('/api/letters', async (req, res) => {
    const { data, error } = await supabase.from('letters').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server ${port} portunda işləyir...`);
});