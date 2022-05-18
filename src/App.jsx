var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { useState, useEffect, useReducer } from "react";
import RTC from "../lib/WebRTChandler";
let lc;
let dc;
function App() {
    const [connection, setConnection] = useState(false);
    const [localSdp, setLocalSdp] = useState("");
    const [remoteSdp, setRemoteSdp] = useState("");
    const [message, setMessage] = useState("");
    const statusStyle = {
        backgroundColor: "red",
    };
    const initialMessages = [];
    const messageReducer = (state, action) => {
        switch (action.type) {
            case "RECIEVED":
                return [
                    ...state,
                    { type: "incoming-message", message: action.message },
                ];
            case "SENT":
                return [
                    ...state,
                    { type: "outgoing-message", message: action.message },
                ];
            default:
                return [...state];
        }
    };
    const [messages, dispatchMessage] = useReducer(messageReducer, initialMessages);
    const reducer = (state, action) => {
        switch (action.type) {
            case "ONLINE":
                return { backgroundColor: "green" };
            case "OFFLINE":
                return { backgroundColor: "red" };
            default:
                return state;
        }
    };
    const [state, dispatch] = useReducer(reducer, statusStyle);
    const updateOnlineStatus = () => {
        if (navigator.onLine) {
            dispatch({ type: "ONLINE" });
        }
        else {
            dispatch({ type: "OFFLINE" });
        }
    };
    const makeOffer = function () {
        return __awaiter(this, void 0, void 0, function* () {
            lc = RTC.getInstance("offer");
            RTC.getDataChannel().then((dataChannel) => {
                console.log("promise resolved");
                dc = dataChannel;
                dc.onopen = () => {
                    console.log("connection open");
                    setConnection(true);
                };
                dc.onmessage = (e) => {
                    console.log("o oh there is a message");
                    dispatchMessage({ type: "RECIEVED", message: e.data });
                };
            });
            lc.onicecandidate = function (e) {
                setLocalSdp(JSON.stringify(lc.localDescription));
            };
            lc.createOffer().then((o) => {
                lc.setLocalDescription(o);
            });
        });
    };
    const setRemoteSdpOnlc = () => {
        lc.setRemoteDescription(JSON.parse(remoteSdp));
        console.log("remoteSdpset");
    };
    const sendMessage = () => {
        dc.send(message);
        setMessage("");
        dispatchMessage({ type: "SENT", message: message });
    };
    const makeAnswer = () => {
        lc = RTC.getInstance("answer");
        RTC.getDataChannel().then((dataChannel) => {
            dc = dataChannel;
            dc.onopen = () => {
                setConnection(true);
            };
            dc.onmessage = (e) => {
                dispatchMessage({ type: "RECIEVED", message: e.data });
            };
        });
        lc.onicecandidate = function (e) {
            setLocalSdp(JSON.stringify(lc.localDescription));
        };
        lc.setRemoteDescription(JSON.parse(remoteSdp));
        lc.createAnswer().then((o) => {
            lc.setLocalDescription(o);
        });
    };
    useEffect(() => {
        updateOnlineStatus();
        window.addEventListener("online", () => {
            updateOnlineStatus();
        });
        window.addEventListener("offline", () => {
            updateOnlineStatus();
        });
    }, []);
    return (<div>
      <h1 id="main-heading">
        p2p messaging service
        <i className="tooltip" style={state} id="status">
          <span className="tooltiptext">online</span>
        </i>
      </h1>

      <div className="connect">
        <div className="buttons">
          <button onClick={makeOffer} id="offer-button">
            offer
          </button>
          <button onClick={makeAnswer} id="answer-button">
            answer
          </button>
        </div>
        <div>
          connection: <span>{connection ? "connected" : "disconnected"}</span>
        </div>
        <div id="local-sdp">{localSdp}</div>
        <input id="remote-sdp" value={remoteSdp} onChange={(e) => {
            setRemoteSdp(e.target.value);
        }} type="text"/>
        <button onClick={setRemoteSdpOnlc} id="connect">
          connect
        </button>
      </div>
      <div id="messages">
        {messages.map((message) => {
            return <div className={message.type}>{message.message}</div>;
        })}
      </div>
      <div id="message-form">
        <input value={message} onChange={(e) => {
            setMessage(e.target.value);
        }} onKeyDown={(e) => {
            if (e.code === "Enter") {
                sendMessage();
            }
        }} id="actual-message" type="text"/>
        <button onClick={sendMessage} id="send">
          send
        </button>
      </div>
    </div>);
}
export default App;
