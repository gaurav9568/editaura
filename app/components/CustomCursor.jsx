"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Hide cursor on touch devices
    if ("ontouchstart" in window) {
      document.body.style.cursor = "auto";
      return;
    }

    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const onDown = () => document.body.classList.add("cc");
    const onUp = () => document.body.classList.remove("cc");

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    // Hover listeners
    const addHover = (el) => {
      el.addEventListener("mouseenter", () =>
        document.body.classList.add("ch")
      );
      el.addEventListener("mouseleave", () =>
        document.body.classList.remove("ch")
      );
    };

    const attachHovers = () => {
      document
        .querySelectorAll(
          "a,button,.folder-card,.svc-item,.tcard,input,textarea,select"
        )
        .forEach(addHover);
    };

    attachHovers();

    // Observe DOM changes to re-attach hovers
    const observer = new MutationObserver(() => {
      attachHovers();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Animation loop
    let raf;
    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.left = mouse.current.x + "px";
        dotRef.current.style.top = mouse.current.y + "px";
      }
      ring.current.x += (mouse.current.x - ring.current.x) * 0.1;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + "px";
        ringRef.current.style.top = ring.current.y + "px";
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div id="cdot" ref={dotRef} />
      <div id="cring" ref={ringRef} />
    </>
  );
}
