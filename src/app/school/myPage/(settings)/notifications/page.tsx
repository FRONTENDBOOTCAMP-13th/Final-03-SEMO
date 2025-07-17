"use client";

import React, { useState } from "react";

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    messageAlert: true,
    postLikeAlert: false,
    postCommentAlert: false,
    participationConfirmationAlert: false,
    recruitmentCompletionAlert: false,
  });

  return <div className="min-h-screen bg-uni-white" />;
}
