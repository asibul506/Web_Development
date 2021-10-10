var randomNumber1= Math.floor(Math.random() * 6) + 1;
var randomNumber2= Math.floor(Math.random() * 6) + 1;

document.getElementsByClassName("img1")[0].setAttribute("src", "/images/dice"+randomNumber1+".png");
document.querySelector(".img2").setAttribute("src", "/images/dice"+randomNumber2+".png");

if(randomNumber1>randomNumber2){
    document.querySelectorAll("h1")[1].textContent="🚩Player 1 wins!";
}else if(randomNumber1<randomNumber2){
    document.querySelectorAll("h1")[1].textContent="Player 2 wins!🚩";
}else{
    document.querySelectorAll("h1")[1].textContent="Draw!";
}