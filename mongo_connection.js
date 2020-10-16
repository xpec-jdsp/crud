const mongoClient = require('mongodb').MongoClient;
//const mongo_url = process.env.mongo_url;
const mongo_url = 'mongodb://127.0.0.1:27017';

const getEmpleadosCollection = async () => {
  const client = await mongoClient.connect(mongo_url, {useUnifiedTopology: true});
  const db = client.db('omnix');
  const empleadosCollection = db.collection("empleados");
  return empleadosCollection;
}

module.exports = getEmpleadosCollection;
