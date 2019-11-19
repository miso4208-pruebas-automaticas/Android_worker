'use strict'
const shell = require('shelljs');
const fs = require('fs');
const s3 = require('../../worker-sqs/s3Storage.js')

module.exports.generateRandom = function(req,success,error){
    var appPackage;
    var apkInstall;
    console.log("..."+JSON.stringify(req));
    switch(req.aplication.toUpperCase()){
        case 'HABITICA':
            appPackage = 'com.habitrpg.android.habitica';
            apkInstall = 'habitica.apk';
            break;
        case 'CALENDULA':
                appPackage = 'es.usc.citius.servando.calendula';
                apkInstall = 'calendula.apk';
                break;
        default:
            throw error({ status: "APP_NOT_FOUND" });
    }
    if(!req.code)
        throw error( {status: "CODE_IS_NULL" }); 
    const eventsNumber = req.numberExecution ? req.numberExecution : 10;
    shell.exec(`adb install ${req.path_project}/vendor/${apkInstall}`)
    shell.exec(`adb shell monkey -p ${appPackage} -v ${eventsNumber}`, function(code, stdout, stderr) {
        s3.saveFileToS3(req.code,stdout,()=>{
            console.log('Archivo creado en S3 Codigo: ',req.code);
            success('Archivo creado en S3 Codigo: ',req.code);
        });


       /* fs.writeFile(`${req.path_project}/reports/random/${req.code}_${req.aplication}.txt`, stdout, function (err) {
            if (err) throw err;
            console.log('File is created successfully.');
            success(`${req.path_project}/reports/${req.code}${req.aplication}.txt`);
          });*/ 
      });
    
}