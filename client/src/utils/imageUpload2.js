// frontend/src/utils/imageUpload2.js

export const checkImage = (file) => {
  let err = ""
  if(!file) return err = "File does not exist."

  if(file.size > 1024 * 1024) // 1mb
  err = "The largest image size is 1mb."

  if(file.type !== 'image/jpeg' && file.type !== 'image/png' )
  err = "Image format is incorrect."
  
  return err;
}

export const imageUpload2 = async (images) => {
  let imgArr = [];
  for(const item of images){
      const formData = new FormData()

      if(item.camera){
          formData.append("file", item.camera)
      }else{
          formData.append("file", item)
      }
      
      // ✅ CAMBIADO: Usando TUS datos de Cloudinary
      formData.append("upload_preset", "video_commerce")  // ✅ TU preset
      formData.append("cloud_name", "dzd58nm3l")          // ✅ TU cloud name

      const res = await fetch("https://api.cloudinary.com/v1_1/dzd58nm3l/upload", {  // ✅ TU cloud name
          method: "POST",
          body: formData
      })
      
      const data = await res.json()
      
      console.log('📸 Cloudinary response:', data)
      
      imgArr.push({public_id: data.public_id, url: data.secure_url})
  }
  return imgArr;
}