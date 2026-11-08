const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const upload = multer({ storage: multer.memoryStorage() });

// 1. Şifrə Yoxlanışı
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.SITE_PASSWORD) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Şifrə səhvdir! 😡" });
    }
});

// 2. Şəkil və Özəl Gün Yükləmə
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        const { caption, uploader_name, is_special_day, special_date } = req.body;
        const fileName = `${Date.now()}-${file.originalname}`;

        const { data: storageData, error: storageError } = await supabase.storage
            .from('album')
            .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (storageError) throw storageError;

        const { data: publicUrlData } = supabase.storage.from('album').getPublicUrl(fileName);
        const imageUrl = publicUrlData.publicUrl;

        const { data: dbData, error: dbError } = await supabase
            .from('photos')
            .insert([{ 
                image_url: imageUrl, 
                caption: caption,
                uploader_name: uploader_name,
                is_special_day: is_special_day === 'true',
                special_date: special_date
            }]);

        if (dbError) throw dbError;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. Şəkilləri Gətirmə
app.get('/api/photos', async (req, res) => {
    const { data, error } = await supabase.from('photos').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 4. Məktub Yazma
app.post('/api/letters', async (req, res) => {
    const { message, author_name } = req.body;
    const { data, error } = await supabase.from('letters').insert([{ message, author_name }]);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// 5. Məktubları Gətirmə
app.get('/api/letters', async (req, res) => {
    const { data, error } = await supabase.from('letters').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.listen(port, () => {
    console.log(`Server ${port} portunda işləyir...`);
});
