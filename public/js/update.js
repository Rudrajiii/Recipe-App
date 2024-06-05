function checkWindowSize(){
    const leftContainerPart = document.querySelector(".leftContainerPart");
    const rightContainerPart = document.querySelector(".rightContainerPart");
    const formWrapper = document.querySelector(".formWrapper");
    if(window.innerWidth < 1241){
        leftContainerPart.style.display = "none";
        rightContainerPart.style.margin = "auto";
        formWrapper.style.width = "36vw";
    }else{
        leftContainerPart.style.display = "block";
    }
    if(window.innerWidth < 1065){
        formWrapper.style.width = "36vw";
    }
    if(window.innerWidth < 982){
        formWrapper.style.width = "38vw";
    }
}

window.addEventListener('resize', checkWindowSize);
window.addEventListener('load', checkWindowSize);