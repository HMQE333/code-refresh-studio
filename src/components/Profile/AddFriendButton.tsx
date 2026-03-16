import { useState, useEffect, useCallback, useRef } from "react";
import { UserPlus, UserCheck, Clock, UserMinus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface AddFriendButtonProps {
  userId: string;
  currentUserId: string;
}

function spawnParticles(container: HTMLDivElement) {
  const count = 8;
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count;
    const distance = 20 + Math.random() * 12;
    const el = document.createElement("span");
    el.className = "particle";
    el.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
    el.style.setProperty("--ty", `${Math.sin(angle) * distance}px`);
    el.style.left = "50%";
    el.style.top = "50%";
    container.appendChild(el);
    setTimeout(() => el.remove(), 700);
  }
}

export default function AddFriendButton({ userId, currentUserId }: AddFriendButtonProps) {
  const [status, setStatus] = useState<"none" | "pending_sent" | "pending_received" | "friends" | "loading">("loading");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = async () => {
      const { data: friendship } = await supabase
        .from("friendships")
        .select("id")
        .or(`and(user_a.eq.${currentUserId},user_b.eq.${userId}),and(user_a.eq.${userId},user_b.eq.${currentUserId})`)
        .maybeSingle();
      if (friendship) { setStatus("friends"); return; }

      const { data: sentReq } = await supabase
        .from("friend_requests")
        .select("id")
        .eq("sender_id", currentUserId)
        .eq("receiver_id", userId)
        .eq("status", "PENDING")
        .maybeSingle();
      if (sentReq) { setStatus("pending_sent"); return; }

      const { data: recvReq } = await supabase
        .from("friend_requests")
        .select("id")
        .eq("sender_id", userId)
        .eq("receiver_id", currentUserId)
        .eq("status", "PENDING")
        .maybeSingle();
      if (recvReq) { setStatus("pending_received"); return; }

      setStatus("none");
    };
    check();
  }, [userId, currentUserId]);

  const sendRequest = useCallback(async () => {
    setStatus("pending_sent");
    await supabase.from("friend_requests").insert({ sender_id: currentUserId, receiver_id: userId });
    if (containerRef.current) spawnParticles(containerRef.current);
  }, [userId, currentUserId]);

  const acceptRequest = useCallback(async () => {
    await supabase.from("friend_requests").update({ status: "ACCEPTED" }).eq("sender_id", userId).eq("receiver_id", currentUserId);
    const [a, b] = [currentUserId, userId].sort();
    await supabase.from("friendships").insert({ user_a: a, user_b: b });
    setStatus("friends");
    if (containerRef.current) spawnParticles(containerRef.current);
  }, [userId, currentUserId]);

  const removeFriend = useCallback(async () => {
    await supabase.from("friendships").delete().or(`and(user_a.eq.${currentUserId},user_b.eq.${userId}),and(user_a.eq.${userId},user_b.eq.${currentUserId})`);
    setStatus("none");
  }, [userId, currentUserId]);

  if (status === "loading") return null;

  return (
    <div ref={containerRef} className="relative inline-flex">
      {status === "friends" && (
        <Button variant="outline" size="sm" onClick={removeFriend} className="gap-1.5 text-green-500 border-green-500/30">
          <UserCheck className="w-3.5 h-3.5" /> Znajomi
        </Button>
      )}
      {status === "pending_sent" && (
        <Button variant="outline" size="sm" disabled className="gap-1.5 opacity-60">
          <Clock className="w-3.5 h-3.5" /> Wysłano
        </Button>
      )}
      {status === "pending_received" && (
        <Button variant="outline" size="sm" onClick={acceptRequest} className="gap-1.5 text-primary">
          <UserPlus className="w-3.5 h-3.5" /> Akceptuj
        </Button>
      )}
      {status === "none" && (
        <Button variant="outline" size="sm" onClick={sendRequest} className="gap-1.5">
          <UserPlus className="w-3.5 h-3.5" /> Dodaj
        </Button>
      )}
    </div>
  );
}
