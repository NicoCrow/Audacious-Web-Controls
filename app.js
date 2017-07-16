const http = require('http');
const fs   = require('fs');
const url  = require('url');
const path = require('path');


let mimeTypes = {
	'.html': 'text/html',
	'.css' : 'text/css',
	'.js'  : 'text/javascript',
	'.jpg' : 'image/jpeg',
	'.png' : 'image/png',
	'.ico' : 'image/x-icon',
	'.svg' : 'image/svg+xml',
	'.eot' : 'appliaction/vnd.ms-fontobject',
	'.ttf' : 'aplication/font-sfnt'
};

let commands = {
	prev: ()=>{console.log("prev")},
	play: ()=>{console.log("play")},
	pause: ()=>{console.log("pause")},
	stop: ()=>{console.log("stop")},
	next: ()=>{console.log("next")}
};


let server = http.createServer(function(req, res){
	let pathName = url.parse(req.url).path;

	// if we get home page
	if(pathName === '/'){
		pathName = '/index.html';
	}

	pathName = pathName.substring(1, pathName.length);

	let extName = path.extname(pathName);
	let staticFiles = `${__dirname}/public/${pathName}`;

	// console.log(pathName, extName, staticFiles);
	if(commands.hasOwnProperty(pathName)){
		commands[pathName];

		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

		res.write(JSON.stringify({
			msg: `${pathName}`,
		}));

		res.end();
	} else if (
		extName =='.jpg'  ||
		extName == '.png' ||
		extName == '.ico' ||
		extName == '.eot' ||
		extName == '.ttf' ||
		extName == '.svg'){

			let file;
			try {
				file = fs.readFileSync(staticFiles);
				res.writeHead(200, {
					'Content-Type': mimeTypes[extName]
				});
				res.write(file, 'binary');
				res.end();
			} catch (err){
				if (err.code === 'ENOENT'){
					res.writeHead(404, {
						'Content-Type': 'application/json'
					});
					res.write(JSON.stringify({
						msg: `File "${pathName}" is not found.`,
						err: err
					}));
				} else {
					res.writeHead(500, {
						'Content-Type': 'application/json'
					});
					res.write(JSON.stringify({
						msg: `Internal server error.`,
						err: err
					}));

					throw err;
				}
				res.end();
			}
	} else {
		fs.readFile(staticFiles, 'utf8', function(err, data){
			if(!err){
				res.writeHead(200, {
					'Content-Type': mimeTypes[extName]
				});
				res.end(data);
			}else {
				res.writeHead(404, {
					'Content-Type': 'text/html;charset=utf8'
				});
				res.write(`File <em>"${staticFiles}"</em> is not found.`);
			}
			res.end();
		});
	}
}).listen(8080);


console.log(`app is running on port ${server.address().port}`);