const express = require('express');

const fs = require('fs'), es = require('event-stream');

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const natural  = require('natural');

//Routes

app.get('/',(req,res) => {res.send('String Parser');  });

app.post('/searchstring',(req,res) => {

    var tokenizer = new natural.TreebankWordTokenizer();
    var lineNr = 0;
    var t1 = [];var t;
    var s = fs.createReadStream('sample.txt')
    .pipe(es.split())
    .pipe(es.mapSync(function(line){

        s.pause();

        lineNr += 1;
        t =  tokenizer.tokenize(line);
        //console.log(t);
        t1 = t1.concat(t);
        s.resume();
    })
    .on('error', function(err){
        console.log('Error while reading file.', err);
    })
    .on('end', function(){
        console.log('Read entire file.');
        var uSet = new Set(t1);    
        var data = { "d" : [...uSet]};
                
        var sdata = JSON.stringify(data, null, 2);
        fs.writeFileSync('data.json', sdata, (error) => {
                if(error) return res.send('Error'); 
        });
             
    }));
        
       

    return res.send('Tokens written to file'); 
    

});

app.get('/searchstring',(req,res) => {
  
    var str = req.body.search;
       
    fs.readFile('data.json','utf8', (err, data) => {
        if (err)  return res.send('Error');  

        console.log(data);
        var d = JSON.parse(data);

        if( d["d"].indexOf(str) > -1)
        {
            return res.send('Match Found'); 
        }
        return res.send('No Matches Found');  
    });

    });
 

    

app.listen(3000);