// src/config.js
const applicationMode = "development";
var appName = "Playful Administration";
var apiUrl = "https://playful-pencil-backend-7a58c9729e02.herokuapp.com/api/";
var pageSize = 10;
var logo = "/logo.png";
var imageBasePath = "https://playful-pencil-backend-7a58c9729e02.herokuapp.com/uploads";

if (applicationMode === 'development') {
  appName = "Playful Administration";
  
  //local
  apiUrl = "https://playful-pencil-backend-7a58c9729e02.herokuapp.com/api/"; 
  imageBasePath = "https://playful-pencil-backend-7a58c9729e02.herokuapp.com/uploads";  

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