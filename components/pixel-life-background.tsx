"use client";

import type React from "react";
import { useEffect, useRef, useMemo, useState } from "react";

const PixelLifeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(null);
  const gridRef = useRef<Uint8Array>(null);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  // Larger cells and slower updates
  const cellSize = 8; // Increased from 4 to 8
  const updateInterval = 10; // Increased from 16 to 500ms for slower animation

  const { cols, rows } = useMemo(() => {
    return {
      cols: Math.ceil(dimensions.width / cellSize),
      rows: Math.ceil(dimensions.height / cellSize),
    };
  }, [dimensions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      canvas.style.width = `${dimensions.width}px`;
      canvas.style.height = `${dimensions.height}px`;
      ctx.scale(cellSize, cellSize); // Scale context to match cell size
    };

    updateCanvasSize();

    // Initialize grid only if it doesn't exist or dimensions changed
    if (!gridRef.current || gridRef.current.length !== cols * rows) {
      const newGrid = new Uint8Array(cols * rows);

      // If we have an existing grid, copy as much of it as we can
      if (gridRef.current) {
        const oldCols = Math.ceil(canvas.width / cellSize);
        const minCols = Math.min(oldCols, cols);
        const minRows = Math.min(rows, gridRef.current.length / oldCols);

        for (let y = 0; y < minRows; y++) {
          for (let x = 0; x < minCols; x++) {
            newGrid[y * cols + x] = gridRef.current[y * oldCols + x];
          }
        }

        // Fill any new cells randomly
        for (let i = 0; i < cols * rows; i++) {
          if (newGrid[i] === 0) {
            newGrid[i] = Math.random() < 0.3 ? 1 : 0;
          }
        }
      } else {
        // Initial random pattern
        for (let i = 0; i < cols * rows; i++) {
          newGrid[i] = Math.random() < 0.3 ? 1 : 0;
        }
      }

      gridRef.current = newGrid;
    }

    // Optimized neighbor counting using direct array access
    function countNeighbors(x: number, y: number) {
      if (!gridRef.current) return 0;
      let sum = 0;

      // Check all 8 neighbors with wrapping
      const top = ((y - 1 + rows) % rows) * cols;
      const bottom = ((y + 1) % rows) * cols;
      const left = (x - 1 + cols) % cols;
      const right = (x + 1) % cols;

      sum += gridRef.current[top + left];
      sum += gridRef.current[top + x];
      sum += gridRef.current[top + right];
      sum += gridRef.current[y * cols + left];
      sum += gridRef.current[y * cols + right];
      sum += gridRef.current[bottom + left];
      sum += gridRef.current[bottom + x];
      sum += gridRef.current[bottom + right];

      return sum;
    }

    const buffer = new Uint8Array(cols * rows);

    function update() {
      if (!gridRef.current) return;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const idx = y * cols + x;
          const neighbors = countNeighbors(x, y);
          const state = gridRef.current[idx];

          buffer[idx] =
            (state && (neighbors === 2 || neighbors === 3)) ||
            (!state && neighbors === 3)
              ? 1
              : 0;
        }
      }

      // Copy buffer to grid instead of swapping
      gridRef.current.set(buffer);
    }

    function draw() {
      if (!gridRef.current || !ctx) return;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, cols, rows);

      ctx.fillStyle = "#EC4899"; // Changed to pink (Tailwind pink-500)
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (gridRef.current[y * cols + x]) {
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    }

    let lastUpdateTime = 0;
    function animate(currentTime: number) {
      if (currentTime - lastUpdateTime > updateInterval) {
        update();
        draw();
        lastUpdateTime = currentTime;
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animationFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [cols, rows, dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 z-0"
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
    />
  );
};

export default PixelLifeBackground;
