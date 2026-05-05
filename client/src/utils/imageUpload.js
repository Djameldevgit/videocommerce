// utils/imageUpload.js
export const checkImage = (files, currentImagesCount = 0) => {
  let err = "";
  if (!files || files.length === 0) return err = "No files selected.";

  const maxImages = 2;
  if (files.length > maxImages) {
    err = `Solo puedes subir máximo ${maxImages} imágenes.`;
    return err;
  }

  if (currentImagesCount + files.length > maxImages) {
    err = `Máximo ${maxImages} imágenes permitidas por post.`;
    return err;
  }

  const allowedExtensions = ['jpeg', 'jpg', 'png', 'webp'];
  const blockedExtensions = ['txt', 'pdf', 'doc', 'exe'];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      err = "Cada imagen debe ser menor a 2MB.";
      return err;
    }

    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      err = "Formatos permitidos: JPG, PNG, WebP.";
      return err;
    }

    if (blockedExtensions.includes(fileExtension)) {
      err = "Tipo de archivo no permitido.";
      return err;
    }
  }

  return err;
};

// ✅ NUEVA FUNCIÓN: Validar video
 
// Función existente para imágenes
export const imageUpload = async (images) => {
  console.log('🟡 INICIANDO imageUpload - Total imágenes:', images?.length || 0);

  let imgArr = [];
  let uploadedCount = 0;

  for(const [index, item] of images.entries()){ 
      console.log(`\n🔄 Procesando imagen ${index + 1}:`, item);

      if (item.url && item.url.startsWith('blob:') && !item.isExisting) {
          console.log('🔄 Convirtiendo blob URL a archivo...');
          
          try {
              const response = await fetch(item.url);
              if (!response.ok) throw new Error('No se pudo acceder al blob');
              
              const blob = await response.blob();
              const file = new File([blob], item.name || `image-${Date.now()}.jpg`, { 
                  type: blob.type || 'image/jpeg' 
              });

              console.log('📁 Blob convertido a File:', file.name, `${(file.size / 1024).toFixed(2)} KB`);

              const formData = new FormData();
              formData.append("file", file);
              formData.append("upload_preset", "vetementsdjamel");
              formData.append("cloud_name", "dfjipgj2o");

              console.log('🌐 Enviando a Cloudinary...');
              
              const res = await fetch("https://api.cloudinary.com/v1_1/dfjipgj2o/image/upload", {
                  method: "POST",
                  body: formData
              });

              if (!res.ok) {
                  const errorText = await res.text();
                  throw new Error(`Cloudinary error: ${res.status} - ${errorText}`);
              }

              const data = await res.json();
              
              console.log('✅ UPLOAD EXITOSO a Cloudinary:', {
                  public_id: data.public_id,
                  url: data.secure_url,
                  formato: data.format
              });

              imgArr.push({
                  public_id: data.public_id, 
                  url: data.secure_url
              });
              uploadedCount++;

          } catch (error) {
              console.error(`❌ ERROR procesando imagen ${index + 1}:`, error.message);
              continue;
          }
      }
      else if (item.isExisting && item.url && item.url.includes('cloudinary.com')) {
          console.log('✅ Imagen ya en Cloudinary:', item.public_id);
          imgArr.push({
              public_id: item.public_id,
              url: item.url
          });
          uploadedCount++;
      }
      else {
          console.warn('⚠️ Imagen no procesable, saltando:', item);
      }
  }

  console.log('\n📊 RESUMEN FINAL:');
  console.log('✅ Subidas a Cloudinary:', uploadedCount);
  console.log('📦 Array resultante:', imgArr);
  
  return imgArr;
};

