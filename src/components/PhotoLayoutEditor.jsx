import React, { useState, memo } from "react";
import { ChevronDown } from "lucide-react";
import LayoutSection from "./LayoutSection";
import FinishSection from "./FinishSection";
import MaskSection from "./MaskSection";

const THEME = {
  accent: "#8b6f48",
  muted: "#A0A0A0",
  fontSmall: 9
};

const PhotoLayoutEditor = (props) => {
  const [activeSection, setActiveSection] = useState("layout");

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Wrapper para o Header do Accordion
  const SectionWrapper = ({ id, title, children }) => {
    const isOpen = activeSection === id;
    return (
      <section style={{ borderBottom: "1px solid #F9F9F9", paddingBottom: 12, marginBottom: 12 }}>
        <div 
          onClick={() => toggleSection(id)}
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", padding: "8px 0" }}
        >
          <span style={{ 
            fontSize: THEME.fontSmall, 
            fontWeight: 900, 
            color: isOpen ? THEME.accent : THEME.muted, 
            letterSpacing: "1.2px", 
            textTransform: "uppercase" 
          }}>
            {title}
          </span>
          <div style={{ flex: 1, height: 1, background: "#F2F2F2" }} />
          <ChevronDown 
            size={12} 
            style={{ 
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", 
              transition: "0.3s",
              color: THEME.muted 
            }} 
          />
        </div>
        <div style={{
          maxHeight: isOpen ? "400px" : "0px",
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          marginTop: isOpen ? "12px" : "0px"
        }}>
          {children}
        </div>
      </section>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <SectionWrapper id="layout" title="Layout">
        <LayoutSection onLayoutChange={props.onLayoutChange} />
      </SectionWrapper>

      <SectionWrapper id="finish" title="Finish">
        <FinishSection onBgChange={props.onBgChange} />
      </SectionWrapper>

      <SectionWrapper id="masks" title="Masken">
        <MaskSection onMaskChange={props.onMaskChange} />
      </SectionWrapper>
    </div>
  );
};

export default memo(PhotoLayoutEditor);