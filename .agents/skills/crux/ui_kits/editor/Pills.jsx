/* global React */
function Pill({ prompt, onRemove }) {
  const pillStyles = {
    wrap: { position: "relative", maxWidth: "100%" },
    pill: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      maxWidth: "100%",
      border: "1px solid var(--border-strong)",
      borderRadius: 999,
      background: "var(--bg-elevated)",
      color: "var(--fg-muted)",
      padding: "5px 7px 5px 11px",
      fontSize: 12,
      fontWeight: 700,
    },
    preview: {
      display: "block",
      maxWidth: 220,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    close: {
      width: 18,
      height: 18,
      border: 0,
      borderRadius: 999,
      padding: 0,
      background: "var(--border)",
      color: "var(--fg-muted)",
      lineHeight: "18px",
      fontSize: 14,
      cursor: "pointer",
    },
  };
  return (
    <div style={pillStyles.wrap}>
      <div style={pillStyles.pill}>
        <span style={pillStyles.preview} title={prompt}>{prompt}</span>
        <button style={pillStyles.close} aria-label="Remove queued prompt" onClick={onRemove}>×</button>
      </div>
    </div>
  );
}

window.Pill = Pill;
