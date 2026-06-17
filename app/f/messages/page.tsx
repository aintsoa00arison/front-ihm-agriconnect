import { ChatProvider } from "@/app/services/chat/ChatContext";
import MessagesPage from "@/components/chat/MessagePage";

function page() {
  return (
    <ChatProvider>
      <MessagesPage />
    </ChatProvider>
  );
}

export default page;
