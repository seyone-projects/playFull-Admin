// src/config.js
const applicationMode = "development";
var appName = "Admin Panel";
var apiUrl = "http://localhost:5000/api/";
var pageSize = 10;
var logo = "/logo.png";
var imageBasePath = "http://localhost:5000/uploads";

if (applicationMode === 'development') {
  appName = "Admin Panel";
  
  //local
  apiUrl = "http://localhost:5000/api/"; 
  imageBasePath = "http://localhost:5000/uploads";  

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