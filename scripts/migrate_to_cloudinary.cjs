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

const CLOUD_NAME = 'zybfr2hk';
const UPLOAD_PRESET = 'lidermaq_preset';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const localDir = path.join(process.cwd(), 'public');

async function uploadToCloudinary(source) {
  const formData = new URLSearchParams();
  formData.append('upload_preset', UPLOAD_PRESET);

  if (source.startsWith('http://') || source.startsWith('https://')) {
    formData.append('file', source);
  } else if (source.startsWith('/')) {
    const localPath = path.join(localDir, source);
    if (fs.existsSync(localPath)) {
      const fileBuf = fs.readFileSync(localPath);
      const mime = source.endsWith('.jpg') || source.endsWith('.jpeg') ? 'image/jpeg' : (source.endsWith('.webp') ? 'image/webp' : 'image/png');
      formData.append('file', `data:${mime};base64,${fileBuf.toString('base64')}`);
    } else {
      throw new Error(`Local file not found: ${localPath}`);
    }
  } else {
    throw new Error(`Invalid source format: ${source}`);
  }

  const res = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.message || 'Upload error');
  }

  // Optimize with f_auto,q_auto for maximum speed & modern formats
  let secureUrl = data.secure_url;
  if (secureUrl && secureUrl.includes('/upload/') && !secureUrl.includes('/upload/f_auto,q_auto/')) {
    secureUrl = secureUrl.replace('/upload/', '/upload/f_auto,q_auto/');
  }

  return secureUrl;
}

async function migrateAll() {
  console.log(`Starting migration to Cloudinary (${CLOUD_NAME}) with preset (${UPLOAD_PRESET})...`);
  const snap = await admin.firestore().collection('products').get();
  console.log(`Found ${snap.size} products to process.`);

  let totalUpdated = 0;
  let totalErrors = 0;
  let skipped = 0;

  for (let idx = 0; idx < snap.docs.length; idx++) {
    const doc = snap.docs[idx];
    const data = doc.data();
    const originalUrls = data.images || (data.image ? [data.image] : []);
    
    if (originalUrls.length === 0) {
      console.log(`[${idx + 1}/${snap.size}] Skipping empty product: ${doc.id}`);
      skipped++;
      continue;
    }

    const newUrls = [];
    let hasChanges = false;

    for (let i = 0; i < originalUrls.length; i++) {
      const u = originalUrls[i];
      if (u.includes('res.cloudinary.com')) {
        // Ensure it has f_auto,q_auto
        let optUrl = u;
        if (!optUrl.includes('/upload/f_auto,q_auto/')) {
          optUrl = optUrl.replace('/upload/', '/upload/f_auto,q_auto/');
        }
        newUrls.push(optUrl);
        if (optUrl !== u) hasChanges = true;
        continue;
      }

      try {
        console.log(`Uploading ${doc.id} [${i + 1}/${originalUrls.length}] from: ${u.slice(0, 45)}...`);
        const cloudUrl = await uploadToCloudinary(u);
        newUrls.push(cloudUrl);
        hasChanges = true;
        // Small pause to be gentle on rate limits
        await new Promise(r => setTimeout(r, 150));
      } catch (err) {
        console.error(`Error uploading image for ${doc.id}:`, err.message);
        newUrls.push(u); // keep original as fallback
        totalErrors++;
      }
    }

    if (hasChanges && newUrls.length > 0) {
      await doc.ref.update({
        image: newUrls[0],
        images: newUrls,
        updatedAt: new Date().toISOString()
      });
      totalUpdated++;
      console.log(`✅ [${idx + 1}/${snap.size}] Updated ${doc.id} (${(data.name || '').slice(0, 30)}) -> ${newUrls[0]}`);
    } else {
      skipped++;
    }
  }

  console.log(`\n================ MIGRATION FINISHED ================`);
  console.log(`Total Products: ${snap.size}`);
  console.log(`Updated: ${totalUpdated}`);
  console.log(`Skipped / Already on Cloudinary: ${skipped}`);
  console.log(`Errors: ${totalErrors}`);
  process.exit(0);
}

migrateAll().catch(e => {
  console.error("Migration failed:", e);
  process.exit(1);
});
