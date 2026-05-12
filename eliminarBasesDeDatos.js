// node eliminarBasesDeDatos.js
require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/VideoCommerce';

// Lista de bases de datos que NO deben eliminarse (sistema)
const PROTECTED_DATABASES = ['admin', 'local', 'config'];

// Lista de patrones de bases de datos a eliminar (puedes ajustar)
const PATTERNS_TO_DELETE = ['videocommerce', 'test'];

const deleteNonProtectedDatabases = async () => {
  try {
    // Conectar al servidor MongoDB (sin especificar base de datos)
    const connection = await mongoose.createConnection(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Conectado a MongoDB');

    // Obtener el cliente nativo de MongoDB
    const client = connection.getClient();
    const adminDb = client.db('admin');

    // Obtener lista de todas las bases de datos
    const { databases } = await adminDb.admin().listDatabases();
    
    console.log('\n📋 Bases de datos encontradas:');
    databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });

    // Filtrar bases de datos a eliminar
    const toDelete = databases.filter(db => {
      // Excluir bases protegidas
      if (PROTECTED_DATABASES.includes(db.name)) return false;
      
      // Verificar si coincide con algún patrón
      return PATTERNS_TO_DELETE.some(pattern => 
        db.name.toLowerCase().includes(pattern.toLowerCase())
      );
    });

    if (toDelete.length === 0) {
      console.log('\n✨ No hay bases de datos para eliminar.');
      await connection.close();
      return;
    }

    console.log('\n⚠️  Bases de datos que serán ELIMINADAS:');
    toDelete.forEach(db => {
      console.log(`   🗑️ ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });

    // Confirmar antes de eliminar
    console.log('\n⚠️  ¿Estás seguro de eliminar estas bases de datos? (escribe "ELIMINAR" para continuar)');
    
    // En Node.js, necesitamos leer del stdin
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise((resolve) => {
      readline.question('> ', resolve);
    });
    readline.close();

    if (answer !== 'ELIMINAR') {
      console.log('\n❌ Operación cancelada.');
      await connection.close();
      return;
    }

    // Eliminar cada base de datos
    for (const db of toDelete) {
      try {
        console.log(`\n🗑️ Eliminando base de datos: ${db.name}...`);
        await client.db(db.name).dropDatabase();
        console.log(`✅ Base de datos ${db.name} eliminada correctamente`);
      } catch (err) {
        console.error(`❌ Error al eliminar ${db.name}:`, err.message);
      }
    }

    console.log('\n🎉 Proceso completado!');
    
    // Mostrar bases de datos restantes
    const { databases: remaining } = await adminDb.admin().listDatabases();
    console.log('\n📋 Bases de datos restantes:');
    remaining.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });

    await connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

deleteNonProtectedDatabases();