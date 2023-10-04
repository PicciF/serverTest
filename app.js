const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

const dati = [1,2]



app.get("/",(req,res)=>{
    
    
    res.send("Ciao funziona" );
})

app.post("/",(req,res)=>{  
    res.json(dati);
})

app.post("/:id",(req,res)=>{  
    res.send(req.params.id);
    //res.json(dati[req.params.id]);
    
})

app.get("/somma",(req,res)=>{  
    
    var somm = parseInt(req.query.a)  + parseInt(req.query.b); 

    res.send(somm.toString() );
    //res.json(dati[req.params.id]);
    
})

app.post("/addN",(req,res)=>{
    
    dati.push(req.body.n);
    res.json(dati);
})

app.listen(process.envPORT || 5000, ()=>console.log("il server funziona"));

