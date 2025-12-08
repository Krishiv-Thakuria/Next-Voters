// Source - https://stackoverflow.com/a
// Posted by James Prentice, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-08, License - CC BY-SA 4.0

//pages/api

const {spawn} = require('child_process');

export default async function handler(req, res) {
    let python = spawn('python', ['python/hello.py']);
    let dataToSend = '';

    for await (const data of python.stdout){
      //console.log(data.toString());
      dataToSend += data.toString()
    }
  return res.status(200).json({ message: dataToSend})
}