// utils/audioUpload.js
// Subida a Cloudinary usando el endpoint correcto
// utils/audioUpload.js
// Asegúrate que esta función retorna el public_id correctamente
// utils/imageUpload.js - Asegúrate que esta función existe
// utils/imageUpload.js
export const audioUpload = async (audioSource, onProgress) => {
  try {
      console.log("🎵 Iniciando audioUpload con:", typeof audioSource);
      
      let file;
      
      // ✅ Caso 1: Es un File object (subida directa)
      if (audioSource instanceof File) {
          file = audioSource;
          console.log("📁 Es File directo:", file.name, file.size);
      }
      // ✅ Caso 2: Es una URL
      else if (typeof audioSource === 'string') {
          console.log("🌐 Descargando audio desde URL...");
          
          // Timeout más largo
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 45000);
          
          try {
              const response = await fetch(audioSource, { 
                  signal: controller.signal,
                  headers: {
                      'Accept': 'audio/mpeg,audio/*;q=0.9'
                  }
              });
              clearTimeout(timeoutId);
              
              if (!response.ok) {
                  throw new Error(`HTTP ${response.status}: ${response.statusText}`);
              }
              
              const audioBlob = await response.blob();
              console.log(`✅ Audio descargado: ${audioBlob.size} bytes`);
              
              if (audioBlob.size < 1000) {
                  throw new Error('Archivo de audio muy pequeño (posiblemente corrupto)');
              }
              
              file = new File([audioBlob], `music_${Date.now()}.mp3`, { type: 'audio/mpeg' });
              
          } catch (fetchError) {
              clearTimeout(timeoutId);
              throw new Error(`Error descargando: ${fetchError.message}`);
          }
      }
      else {
          throw new Error('Fuente de audio no válida');
      }
      
      // ✅ Subir a Cloudinary con reintentos
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'vetementsdjamel');
      formData.append('cloud_name', 'dfjipgj2o');
      formData.append('resource_type', 'auto');
      
      // ✅ Intentar hasta 3 veces
      let lastError;
      for (let attempt = 1; attempt <= 3; attempt++) {
          try {
              console.log(`📤 Intento ${attempt} de subida a Cloudinary...`);
              
              const result = await new Promise((resolve, reject) => {
                  const xhr = new XMLHttpRequest();
                  xhr.open('POST', 'https://api.cloudinary.com/v1_1/dfjipgj2o/upload');
                  
                  xhr.upload.onprogress = (e) => {
                      if (e.lengthComputable && onProgress) {
                          const percent = Math.round((e.loaded * 100) / e.total);
                          onProgress(percent);
                      }
                  };
                  
                  xhr.onload = () => {
                      if (xhr.status === 200) {
                          const data = JSON.parse(xhr.responseText);
                          resolve(data);
                      } else {
                          reject(new Error(`HTTP ${xhr.status}`));
                      }
                  };
                  
                  xhr.onerror = () => reject(new Error('Network error'));
                  xhr.send(formData);
              });
              
              console.log("✅ Subida exitosa a Cloudinary:", {
                  public_id: result.public_id,
                  url: result.secure_url.substring(0, 80)
              });
              
              return { 
                  public_id: result.public_id, 
                  url: result.secure_url,
                  duration: result.duration,
                  format: result.format
              };
              
          } catch (err) {
              lastError = err;
              console.error(`❌ Intento ${attempt} falló:`, err.message);
              if (attempt < 3) {
                  await new Promise(resolve => setTimeout(resolve, 2000));
              }
          }
      }
      
      throw lastError || new Error('Error después de 3 intentos');
      
  } catch (error) {
      console.error('❌ audioUpload fatal:', error);
      throw new Error(`Error subiendo audio: ${error.message}`);
  }
};
// utils/videoUpload.js
// utils/imageUpload.js (añadir esta función)
export const videoUpload = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'vetementsdjamel');
  formData.append('cloud_name', 'dfjipgj2o');
  formData.append('resource_type', 'video');
  
  const xhr = new XMLHttpRequest();
  const uploadPromise = new Promise((resolve, reject) => {
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/dfjipgj2o/video/upload');
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress(percent);
      }
    });
    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data);
      } else {
        reject(new Error(`Cloudinary error: ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(formData);
  });
  const result = await uploadPromise;
  const thumbnailUrl = result.secure_url.replace(/\.[^/.]+$/, '.jpg');
  return {
    public_id: result.public_id,
    url: result.secure_url,
    thumbnail: thumbnailUrl,
    duration: result.duration || 0,
    format: result.format
  };
};