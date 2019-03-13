// ==UserScript==
// @name         Bayer Citrix Helper
// @namespace    http://utahcon.com
// @version      0.1
// @description  try to take over the world!
// @author       Utahcon
// @match        https://myapps.bayer.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(".modal{display:none;position:fixed;z-index:1;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:#000;background-color:rgba(0,0,0,.4)}.modal-content{background-color:#fefefe;margin:15% auto;padding:20px;border:1px solid #888;width:80%;height:50%}.modal-content p{color:#000}.close{color:#aaa;float:right;font-size:28px;font-weight:700}.close:focus,.close:hover{color:#000;text-decoration:none;cursor:pointer}");

    // Storage Check
    if (typeof(Storage) !== "Undefined") {

    } else {
        //console.log("No local storage available")
    }

    switch(window.location.href){
        case "https://myapps.bayer.com/vpn/index.html":
            first_login();
            break;
        case "https://myapps.bayer.com/cgi/login":
            gridcard();
            break;
        case "https://myapps.bayer.com/Citrix/XenApp/clientDetection/downloadNative.aspx":
            skip_download();
            break;
        case "https://myapps.bayer.com/Citrix/XenApp/auth/login.aspx?CTX_MessageType=WARNING&CTX_MessageKey=NoUsableClientDetected":
            second_login();
            break;
        case "https://myapps.bayer.com/Citrix/XenApp/site/default.aspx":
            go_to_settings();
            break;

        case "https://myapps.bayer.com/Citrix/XenApp/site/preferences.aspx":
            check_settings();
            break;

        case "https://myapps.bayer.com/Citrix/XenApp/site/default.aspx?CTX_MessageType=SUCCESS&CTX_MessageKey=SettingsSaved":
            go_to_desktops();
            break;

        case "https://myapps.bayer.com/Citrix/XenApp/site/default.aspx?CTX_CurrentTab=Desktops":
            start_desktop();
            break;
    }
})();

function go_to_settings(){
    document.getElementById("settingsLink").click();
}

function check_settings(){
    document.getElementById("slWindowSize").value = "800x600"
    document.getElementById("submit").click();
}

function start_desktop(){
    document.getElementById("desktopSpinner_idCitrix.MPS.Desktop.Citrix_005f7x.myCloud_0020Desktop_0020_0024S21-90").click();
}

function go_to_desktops(){
    document.getElementById("Desktops_Text").click();
}

function skip_download(){
    document.getElementById("skipWizardLink").click();
}

function second_login(){
    document.getElementById("user").value = "etjck";
    document.getElementById("password").value = "ZaBthpKsf7okkyaZXd3CVWWj";
    document.getElementById("btnLogin").click();
}

function first_login() {
    // stupid login page, email and fake password
    document.getElementById("Enter user name").value = "adam.barrett.ext@bayer.com";
    document.getElementById("passwd").value = "asdf"
    document.getElementById("Log_On").click();
}

function gridcard(){
    var gridCard = JSON.parse(window.localStorage.getItem("gridcard"));

    if( gridCard == null) {
        load_gridcard();
    } else {
        parse_gridcard(gridCard);
    }
}

function parse_gridcard(gridcard){
    var response = "";

    // get coordinates from the page
    console.log(document.getElementById("dialogueStr").innerText.match(/[A-Z][0-9]/g));
    document.getElementById("dialogueStr").innerText.match(/[A-Z][0-9]/g).forEach(function(coord){
        console.log(coord[0] +" "+coord[1]-1);
        response = response + gridcard[coord[0]][coord[1]-1];
    })

    console.log("Response: "+ response);
    document.getElementById("response").value = response;
    document.getElementById("SubmitButton").click();
}

function load_gridcard(){

    // make a modal for collecting the grid card data
    var gridcardModal = document.createElement("div");
    gridcardModal.id = "gridcardModal";
    gridcardModal.classList.add("modal");

    var gridcardModalContent = document.createElement("div");
    gridcardModalContent.classList.add("modal-content")

    var gridcardInstructionsCloseButton = document.createElement("span");
    gridcardInstructionsCloseButton.classList.add("close");
    gridcardInstructionsCloseButton.innerHTML = "&times;";
    gridcardInstructionsCloseButton.onclick = function() {
        gridcardModal.style.display = "none";
    }

    var gridcardInstructions = document.createElement("p");
    gridcardInstructions.innerText = "Paste entire contents of gridcard below:";

    var gridcardTextarea = document.createElement("textarea");
    gridcardTextarea.style.width = "600px";
    gridcardTextarea.style.height = "90%";
    gridcardTextarea.setAttribute("placeholder", "Personal Gridcard\n1\n2\n3\n4\n5\nA\nTT\nL3\nRX\nLX\nYG\nB\nXW\n5Z\n7W\n3F\nVR\nSerial# 221561\nC\nGK\nAP\nCF\nFX\nCF\nD\nXL\nA5\n5Y\n4B\nTN\nE\n9H\nQB\nAR\n4D\nDB\nF\nD6\nQY\nK4\nPE\nS2\nG\nJG\n6C\nVD\nQD\nY5\nH\n3E\n9P\nQJ\nFC\nKN\nI\nXB\nNR\nAK\nXF\nCL\nJ\n92\nPC\nYX\nPB\nGH\n1\n2\n3\n4\n5");

    var gridcardSubmitButton = document.createElement("button");
    gridcardSubmitButton.value = "Submit Gridcard";
    gridcardSubmitButton.innerText = "Submit Gridcard";
    gridcardSubmitButton.onclick = function(){
        if(submit_gridcard(gridcardTextarea.value)){
            gridcardModal.style.display = "none";
            gridcard();
        }
    };

    gridcardModalContent.appendChild(gridcardInstructionsCloseButton);
    gridcardModalContent.appendChild(gridcardInstructions);
    gridcardModalContent.appendChild(gridcardTextarea);
    gridcardModalContent.appendChild(gridcardSubmitButton);

    gridcardModal.appendChild(gridcardModalContent);

    document.body.appendChild(gridcardModal);

    gridcardModal.style.display = "block";
}

function submit_gridcard(gridcardData) {

    var currentColumn = ""
    var gridcardObj = {}

    // parse the gridcard
    gridcardData.split('\n').forEach(function(line){

        switch(true){
            case "Personal Gridcard" == line:
            case /^[0-9]$/.test(line):
            case /^Serial#\s([0-9]+)/g.test(line):
                break;
            case /^[A-Z]$/g.test(line):
                currentColumn = line
                if(gridcardObj[currentColumn] == undefined){
                    gridcardObj[currentColumn] = Array()
                }
                break;
            case /^[A-Z0-9]{2}$/g.test(line):
                gridcardObj[currentColumn].push(line)
                break;
        }
    });

    window.localStorage.setItem("gridcard", JSON.stringify(gridcardObj));
    return true
}