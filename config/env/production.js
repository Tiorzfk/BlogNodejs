var port = process.env.port;

 var konek = {
   //host     : 'ap-cdbr-azure-southeast-b.cloudapp.net',
   //user     : 'b065bc94f582d8',
   //password : '67928ce1',
   //port 	: 3306,
   //database : 'acsm_960a6532c696724'
  
  
    host     : 'us-cdbr-azure-southcentral-f.cloudapp.net',
    user     : 'bce28b46e34219',
    password : '3ddb60cd',
    port 	: 3306,
    database : 'comrades'
 };

module.exports = {
    port: port,
    koneksi: konek
};
