const btn = document.getElementById('btn');

// Change button text and color on click one time
btn.addEventListener('click', function handleClick() {
  btn.textContent = 'Link Created';
  btn.style.backgroundColor = '#36c429';
});

const copyBtn= document.querySelector(".copy-btn");
const whatsappBtn= document.querySelector(".whatsapp-btn");
const facebookBtn= document.querySelector(".facebook-btn");

function init(){
    let postUrl = encodeURI(document.location.href);  /* document.location.href to find location of the homepage */
    let postTitle = encodeURI("Join with this link: ");

    whatsappBtn.setAttribute("href",'https://api.whatsapp.com/send?text=${postTitle} ${postUrl}')
    facebookBtn.setAttribute("href",'https://www.facebook.com/sharer.php?u=${postUrl}')
}
init();