function TouchID(){}TouchID.prototype.isAvailable=function(o,i){cordova.exec(o,i,"TouchID","isAvailable",[])},TouchID.prototype.didFingerprintDatabaseChange=function(o,i){cordova.exec(o,i,"TouchID","didFingerprintDatabaseChange",[])},TouchID.prototype.verifyFingerprint=function(o,i,n){cordova.exec(i,n,"TouchID","verifyFingerprint",[o])},TouchID.prototype.verifyFingerprintWithCustomPasswordFallback=function(o,i,n){cordova.exec(i,n,"TouchID","verifyFingerprintWithCustomPasswordFallback",[o])},TouchID.prototype.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel=function(o,i,n,r){cordova.exec(n,r,"TouchID","verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel",[o,i])},TouchID.install=function(){return window.plugins||(window.plugins={}),window.plugins.touchid=new TouchID,window.plugins.touchid},cordova.addConstructor(TouchID.install);