const API = "http://127.0.0.1:8000"



let map = L.map('map').setView([19.9975, 73.7898], 13)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19
}).addTo(map)


function register(){

let username = document.getElementById("reg_user").value
let email = document.getElementById("reg_email").value
let password = document.getElementById("reg_pass").value

fetch(`${API}/auth/register?username=${username}&email=${email}&password=${password}`,{
method:"POST"
})
.then(res=>res.json())
.then(data=>{
alert(data.message || data.detail)
})
.catch(err=>console.error(err))

}



function login(){

let username = document.getElementById("login_user").value
let password = document.getElementById("login_pass").value

fetch(`${API}/auth/login?username=${username}&password=${password}`,{
method:"POST"
})
.then(res=>res.json())
.then(data=>{

localStorage.setItem("token", data.access_token)

alert("Login Successful")

})
.catch(err=>console.error(err))

}



function addService(){

let name = document.getElementById("name").value
let category = document.getElementById("category").value
let lat = document.getElementById("lat").value
let lon = document.getElementById("lon").value

let token = localStorage.getItem("token")

fetch(`${API}/services/add`,{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer " + token
},

body: JSON.stringify({
name: name,
category: category,
lat: parseFloat(lat),
lon: parseFloat(lon)
})

})
.then(res=>res.json())
.then(data=>{
alert(JSON.stringify(data))
})

}



function getServices(){

fetch(`${API}/services/list`)
.then(res=>res.json())
.then(data=>{

let div = document.getElementById("services")
div.innerHTML=""


map.eachLayer(layer=>{
if(layer instanceof L.Marker){
map.removeLayer(layer)
}
})

data.forEach(s=>{

div.innerHTML+=`
<div class="service">
<h3>${s.name}</h3>
<p>${s.category}</p>

<button onclick="deleteService(${s.id})">Delete</button>
</div>
`


if(s.latitude && s.longitude){
    L.marker([s.latitude, s.longitude])
    .addTo(map)
    .bindPopup(`<b>${s.name}</b><br>${s.category}`)
}
})

})
}


function deleteService(id){

fetch(`${API}/services/delete/${id}`,{

method:"DELETE",

headers:{
"Authorization":`Bearer ${localStorage.getItem("token")}`
}

})
.then(()=>{

getServices()

})

}



function nearby(){

let lat = document.getElementById("user_lat").value
let lon = document.getElementById("user_lon").value
let radius = document.getElementById("radius").value

fetch(`${API}/services/nearby?latitude=${lat}&longitude=${lon}&radius=${radius}`)
.then(res=>res.json())
.then(data=>{

let div = document.getElementById("services")
div.innerHTML=""

let bounds = []   

data.forEach(s=>{

div.innerHTML+=`
<div class="service">
<h3>${s.name}</h3>
<p>${s.category}</p>
<p>Distance: ${s.distance_km} km</p>
</div>
`
let userMarker = L.marker([lat, lon])
.addTo(map)
.bindPopup("You are here")
if(s.latitude && s.longitude){

let marker = L.marker([s.latitude, s.longitude])
.addTo(map)
.bindPopup(`<b>${s.name}</b><br>${s.category}`)

bounds.push([s.latitude, s.longitude])

}

})



if(bounds.length > 0){
map.fitBounds(bounds)
}

})

}

