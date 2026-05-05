// node videos.js

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bazardjamel';

const Video = mongoose.model('Video', new mongoose.Schema({}, { strict: false }), 'videos');

async function connectDB() {
  console.log('🔌 Conectando a MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Conectado\n');
}

async function videos() {
  console.log('🔧 ============ REPARANDO VIDEOS ANTIGUOS ==========\n');
  
  // Función para extraer public_id de URL
  const extractPublicIdFromUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;
    
    // Limpiar transformaciones
    let cleanUrl = url;
    cleanUrl = cleanUrl.replace(/\/l_audio:[^/]+,fl_layer_apply\//g, '/');
    cleanUrl = cleanUrl.replace(/\/upload\/l_audio:[^,]+,fl_layer_apply\//, '/upload/');
    
    const match = cleanUrl.match(/\/upload\/(?:v\d+\/)?(.+?)\.(mp4|mov|webm)/);
    if (match) {
      return match[1];
    }
    return null;
  };
  
  // Buscar videos antiguos (sin videoPublicId o sin music.audioPublicId)
  const videos = await Video.find({
    $or: [
      { videoPublicId: { $exists: false } },
      { videoPublicId: null },
      { videoPublicId: '' },
      { 'music.audioPublicId': { $exists: false } },
      { 'music.audioPublicId': null }
    ]
  });
  
  console.log(`📊 Videos a reparar: ${videos.length}\n`);
  
  let fixed = 0;
  
  for (const video of videos) {
    let needsSave = false;
    
    // Reparar videoPublicId
    if (!video.videoPublicId && video.videoUrl) {
      const publicId = extractPublicIdFromUrl(video.videoUrl);
      if (publicId) {
        video.videoPublicId = publicId;
        needsSave = true;
        console.log(`✅ ${video.title || 'Sin título'}: videoPublicId = ${publicId}`);
      }
    }
    
    // Reparar music.audioPublicId si tiene música
    if (video.music && video.music.audioUrl && !video.music.audioPublicId) {
      // Intentar extraer de la URL de audio
      const audioMatch = video.music.audioUrl.match(/\/upload\/(?:v\d+\/)?(.+?)\./);
      if (audioMatch) {
        video.music.audioPublicId = audioMatch[1];
        needsSave = true;
        console.log(`🎵 ${video.music.title}: audioPublicId = ${audioMatch[1]}`);
      }
    }
    
    // Si tiene música pero no está procesada, marcarla
    if (video.music && video.music.audioPublicId && !video.music.processed) {
      video.music.processed = true;
      needsSave = true;
      console.log(`🎵 ${video.music.title}: marcada como procesada`);
    }
    
    if (needsSave) {
      await video.save();
      fixed++;
    }
  }
  
  console.log(`\n✅ Reparados ${fixed} videos`);
}

async function main() {
  try {
    await connectDB();
    await videos();
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();