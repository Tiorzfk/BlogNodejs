var port = 1337;

/*var konek = {
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'blog'
 };*/

 var konek = {
   host     : 'ap-cdbr-azure-southeast-b.cloudapp.net',
   user     : 'b8bf14d452d4b5',
   password : 'b1476b57',
   port 	: 3306,
   database : 'comradedb'
 };

module.exports = {
    port: port,
    koneksi: konek
};