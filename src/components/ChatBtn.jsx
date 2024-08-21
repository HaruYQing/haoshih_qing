const ChatBtn = () => {
  return (
    <>
      <a href="/chatroom">
        <i
          className="rounded-circle position-fixed  c-white bg-blueGray d-inline bi bi-chat-dots fs-3 opacity-75 cursor-pointer "
          style={{ bottom: "10%", right: "2%", padding: "1% 1.4%" }}
        ></i>
      </a>
    </>
  );
};

export default ChatBtn;
