const http = require('http');
const fs   = require('fs');
const url  = require('url');
const path = require('path');
const exec = require('child_process').exec;


const mimeTypes = {
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


const commands = {
	prev:  () => "audacious -r",
	play:  () => "audacious -p",
	pause: () => "audacious -u",
	stop:  () => "audacious -s",
	next:  () => "audacious -f"
};


function response(res, status, type, content){
	res.writeHead(status, {
		'Content-Type': type
	});
	res.write(content);
	res.end();
};


let server = http.createServer(function(req, res){
	let pathName = url.parse(req.url).path;

	// home page
	if(pathName === '/'){
		pathName = '/index.html';
	}

	pathName = pathName.substring(1, pathName.length);

	let extName = path.extname(pathName);
	let staticFiles = `${__dirname}/public/${pathName}`;


	if(commands.hasOwnProperty(pathName)){
		// audacious command

		console.log(commands[pathName]());

		let dir = exec(commands[pathName](), function(err, stdout, stderr){
			if (err){
				console.log(err);

				response(res, 500, 'application/json', JSON.stringify({
					msg: 'Internal server error.',
					err: err
				}));

				throw err;
			}
			console.log(stdout);
		});

		dir.on('exit', function (code){
			response(res, 200, 'application/json', JSON.stringify({
				msg: `${pathName}`,
			}));
		});

	} else if (
		// binary file

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
				response(res, 404, 'application/json', JSON.stringify({
					msg: `File "${pathName}" is not found.`,
					err: err
				}));
			} else {
				response(res, 500, 'application/json', JSON.stringify({
					msg: 'Internal server error.',
					err: err
				}));

				throw err;
			}
		}
	} else {
		// text file

		fs.readFile(staticFiles, 'utf8', function(err, data){
			if(!err){
				response(res, 200, mimeTypes[extName], data);
			}else {
				response(res, 404, 'text/html;charset=utf8', `File <em>"${staticFiles}"</em> is not found.`);
			}
		});
	}
}).listen(8080);


console.log(`app is running on port ${server.address().port}`);