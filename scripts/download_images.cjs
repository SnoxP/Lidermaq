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

const dir = path.join(process.cwd(), 'public', 'products');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function downloadAll() {
  const snap = await admin.firestore().collection('products').get();
  console.log('Total products:', snap.size);
  let ok = 0, fail = 0;
  
  for (const doc of snap.docs) {
    const d = doc.data();
    const urls = d.images || (d.image ? [d.image] : []);
    let updatedUrls = [];
    let changed = false;
    
    for (let i = 0; i < urls.length; i++) {
      const u = urls[i];
      if (u.startsWith('/products/')) {
        updatedUrls.push(u);
        continue;
      }
      
      let ext = '.png';
      if (u.includes('.jpg') || u.includes('.jpeg')) ext = '.jpg';
      else if (u.includes('.webp')) ext = '.webp';

      const filename = doc.id + '_' + i + ext;
      const filepath = path.join(dir, filename);
      
      if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
        updatedUrls.push('/products/' + filename);
        continue;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(u, { 
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const buf = Buffer.from(await res.arrayBuffer());
        
        if (buf.length < 500) throw new Error('Too small / error image');

        fs.writeFileSync(filepath, buf);
        updatedUrls.push('/products/' + filename);
        changed = true;
        ok++;
      } catch (err) {
        console.error('Failed to download', doc.id, u, err.message);
        // If file already exists use it, otherwise keep u
        if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
          updatedUrls.push('/products/' + filename);
        } else {
          updatedUrls.push(u);
        }
        fail++;
      }
    }
    
    if (changed) {
      await doc.ref.update({
        image: updatedUrls[0] || d.image,
        images: updatedUrls
      });
      console.log('Updated product', doc.id, (d.name || '').slice(0, 20), '-> local images');
    }
  }
  console.log('Done! OK:', ok, 'Failed:', fail);
  process.exit(0);
}

downloadAll();
