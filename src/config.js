// src/config.js
const applicationMode = "development";
var appName = "Admin Panel";
var apiUrl = "https://api.playfulpencil.in/api/";
var pageSize = 10;
var logo = "/logo.png";
var imageBasePath = "https://api.playfulpencil.in/uploads";

if (applicationMode === 'development') {
  appName = "Admin Panel";
  
  //local
  apiUrl = "https://api.playfulpencil.in/api/"; 
  imageBasePath = "https://api.playfulpencil.in/uploads";  

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