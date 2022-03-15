class RTC {
  static type = null;
  static RTCinstance = null;
  static DataChannel = null;
  static createInstance = (type) => {
    if (RTC.RTCinstance) {
      return RTC.RTCinstance;
    }
    RTC.type = type;
    RTC.RTCinstance = new RTCPeerConnection();
    return RTC.RTCinstance;
  };
  static getDataChannel = () => {
    return new Promise((res) => {
      if (RTC.DataChannel) {
        res(RTC.DataChannel);
      }
      if (RTC.type === "offer") {
        RTC.DataChannel = RTC.RTCinstance.createDataChannel("chat");
        res(RTC.DataChannel);
      } else if (RTC.type === "answer") {
        RTC.RTCinstance.ondatachannel = (event) => {
          RTC.DataChannel = event.channel;
          res(RTC.DataChannel);
        };
      }
    });
  };
}
export default RTC;
