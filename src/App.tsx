import React, { useState, useEffect, useRef } from 'react';
import { motion, useDragControls, AnimatePresence } from 'motion/react';
import { Github, Linkedin, Plus, Moon, Sun, X, GripHorizontal, StickyNote as StickyNoteIcon, Trash2, Maximize2 } from 'lucide-react';

const GITHUB_URL = "https://github.com/Barrsum/Lumina-workspace-sticky-notes";
const LINKEDIN_URL = "https://www.linkedin.com/in/ram-bapat-barrsum-diamos";

type NoteColor = {
  bg: string;
  text: string;
  border: string;
  header: string;
};

const NOTE_COLORS: NoteColor[] = [
  { bg: 'bg-[#fef08a]', text: 'text-[#713f12]', border: 'border-[#fde047]', header: 'bg-[#fde047]/40' }, // Yellow
  { bg: 'bg-[#fbcfe8]', text: 'text-[#831843]', border: 'border-[#f9a8d4]', header: 'bg-[#f9a8d4]/40' }, // Pink
  { bg: 'bg-[#bfdbfe]', text: 'text-[#1e3a8a]', border: 'border-[#93c5fd]', header: 'bg-[#93c5fd]/40' }, // Blue
  { bg: 'bg-[#bbf7d0]', text: 'text-[#14532d]', border: 'border-[#86efac]', header: 'bg-[#86efac]/40' }, // Green
  { bg: 'bg-[#e9d5ff]', text: 'text-[#581c87]', border: 'border-[#d8b4fe]', header: 'bg-[#d8b4fe]/40' }, // Purple
];

interface Note {
  id: string;
  text: string;
  color: NoteColor;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export default function App() {
  // Default to dark theme
  const [isDark, setIsDark] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const boardRef = useRef<HTMLDivElement>(null);

  // Apply theme class to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const addNote = () => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    
    // Random position near center, responsive to screen size
    const isMobile = window.innerWidth < 640;
    const defaultSize = isMobile ? 200 : 250;
    
    const x = Math.max(20, window.innerWidth / 2 - (defaultSize/2) + (Math.random() * 40 - 20));
    const y = Math.max(100, window.innerHeight / 2 - (defaultSize/2) + (Math.random() * 40 - 20));
    
    const newNote: Note = {
      id: Date.now().toString(),
      text: '',
      color: NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)],
      x,
      y,
      width: defaultSize,
      height: defaultSize,
      zIndex: newZIndex,
    };
    
    setNotes([...notes, newNote]);
  };

  const updateNoteText = (id: string, text: string) => {
    setNotes(notes.map(note => note.id === id ? { ...note, text } : note));
  };

  const updateNoteSize = (id: string, width: number, height: number) => {
    setNotes(notes.map(note => note.id === id ? { ...note, width, height } : note));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const clearAllNotes = () => {
    if (window.confirm("Are you sure you want to clear all notes?")) {
      setNotes([]);
    }
  };

  const bringToFront = (id: string) => {
    const newZIndex = maxZIndex + 1;
    setMaxZIndex(newZIndex);
    setNotes(notes.map(note => note.id === id ? { ...note, zIndex: newZIndex } : note));
  };

  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="bg-dots"></div>

      {/* Full Sticky Header */}
      <header className="absolute top-0 left-0 w-full px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center z-50 glass-panel border-b border-[var(--border-color)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-xl shadow-md">
            <StickyNoteIcon size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-bold tracking-tight leading-none">Lumina | Sticky Notes App - By Ram Bapat</h1>
            <span className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase font-semibold mt-1">Workspace</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 ml-4 sm:ml-12">
          <button 
            onClick={addNote}
            className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold transition-transform active:scale-95 shadow-md text-sm"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Note</span>
          </button>
          
          <div className="w-px h-6 bg-[var(--border-color)] mx-1"></div>
          
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)]"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Board Area */}
      <main ref={boardRef} className="flex-grow w-full h-full relative z-10 pt-24 pb-24 touch-none">
        <AnimatePresence>
          {notes.map(note => (
            <StickyNote
              key={note.id}
              note={note}
              boardRef={boardRef}
              updateText={updateNoteText}
              updateSize={updateNoteSize}
              deleteNote={deleteNote}
              bringToFront={bringToFront}
            />
          ))}
        </AnimatePresence>
        
        {notes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50 px-4 text-center">
            <StickyNoteIcon size={48} className="mb-4 text-[var(--text-muted)] opacity-30" />
            <p className="text-[var(--text-main)] font-semibold text-lg sm:text-xl">Your canvas is empty</p>
            <p className="text-[var(--text-muted)] text-sm mt-2 max-w-xs">Tap "New Note" to start capturing your ideas in a beautiful spatial workspace.</p>
          </div>
        )}
      </main>

      {/* Full Sticky Footer */}
      <footer className="absolute bottom-0 left-0 w-full px-4 sm:px-6 py-3 z-50 glass-panel border-t border-[var(--border-color)] flex flex-row justify-between items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-3">
          <span className="text-[10px] sm:text-xs font-bold text-[var(--text-main)] tracking-widest uppercase">Made by Ram Bapat</span>
          <div className="w-px h-3 bg-[var(--border-color)]"></div>
          <span className="text-[10px] sm:text-xs font-medium text-[var(--text-muted)] hidden sm:inline">Day 16 • Vibe Coding</span>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-5">
          {notes.length > 0 && (
            <>
              <button 
                onClick={clearAllNotes}
                className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
              >
                <Trash2 size={14} /> <span className="hidden sm:inline">Clear</span>
              </button>
              <div className="w-px h-3 bg-[var(--border-color)]"></div>
            </>
          )}
          <a 
            href={GITHUB_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            title="GitHub"
          >
            <Github size={18} />
          </a>
          <a 
            href={LINKEDIN_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            title="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </footer>
    </div>
  );
}

