exports.receiveServerCheck = function(req,res,next){
    if(typeof req.server === 'undefined') {
        req.server = {};
        req.server.server = true;
        next();    
    }
}
exports.sendServerCheck = function(req,res,next){
    if(typeof req.server.server === 'boolean') {
        if(typeof req.dbserver.dbserver === 'boolean') {
            res.setHeader('Content-Type','json/application');
            res.send({status:200,message:'Server Alive',
                    result:{server:req.server.server,dbserver:req.dbserver.dbserver}});
            res.end(); 
        } else {
            res.setHeader('Content-Type','json/application');
            res.send({status:200,message:'Server Alive',result:{server:req.server.server}});
            res.end();        
        }  
    } else {
        res.setHeader('Content-Type','json/application');
        res.send({status:400,message:'Cannot send server data back to Client'});
        res.end();    
    }
}
