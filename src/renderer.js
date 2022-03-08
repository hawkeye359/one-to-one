import "./style.css";
window.require("sqlite3");
const path = window.require("path");
const onlineStatus = document.getElementById("status");
onlineStatus.style.backgroundColor = navigator.onLine ? "green" : "red";
const updateOnlineStatus = () => {
  onlineStatus.style.backgroundColor = navigator.onLine ? "green" : "red";
};

window.addEventListener("online", () => {
  updateOnlineStatus();
});
window.addEventListener("offline", () => {
  updateOnlineStatus();
});
const offerButton = document.getElementById("offer-button");
const connetionStatus = document.getElementById("connection");
const localSdp = document.getElementById("local-sdp");
const connectButton = document.getElementById("connect");
const remoteSdb = document.getElementById("remote-sdp");
const answerButton = document.getElementById("answer-button");
const messagesDiv = document.getElementById("messages");
const sendButton = document.getElementById("send");
const actualMessage = document.getElementById("actual-message");
offerButton.addEventListener("click", () => {
  const lc = new RTCPeerConnection();
  const dc = lc.createDataChannel("channel");
  dc.onopen = () => {
    connetionStatus.innerText = "Connected";
    console.log("conncetion open");
    dc.send("hello");
  };
  dc.onmessage = (e) => {
    console.log(e.data);
    const message = document.createElement("div");
    message.innerText = e.data;
    message.classList.add("incoming-message");
    messagesDiv.appendChild(message);
  };
  sendButton.addEventListener("click", () => {
    console.log(actualMessage.value);
    dc.send(actualMessage.value);
    console.log("home");
    const message = document.createElement("div");
    message.innerText = actualMessage.value;
    message.classList.add("outgoing-message");
    messagesDiv.appendChild(message);
  });
  lc.onicecandidate = function (e) {
    localSdp.innerText = JSON.stringify(lc.localDescription);
  };
  lc.createOffer().then((o) => {
    lc.setLocalDescription(o);
  });
  connectButton.addEventListener("click", () => {
    lc.setRemoteDescription(JSON.parse(remoteSdb.value));
  });
});
answerButton.addEventListener("click", () => {
  const rc = new RTCPeerConnection();
  rc.ondatachannel = (e) => {
    rc.dc = e.channel;
    rc.dc.onopen = () => {
      connetionStatus.innerText = "Connected";
      console.log("conncetion open");
    };
    rc.dc.onmessage = (e) => {
      const message = document.createElement("div");
      message.innerText = e.data;
      message.classList.add("incoming-message");
      messagesDiv.appendChild(message);
    };
  };
  sendButton.addEventListener("click", () => {
    console.log(actualMessage.value);
    rc.dc.send(actualMessage.value);
    const message = document.createElement("div");
    message.innerText = actualMessage.value;
    message.classList.add("outgoing-message");
    messagesDiv.appendChild(message);
  });
  rc.onicecandidate = function (e) {
    localSdp.innerText = JSON.stringify(rc.localDescription);
  };
  rc.setRemoteDescription(JSON.parse(remoteSdb.value));
  rc.createAnswer().then((o) => {
    rc.setLocalDescription(o);
  });
});
