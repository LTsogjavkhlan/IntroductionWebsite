const https = require('https');
const fs = require('fs');
const path = require('path');

const fontFiles = [
    {
        url: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aXp-p7K4KLg.woff2',
        dest: 'assets/fonts/montserrat-v25-latin-regular.woff2'
    },
    {
        url: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw3aXp-p7K4KLg.woff',
        dest: 'assets/fonts/montserrat-v25-latin-regular.woff'
    },
    {
        url: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aXp-p7K4KLg.woff2',
        dest: 'assets/fonts/montserrat-v25-latin-700.woff2'
    },
    {
        url: 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w3aXp-p7K4KLg.woff',
        dest: 'assets/fonts/montserrat-v25-latin-700.woff'
    },
    {
        url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLDz8Z1xlFQ.woff2',
        dest: 'assets/fonts/poppins-v20-latin-300.woff2'
    },
    {
        url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLDz8Z1xlEA.woff',
        dest: 'assets/fonts/poppins-v20-latin-300.woff'
    },
    {
        url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2',
        dest: 'assets/fonts/poppins-v20-latin-600.woff2'
    },
    {
        url: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlEA.woff',
        dest: 'assets/fonts/poppins-v20-latin-600.woff'
    },
];

// Function to download a file
const downloadFile = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(() => {
                    console.log(`Downloaded: ${dest}`);
                    resolve();
                });
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { });
            console.error(`Error downloading ${url}:`, err.message);
            reject(err);
        });
    });
};

// Download all fonts
const downloadFonts = async () => {
    console.log('Downloading font files...');

    for (const font of fontFiles) {
        try {
            await downloadFile(font.url, font.dest);
        } catch (error) {
            console.error(`Failed to download ${font.url}:`, error);
        }
    }

    console.log('All fonts downloaded successfully!');
};

// Create font directory if it doesn't exist
const ensureDirExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
};

// Make sure the fonts directory exists
ensureDirExists(path.join(__dirname, 'assets', 'fonts'));

// Start downloading fonts
downloadFonts(); 