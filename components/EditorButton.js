const EditorButton = ({ children, isActive, onClick, style = {} }) => {
  const baseStyle = {
    all: "unset",
    boxSizing: "border-box",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: `1px solid ${isActive ? THEME.accent : THEME.border}`,
    backgroundColor: isActive ? "#FDFBF7" : "#FFF",
    color: isActive ? THEME.accent : "inherit",
    transition: "all .2s ease",
    ...style
  };

  return (
    <button onClick={onClick} style={baseStyle}>
      {children}
    </button>
  );
};