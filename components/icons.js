export function Icon({ name, size = 18 }) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };
  switch (name) {
    case "home":
      return (
        <svg {...props}>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
        </svg>
      );
    case "plus":
      return (
        <svg {...props}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case "play":
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <path d="m10 9 6 3-6 3z" />
        </svg>
      );
    case "chart":
      return (
        <svg {...props}>
          <path d="M4 19V5M4 19h16" />
          <path d="M8 15v-3M12 15V8M16 15v-5" />
        </svg>
      );
    case "heart":
      return (
        <svg {...props}>
          <path d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z" />
        </svg>
      );
    case "image":
      return (
        <svg {...props}>
          <rect x="4" y="5" width="16" height="14" rx="3" />
          <path d="m8 15 2.5-2.5L14 16l2-2 2 2" />
          <circle cx="9" cy="9" r="1" />
        </svg>
      );
    case "gear":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3.5v2.2M12 18.3v2.2M4.8 6.2l1.6 1.6M17.6 16.2l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.8 17.8l1.6-1.6M17.6 7.8l1.6-1.6" />
        </svg>
      );
    case "bell":
      return (
        <svg {...props}>
          <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5z" />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
      );
    case "upload":
      return (
        <svg {...props}>
          <path d="M12 16V6" />
          <path d="m8 9 4-4 4 4" />
          <path d="M5 19h14" />
        </svg>
      );
    case "video":
      return (
        <svg {...props}>
          <rect x="3.5" y="6" width="12" height="12" rx="2.5" />
          <path d="m15.5 10 5-2.5v9L15.5 14z" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...props}>
          <rect x="4" y="5" width="16" height="15" rx="2.5" />
          <path d="M8 3.5V7M16 3.5V7M4 10h16" />
        </svg>
      );
    case "mail":
      return (
        <svg {...props}>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
          <path d="m5 8 7 5 7-5" />
        </svg>
      );
    case "pin":
      return (
        <svg {...props}>
          <path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z" />
          <circle cx="12" cy="11" r="1.6" />
        </svg>
      );
    case "download":
      return (
        <svg {...props}>
          <path d="M12 4v10" />
          <path d="m8 11 4 4 4-4" />
          <path d="M5 19h14" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...props}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "menu":
      return (
        <svg {...props}>
          <path d="M5 7h14M5 12h14M5 17h10" />
        </svg>
      );
    case "close":
      return (
        <svg {...props}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );
    case "refresh":
      return (
        <svg {...props}>
          <path d="M20 12a8 8 0 1 1-2.2-5.5" />
          <path d="M20 4v5h-5" />
        </svg>
      );
    case "trash":
      return (
        <svg {...props}>
          <path d="M5 7h14" />
          <path d="M9 7V5h6v2" />
          <path d="m7 7 1 13h8l1-13" />
        </svg>
      );
    default:
      return null;
  }
}

export function TikTokMark() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.5 3c.4 2.4 1.8 4.1 4.1 4.5v2.4c-1.4 0-2.7-.4-4-1.2v6.4c0 3.3-2.6 5.9-6.1 5.9S2.4 18.4 2.4 15.1c0-3.2 2.5-5.8 5.7-5.9v2.6c-1.7.1-3 1.5-3 3.3 0 1.8 1.5 3.3 3.4 3.3s3.4-1.5 3.4-3.4V3h2.6z"
      />
    </svg>
  );
}

export function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.6" cy="7.4" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function PinterestMark() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3.2A8.8 8.8 0 0 0 8 19.9c-.1-.7-.2-1.8 0-2.6l1.5-6.3s-.4-.7-.4-1.8c0-1.7 1-3 2.2-3 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4-.3 1.2.6 2.2 1.8 2.2 2.1 0 3.6-2.7 3.6-6 0-2.5-1.7-4.3-4.7-4.3A5 5 0 0 0 7 9.6c0 1.1.3 1.8.8 2.4.2.2.2.3.1.6l-.3 1c-.1.3-.3.4-.6.3-1.5-.6-2.2-2.3-2.2-4.1C4.8 6.4 7.8 3.2 12.2 3.2c3.6 0 6 2.6 6 5.4 0 3.7-2 6.4-5 6.4-1 0-1.9-.5-2.2-1.2l-.6 2.3c-.2.8-.7 1.6-1.1 2.2A8.8 8.8 0 1 0 12 3.2z"
      />
    </svg>
  );
}
