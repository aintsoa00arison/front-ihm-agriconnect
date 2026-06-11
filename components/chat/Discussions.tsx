import { discussions } from "@/data/discussion";
import Discussion from "./Discussion";

function Discussions() {
  return (
    <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 pr-4">
      {discussions.map((discussion) => (
        <Discussion
          key={discussion.id}
          name={discussion.name}
          lastMessage={discussion.lastMessage}
          lastMessageDate={discussion.lastMessageDate}
          hasNewMessage={discussion.hasNewMessage}
          isOnline={discussion.isOnline}
        />
      ))}
    </div>
  );
}

export default Discussions;
