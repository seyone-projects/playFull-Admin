// src/config.js
const applicationMode = "development";
var appName = "Playful Administration";
var apiUrl = "http://13.234.225.146:5000/api/";
var pageSize = 10;
var logo = "/logo.png";
var imageBasePath = "http://13.234.225.146:5000/uploads";

if (applicationMode === 'development') {
  appName = "Playful Administration";
  
  //local
  apiUrl = "http://13.234.225.146:5000/api/"; 
  imageBasePath = "http://13.234.225.146:5000/uploads";  

  //server
  //apiUrl = "http://13.53.39.107/api/";
  //imageBasePath = "http://13.53.39.107/uploads";
  
}
const config = {
  appName: appName,
  apiUrl: apiUrl,
  pageSize: pageSize,
  logo: logo,
  imageBasePath: imageBasePath,
};
export default config;