class RTC {
  private static type: "offer" | "answer";
  private static RTCinstance: RTCPeerConnection;
  private static DataChannel: RTCDataChannel;
  static getInstance = (type: "offer" | "answer"): RTCPeerConnection => {
    if (RTC.RTCinstance) {
      return RTC.RTCinstance;
    }
    RTC.type = type;
    RTC.RTCinstance = new RTCPeerConnection();
    return RTC.RTCinstance;
  };
  static getDataChannel: () => Promise<RTCDataChannel> = () => {
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
