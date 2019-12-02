const fetch = require('node-fetch');
const fs = require('fs')

function getCatfact() {
    return fetch("https://catfact.ninja/fact?max_length=150")
        .then(resp => resp.json())
        .then(resp => Promise.resolve(resp.fact));

}

function getRandomFact() {
    return fetch("http://api.fungenerators.com/fact/random",{
        headers: {
            'accept': 'application/json',
            'X-Fungenerators-Api-Secret':''
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
        .then(resp => resp.json())
        .then(resp=> Promise.resolve(resp.contents.fact))
}

function getFacts(req) {
    let factPromises = [];
    for (let i = 0; i <= 150; i++) {
        factPromises.push(req())
    }
    return factPromises;
}

function writeToFile(path,requests){
    Promise.all(requests).then(resp => {
        let writeStream = fs.createWriteStream(path+'.json');
        writeStream.write(JSON.stringify(resp), 'utf8');
    })
}

let factRequests = getFacts(getRandomFact);
writeToFile('random',factRequests);



