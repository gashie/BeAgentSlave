const { parseErrorLine } = require('./parse');

const testLine = "[Mon Jul 22 16:28:06.398612 2024] [autoindex:error] [pid 229838:tid 230028] [client 59.184.72.154:41877] AH01276: Cannot serve directory /var/www/html/: No matching DirectoryIndex (index.html) found, and server-generated directory index forbidden by Options directive";
console.log(parseErrorLine(testLine));
