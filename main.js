const {Client} = require('pg');
const express=require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { del } = require('express/lib/application');

const app=express()
app.use(express.json())

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'REST_API Documentation',
      version: '1.0.0',
      description: 'A simple API documentation example using Swagger',
    },
  },
  apis: ['/main.js'], // Adjust this path to point to your API files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const con= new Client({
  host: "localhost",
  user: "postgres",
  port: "5432",
  password: "Mugisha@1",
  database: "product_catalog_api",
})
con.connect().then(()=>console.log("connected"))




app.post('/postData',(req,res)=>{

 const {name,id} =req.body


 const insert_query='INSERT INTO products (name,id) VALUES ($1, $2)'

 con.query(insert_query, [name,id],(err,result)=>{
    if(err)
      {
        res.send(err)
      }else{
        console.log(result)
        res.send('POSTED DATA')
      }
 })

})


app.get('/fetchData', (req,res)=>{

    const fetch_query = "select * from products"

    con.query(fetch_query,(err,result)=>{
        if(err)
            {
              res.send(err)
            }else{
              res.send(result.rows)
            }
      })
})


app.get('/fetchbyId/:id',(req,res)=>{
    const id=req.params.id
    const fetch_query="select * from products where id = $1"
    con.query(fetch_query,[id],(err, result)=>{
        if(err)
            {
              res.send(err)
            }else{
              res.send(result.rows)
            }
    })
})

app.put('/update/:id',(req,res)=>{

    const id=req.params.id;
    const name=req.body.name;
    
    const update_query="update products set name=$1 where id=$2"

    con.query(update_query,[name,id],(err,result)=>{
        if(err){
          res.send(err)
        }else{
          res.send("UPDATED")
        }
    })
  
})

app.delete('/deleteproduct/:id',(req,res)=>{
      const id=req.params.id
      
      const delete_query="delete from products where id=$1"

      con.query(delete_query,[id],(err,result)=>{
            if(err)
                {
                  res.send(err)
                }else{
                  res.send(result)
                }
      })
})
app.listen(3000,()=>{
  console.log("Server is running.........")
})