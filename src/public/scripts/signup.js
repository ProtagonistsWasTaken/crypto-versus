function signup() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const data = {username, password};

    const statusMessage = document.getElementById("status_message");

    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", ()=>{
        if(xhr.status === 200) {
            statusMessage.innerText = "signed up!";
            statusMessage.style.color = "lime";
            statusMessage.style.backgroundColor = "#003300";
            statusMessage.style.borderLeft = "2px solid lime";
        }
        else {
            statusMessage.innerText = xhr.responseText;
            statusMessage.style.color = "red";
            statusMessage.style.backgroundColor = "#330000";
            statusMessage.style.borderLeft = "2px solid red";
        }
    });
    xhr.open("POST", "/api/v0/signup");
    xhr.send(JSON.stringify(data));
    return false;
}

document.addEventListener("visibilitychange", function() {
    const msg = ["Crypto Versus | Sign Up (free and open source!)", "Crypto Versus | Sign Up (please?)", "Crypto Versus | Sign Up!!1111one!!!!11!!1!1!"];
    if (document.hidden) {
        document.title = msg[Math.floor(Math.random() * msg.length)];
    } else {
        document.title = "Crypto Versus | sign up";
    }
});