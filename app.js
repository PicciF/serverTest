const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { type } = require("os");
const { title } = require("process");
const spawn = require("child_process").spawn;
const { exec } = require('child_process');
const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

const dati = [1,2]
frompython = []


app.get("/",(req,res)=>{

    res.send("Ciao " + frompython.length);
 
})

app.get("/getAllTitle",(req,res)=>{

    titles = [];
    for (i = 0; i < frompython.length; i++) {
        titles.push(frompython[i].title);
    }
    res.json(titles);
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

app.listen(process.env.PORT || 5000, function () {
    exec('cat /etc/os-release', (error, stdout, stderr) => {
        if (error) {
          console.error(`Errore durante l'esecuzione del comando: ${error}`);
          return;
        }
        console.log(`Risultato del comando:\n${stdout}`);
      });
    /*var pypro = spawn('python', ['main.py']);
   
    pypro.stdout.on('data', function(data){
        
        //var someEncodedString = Buffer.from(data, 'utf-8').toString();
        //console.log(data.toString());
        var array = data.toString().split("#");
        console.log(array.length);
        for (i = 0; i < array.length; i++) {
            console.log("Elaborazione " + i );
            array[i] = array[i].replaceAll("'(?<!\\\\w)'", "\"");
            array[i] = array[i].toString().replaceAll("None","null");
           
        }
        for (i = 0; i < array.length-1; i++) {
            frompython.push(JSON.parse(array[i])); 
        }
        
        
        return console.log("Ciao funziona " + frompython.length );
      
    });*/
    return console.log("Server is running on port " + process.env.PORT);
   
        
    });


    