// Separate component for individual sticky notes
function StickyNote({ 
  note, 
  boardRef, 
  updateText, 
  updateSize,
  deleteNote, 
  bringToFront 
}: { 
  key?: string | number;
  note: Note; 
  boardRef: React.RefObject<HTMLDivElement>;
  updateText: (id: string, text: string) => void;
  updateSize: (id: string, width: number, height: number) => void;
  deleteNote: (id: string) => void;
  bringToFront: (id: string) => void;
}) {
  const controls = useDragControls();

  // Custom resize handler for mobile & desktop compatibility
  const handleResizeStart = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    bringToFront(note.id);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = note.width;
    const startHeight = note.height;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      // Minimum size 150x150
      const newWidth = Math.max(150, startWidth + (moveEvent.clientX - startX));
      const newHeight = Math.max(150, startHeight + (moveEvent.clientY - startY));
      updateSize(note.id, newWidth, newHeight);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <motion.div
      drag
      dragControls={controls}
      dragListener={false} // Disable dragging on the whole div so text selection works
      dragMomentum={false}
      dragConstraints={boardRef}
      onPointerDown={() => bringToFront(note.id)}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      style={{ 
        x: note.x, 
        y: note.y, 
        zIndex: note.zIndex,
        width: note.width,
        height: note.height
      }}
      className={`absolute rounded-2xl border ${note.color.bg} ${note.color.border} ${note.color.text} note-shadow flex flex-col overflow-hidden`}
    >
      {/* Drag Handle Header */}
      <div 
        onPointerDown={(e) => controls.start(e)}
        className={`h-10 ${note.color.header} flex justify-between items-center px-3 cursor-grab active:cursor-grabbing border-b ${note.color.border} transition-colors touch-none`}
      >
        <GripHorizontal size={16} className="opacity-40" />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            deleteNote(note.id);
          }}
          className="p-1.5 rounded-full hover:bg-black/10 transition-colors opacity-60 hover:opacity-100"
        >
          <X size={14} />
        </button>
      </div>
      
      {/* Text Area */}
      <textarea
        value={note.text}
        onChange={(e) => updateText(note.id, e.target.value)}
        placeholder="Write something..."
        className="flex-grow p-4 sm:p-5 bg-transparent resize-none outline-none font-handwriting text-2xl sm:text-3xl leading-relaxed placeholder:text-current placeholder:opacity-40"
        spellCheck="false"
      />
      
      {/* Custom Resize Handle (Works on Mobile & Desktop) */}
      <div 
        onPointerDown={handleResizeStart}
        className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize touch-none flex items-end justify-end p-2 opacity-30 hover:opacity-100 transition-opacity"
      >
        <Maximize2 size={14} className="rotate-90" />
      </div>
    </motion.div>
  );
}
