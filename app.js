'use strict';
const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");
const AWS = require("aws-sdk");
const s3 = new AWS.S3()
const morgan = require("morgan");
const jsftp = require("jsftp");
var fs = require('fs');
const app = express();

const ftp = require('./ftpclient');
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.use(fileupload({
    useTempFiles:true,
    tempFileDir: "/tmp"
}))

const dati = [1,2]

app.get("/addPage",async (req,res)=>{
    
    const client = new ftp('ftp.tk1fire.it', 21, '16039367@aruba.it', 'MarioRossi123-', false);
   
    var nome = req.query.nome;
    console.log(nome);
    var cognome = req.query.cognome;
    var cf = req.query.cf; 

    var fileName = "htmlfile.html";
    /*var stream = fs.createWriteStream(fileName);
    console.log("YRDY" + fileName.toString())
    stream.once('open', function(fd) {
        var html = buildHtml("", nome, cognome, cf);
      
        stream.end(html);
        console.log('Saved!');
      });*/
     // store something
    
    fs.writeFile(fileName, buildHtml("", nome, cognome, cf), function (err){
        if(err) throw err;
        console.log('SALVATO')
     })

    fs.readFile(fileName, 'utf-8',  function(err, data){
        console.log(data)
        
    })
   // console.log("STREAM: " + fs.createReadStream(fileName))
     
    client.upload(fileName, '/www.tk1fire.it/'+nome+'.html', 777);

   /* await s3.putObject({
        Body: fileName,
        Bucket: "cyclic-cloudy-ray-tam-eu-central-1",
        Key: "some_files/my_file.html",
    }).promise()*/

/*
    //get it back
    let my_file = await s3.getObject({
        Bucket: "cyclic-cloudy-ray-tam-eu-central-1",
        Key: "some_files/my_file.html",
    }).promise()*/
    
//console.log(my_file.Body.toString())
    //console.log("TEST" + my_file.toString())
   /* 
    await s3.putObject({
        Body: JSON.stringify({fileName}),
        Bucket: "cyclic-cloudy-ray-tam-eu-central-1",
        Key: "tmp/"+fileName,
    }).promise()
    
console.log(JSON.parse(my_file))*/

   /* fs.appendFile(fileName, nome+" "+cognome+" "+cf, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });    */

     //client.upload( fileName, '/www.tk1fire.it/testiamolo.html', 777);

    //client.upload(fileName, '/www.tk1fire.it/'+nome+".html", 777);
    //client.upload("."+fileName, '/www.tk1fire.it/testiamolo.html', 777);
    //client.upload("./my_file.json", '/www.tk1fire.it/'+nome+".html", 777);
    //client.upload(my_file, '/www.tk1fire.it/'+nome+".html", 777);
    
    res.json({
        success:true,
        errorMessage:"",
        data:"tutto ok",
        debugMessage:"",
    });
})
function buildHtml(header,  nome, cognome, cf ) {

  
    // concatenate header string
    // concatenate body string
  
    return '<!DOCTYPE html>'
         + '<html><head>' + header + '</head><body>' + 'Nome: '+ nome + '<br>' + 'Cognome: ' + cognome + '<br>'+ 'CF: ' + cf + '</body></html>';
  };

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

app.listen(443, ()=>console.log("il serer funziona"));

