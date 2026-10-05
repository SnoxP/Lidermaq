const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};
if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const key = process.env.VITE_IMGBB_API_KEY || '5325c6bbb371496140e75448bb7369cb';
const productsDir = path.join(process.cwd(), 'public', 'products');

async function uploadFile(filePath) {
  const file = fs.readFileSync(filePath);
  const base64 = file.toString('base64');
  const params = new URLSearchParams();
  params.append('key', key);
  params.append('image', base64);

  const res = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: params
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || 'Upload failed');
  return data.data.url;
}

async function run() {
  const snap = await admin.firestore().collection('products').get();
  console.log('Total products:', snap.size);
  let updated = 0;

  for (const doc of snap.docs) {
    const d = doc.data();
    
    // Find matching files in public/products
    let localFiles = [];
    for (let i = 0; i < 10; i++) {
      const candidates = [
        path.join(productsDir, `${doc.id}_${i}.png`),
        path.join(productsDir, `${doc.id}_${i}.jpg`),
        path.join(productsDir, `${doc.id}_${i}.webp`)
      ];
      const found = candidates.find(f => fs.existsSync(f));
      if (found) localFiles.push(found);
    }

    if (localFiles.length === 0) {
      console.log('No local files for', doc.id, d.name);
      continue;
    }

    try {
      const uploadedUrls = [];
      for (const f of localFiles) {
        const u = await uploadFile(f);
        uploadedUrls.push(u);
        // Small pause to be nice to rate limits
        await new Promise(r => setTimeout(r, 200));
      }

      await doc.ref.update({
        image: uploadedUrls[0],
        images: uploadedUrls
      });
      console.log(`[${++updated}/${snap.size}] Uploaded ${doc.id}: ${uploadedUrls[0]}`);
    } catch (err) {
      console.error('Failed to upload for', doc.id, err.message);
    }
  }

  console.log('Done uploading all products!');
  process.exit(0);
}

run();
