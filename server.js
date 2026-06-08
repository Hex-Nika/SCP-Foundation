require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.SCP_PASSWORD;

if (!PASSWORD) {
    console.error('SCP_PASSWORD not set in .env');
    process.exit(1);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, 'images');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const scpNum = req.body.scpNumber || 'unknown';
        cb(null, `scp-${scpNum}${ext}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Allowed: jpg, jpeg, png, gif, webp'));
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post('/api/verify-password', (req, res) => {
    const { password } = req.body;
    if (password === PASSWORD) {
        return res.json({ success: true });
    }
    return res.status(401).json({ success: false, message: 'Invalid password' });
});

app.post('/api/create-scp', (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ success: false, message: err.message });
            }
            return res.status(400).json({ success: false, message: err.message });
        }

        const { password, scpNumber, title, objectClass, containmentProcedures, description } = req.body;

        if (password !== PASSWORD) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        if (!scpNumber || !title || !objectClass || !containmentProcedures || !description) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const sanitizedNum = scpNumber.replace(/[^a-zA-Z0-9-]/g, '');
        const fileName = `${sanitizedNum}.html`;
        const filePath = path.join(__dirname, 'pages', 'scp', fileName);

        const classLower = objectClass.toLowerCase();
        const classMap = {
            'safe': { display: 'SAFE', css: 'scp-class-safe', color: '#4caf50' },
            'euclid': { display: 'EUCLID', css: 'scp-class-euclid', color: '#ff9800' },
            'keter': { display: 'KETER', css: 'scp-class-keter', color: '#f44336' },
            'thaumiel': { display: 'THAUMIEL', css: 'scp-class-thaumiel', color: '#2196f3' }
        };
        const cls = classMap[classLower] || classMap['safe'];

        const hasImage = req.file;
        const imageExt = hasImage ? path.extname(req.file.filename).toLowerCase() : '.jpg';
        const imagePath = `../../images/scp-${sanitizedNum}${imageExt}`;

        const imageSection = hasImage
            ? `<figure class="scp-image fade-in-element delay-3">
                    <img src="${imagePath}" alt="SCP-${sanitizedNum}">
                    <figcaption>SCP-${sanitizedNum} - ${title}</figcaption>
                </figure>`
            : '';

        const addendum = `<div class="scp-addendum fade-in-element delay-6">
                    <strong>Addendum ${sanitizedNum}-1:</strong> Further analysis and testing with SCP-${sanitizedNum} is ongoing. Personnel are advised to follow standard operating procedures and report any unusual behavior immediately. All research logs are to be submitted for review by Level 4 personnel.
                </div>`;

        const classDisplay = cls.display;
        const classCss = cls.css;

        const html = `<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SCP-${sanitizedNum} - ${title} - SCP DATABASE</title>
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="icon" href="../../images/logo.png">
</head>
<body>
    <button class="back-button" onclick="window.history.back()" title="Voltar à página anterior">
        ← Voltar
    </button>
    <header class="header">
        <div class="logo">
            <img src="../../images/logo.png" alt="SCP Foundation Logo" class="logo-img logo-pulse">
            <h1>SCP DATABASE</h1>
        </div>
        <nav class="nav">
            <a href="../../index.html">Home</a>
            <a href="../../pages/safe.html">Safe</a>
            <a href="../../pages/euclid.html">Euclid</a>
            <a href="../../pages/keter.html">Keter</a>
            <a href="../../pages/thaumiel.html">Thaumiel</a>
            <a href="../../pages/about.html">About</a>
            <a href="../../pages/contact.html">Contact</a>
            <a href="javascript:window.print()" class="btn btn-secondary">Print File</a>
        </nav>
    </header>

    <main class="main">
        <div class="container fade-in-element delay-1">
            <div class="scp-detail">
                <div class="scp-header">
                    <div class="scp-header-left">
                        <div class="scp-number-detail">SCP-${sanitizedNum}</div>
                        <div class="scp-title-detail">${title}</div>
                    </div>
                    <div class="scp-object-class">
                        <div class="label">Object Class</div>
                        <div class="value ${classCss}">${classDisplay}</div>
                    </div>
                </div>

                <div class="scp-description fade-in-element delay-2">
                    ${description.replace(/\n/g, '<br>')}
                </div>

                ${imageSection}

                <div class="scp-section fade-in-element delay-4">
                    <h3>Containment Procedures</h3>
                    <p>${containmentProcedures.replace(/\n/g, '</p><p>')}</p>
                </div>

                <div class="scp-section fade-in-element delay-5">
                    <h3>Description</h3>
                    <p>${description.replace(/\n/g, '</p><p>')}</p>
                </div>

                ${addendum}

                <div class="scp-footer fade-in-element delay-7">
                    <span>File #SCP-${sanitizedNum}</span>
                    <span>Clearance Level 2</span>
                </div>
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="footer-content">
            <div class="logo-container">
                <img src="../../images/logo.png" alt="SCP Foundation Logo" class="logo-img" style="height: 24px;">
            </div>
            <p>&copy; 2026 SCP DATABASE. All classified information. Level 4 clearance required.</p>
            <div class="footer-links">
                <a href="#">Security Notice</a>
                <a href="#">Usage Guidelines</a>
                <a href="#">FOIA Requests</a>
                <a href="#">Privacy Policy</a>
            </div>
        </div>
    </footer>
</body>
</html>`;

        fs.writeFileSync(filePath, html, 'utf-8');

        return res.json({
            success: true,
            message: `SCP-${sanitizedNum} created successfully!`,
            filePath: `pages/scp/${fileName}`,
            scpNumber: sanitizedNum
        });
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`SCP Database server running on http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/pages/admin.html`);
});
