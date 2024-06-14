const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware pour servir les fichiers statiques
app.use(express.static('public'));

// Configuration de multer pour le téléchargement de fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Fonction pour générer le tableau HTML responsive
const generateHtmlTable = (filePath, openNewTab) => {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    // Trouver l'index de la colonne URL si elle existe
    const urlColumnIndex = data[0].indexOf('URL');

    let html = `
<div class="product-table-container">
    <ul class="product-table-responsive">
        <li class="product-table-row product-table-header">
            <div class="product-table-col product-table-col1">
                <p><b>${data[0][0]}</b></p>
            </div>
            <div class="product-table-col product-table-col2">
                <p><b>${data[0][1]}</b></p>
            </div>
            <div class="product-table-col product-table-col3">
                <p><b>${data[0][2]}</b></p>
            </div>
            <div class="product-table-col product-table-col4">
                <p><b>${data[0][3]}</b></p>
            </div>
            <div class="product-table-col product-table-col5">
                <p><b>${data[0][4]}</b></p>
            </div>
        </li>`;

    for (let i = 1; i < data.length; i++) {
        const rowClass = i % 2 === 0 ? 'product-table-row1' : 'product-table-row2';
        const url = urlColumnIndex !== -1 && data[i][urlColumnIndex] ? data[i][urlColumnIndex] : '#';
        const modele = data[i][0] ? data[i][0] : '';
        const typeEtalonnage = data[i][1] ? data[i][1] : '';
        const gammeFrequences = data[i][2] ? data[i][2] : '';
        const deplacementMaximal = data[i][3] ? data[i][3] : '';
        const normes = data[i][4] ? data[i][4] : '';
        const target = openNewTab ? ' target="_blank"' : '';
        html += `
        <li class="product-table-row ${rowClass}">
            <div class="product-table-col product-table-col1">
                <p><a href="${url}"${target}>${modele}</a></p>
            </div>
            <div class="product-table-col product-table-col2">
                <p><span class="product-table-txt-mobile-display">${data[0][1]} : </span>${typeEtalonnage}</p>
            </div>
            <div class="product-table-col product-table-col3">
                <p><span class="product-table-txt-mobile-display">${data[0][2]} : </span>${gammeFrequences}</p>
            </div>
            <div class="product-table-col product-table-col4">
                <p><span class="product-table-txt-mobile-display">${data[0][3]} : </span>${deplacementMaximal}</p>
            </div>
            <div class="product-table-col product-table-col6">
                <p>${normes}</p>
            </div>
        </li>`;
    }

    html += `
    </ul>
</div>`;

    return html;
};

// Endpoint pour le téléchargement de fichier et la génération de HTML
app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const openNewTab = req.body.openNewTab === 'true';
    const htmlTable = generateHtmlTable(filePath, openNewTab);
    res.send(htmlTable);
});

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
