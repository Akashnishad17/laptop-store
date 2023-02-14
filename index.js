const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const data = JSON.parse(json);

const server = http.createServer((req, res) => {
    const path = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;

    if (path === '/products' || path === '') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, page) => {
            let output = page;
            fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, page) => {
                const cards = data.map(el => replaceTemplate(page, el)).join('');
                output = output.replace('{%CARDS%}', cards);
                res.end(output);
            });
        });
    } else if (path === '/laptop' && id < data.length) {
        res.writeHead(200, { 'Content-type': 'text/html' });
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, page) => {
            const laptop = data[id];
            let output = replaceTemplate(page, laptop);
            res.end(output);
        });
    } else if ((/\.(jpg|jpeg|png|gif)$/i).test(path)) {
        fs.readFile(`${__dirname}/data/img/${path}`, (err, page) => {
            res.writeHead(200, { 'Content-type': 'image/jpg' });
            res.end(page);
        });
    } else {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end(`Page not found`);
    }

});

server.listen(1337, '127.0.0.1');

function replaceTemplate(page, laptop) {
    let output = page.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    return output;
}