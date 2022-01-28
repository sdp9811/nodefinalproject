const mongoose = require('mongoose');
const SchemaVariable=mongoose.Schema;
const RegSchema=new SchemaVariable({

    firstName:{
        type: String,
        required:true
    },
    lastName:{
        type: String,
        required:true
    },
    eMail:{
        type: String,
        required:true
    },
    pSrd:{
        type: String,
        required:true
    }

})

module.exports=mongoose.model('RegistDet', RegSchema);