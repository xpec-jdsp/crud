const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const getEmpleadosCollection = require('./mongo_connection');

const validate = require('jsonschema').validate;

app.listen(PORT, () => {
  console.log('Corriendo en el puerto:', PORT);
})

app.use(bodyParser.urlencoded({ extended: true}))

app.get('/buscar', async (req, res) => {
  const empleadosCollection = await getEmpleadosCollection();
  const empleado = await empleadosCollection.findOne({id:req.body.id});
  if(!empleado){
    res.status(400).send({'statusCode': 400, 'message': 'empleado no encontrado'})
  }else{
  res.status(200).send({'statusCode': 200, 'message': 'empleado encontrado', 'empleado': empleado});
}})

app.get('/', async (req, res) => {
  const empleadosCollection = await getEmpleadosCollection();
  const empleados = await empleadosCollection.find().toArray();
  res.status(200).send({'statusCode': 200, 'message': 'metodo get ok', 'empleados': empleados});
})

app.post('/registrar', async (req, res) => {

  const schema = require('./empleado_schema.json');
  try{
    const val = validate(req.body, schema);
    if(val.errors.lengh > 0){
      res.status(400).send({'statusCode': 400, 'message': 'rectifique los datos'});
    }else{
      const empleadosCollection = await getEmpleadosCollection();
      const result = await empleadosCollection.insertOne(req.body);
      res.status(200).send({'statusCode': 200, 'message': 'empleado agregado'});
    }
  }catch(ex){
    console.log("catch on")
  }
})

app.put('/actualizar', async (req, res) =>{
  const empleadosCollection = await getEmpleadosCollection();
  const actualizacion = await empleadosCollection.findOneAndUpdate({id:req.body.id},{$set:{cargo:req.body.cargo,nombre:req.body.nombre}});
  res.status(200).send({'statusCode': 200, 'message': 'empleado actualizado'});
})

app.delete('/eliminar', async (req, res) => {
  const empleadosCollection = await getEmpleadosCollection();
  const elimnacion = await empleadosCollection.deleteOne({id:req.body.id})
  res.status(200).send({'statusCode': 200, 'message': 'empleado eliminado'});
})
