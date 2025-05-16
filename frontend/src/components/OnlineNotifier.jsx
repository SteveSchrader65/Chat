import {useEffect, useRef} from "react";
import useLoginSound from "../hooks/useLoginSound";

export const OnlineUserNotifier = ({ onlineUsers }) => {
  const playSound = useLoginSound();
  const prevUsersRef = useRef(onlineUsers);

  useEffect(() => {
    const prevUsers = prevUsersRef.current;
    const newUsers = onlineUsers.filter(userId => !prevUsers.includes(userId));

    if (
      newUsers.length > 0 &&
      document.visibilityState !== "visible"
    ) {
      playSound();
    }
    prevUsersRef.current = onlineUsers;
  }, [onlineUsers, playSound]);

  return null;
}