var GGsmsc = require("ggsmsc").Client;
var SmsBatch = require("ggsmsc").Batch;

   var SmscConfig = {
        debug   : 1,            // can be overloaded with --debug in cli
        hostname: 'localhost', // Gammu MySql config
        username: 'root',
        basename: 'sms',
        password: '',

        smsc    : '+6281573734314',  // your SMS gateway phone number
        report  : true          // enforce delivery report when sending
   };

   function DisplayCallBack (message) {
        var count=1;
        for (var sms in message) {
            console.log("-%d- Inbox SMS=%j", count++, message[sms]);
        }
    }

    /* kirim ke 1 hp
    function sms() {
        this.smsc= new GGsmsc (SmscConfig);
        //new SmsBatch(this.smsc, ResponseCB, [MySmsRqt1]);
        this.smsc.GetAll  (DisplayCallBack);
        this.smsc.GetFrom (DisplayCallBack, 'Comrade');
        this.smsc.SendTo(DisplayCallBack,{phone: '+6281355703115', msg : 'This is my message from nodejs'});
    }*/

    function sms() {
        this.ResponseCB = function(response) {
          console.log ("### Testing CallBack --> Response=%j", response.status);
          if (response.status ===0) process.exit();
        };
        var MySmsRqt1 =  {
            phone   : '+6281355703115'            // warning phone number should be a string not a number
          , ack     : false                  // don't wait for target to send back an acknowledgement response
          , msg     : "This is my 1st Testing Message from nodejs"
        };
        var MySmsRqt2 =  {
              phone   : '+6282312023112'            // warning phone number should be a string not a number
            , ack     : false                  // don'twait for target to send back an acknowledgement response
            , msg     : "This is my 2nd Testing Message from nodejs"
        };

        this.smsc= new GGsmsc (SmscConfig);     // connect onto gammu SMSgateway
        this.kirim = function(data){
            new SmsBatch (this.smsc, this.ResponseCB, data);
        }
    }

module.exports = new sms();
