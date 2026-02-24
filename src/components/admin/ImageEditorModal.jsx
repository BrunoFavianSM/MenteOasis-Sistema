import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Group } from 'react-konva';
import {
    X, Save, Undo2, MousePointer2, Eraser,
    Maximize, RefreshCw,
    Sparkles, Minus, Plus, ShieldAlert,
    Brush as BrushIcon
} from 'lucide-react';

const TOOLS = {
    SELECT: 'select',
    PIXEL: 'pixel',
    BLUR: 'blur',
    ERASE: 'erase'
};

const ImageEditorModal = ({
    isOpen,
    onClose,
    imageSrc,
    onSave, // Expecting onSave(files array, dataUrls array) for bulk
    imageName = 'edited-image.webp',
    allImages = [], // Array of {src, name}
    onIndexChange
}) => {
    const [image, setImage] = useState(null);
    const [pixelImage, setPixelImage] = useState(null);
    const [blurImage, setBlurImage] = useState(null);
    const [lines, setLines] = useState([]);
    const [sessionHistory, setSessionHistory] = useState({}); // { index: linesArray }
    const [tool, setTool] = useState(TOOLS.PIXEL);
    const [brushSize, setBrushSize] = useState(40);

    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const isDrawing = useRef(false);
    const stageRef = useRef(null);
    const [dim, setDim] = useState({ width: 0, height: 0 });
    const [loading, setLoading] = useState(true);
    const [isSavingBulk, setIsSavingBulk] = useState(false);

    const currentIndex = allImages.findIndex(img => img.src === imageSrc);
    const hasUnsavedChanges = lines.length > 0 || Object.values(sessionHistory).some(l => l.length > 0);

    useEffect(() => {
        if (!isOpen || !imageSrc) return;
        setLoading(true);

        // Load lines from session history or reset
        const savedLines = sessionHistory[currentIndex] || [];
        setLines(savedLines);

        setScale(1);
        setPosition({ x: 0, y: 0 });

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageSrc;
        img.onload = () => {
            setImage(img);
            const maxW = window.innerWidth * 0.80;
            const maxH = window.innerHeight * 0.65;
            const ratio = img.width / img.height;
            let w = maxW;
            let h = maxW / ratio;
            if (h > maxH) { h = maxH; w = maxH * ratio; }
            setDim({ width: w, height: h });

            const pCanvas = document.createElement('canvas');
            pCanvas.width = img.width; pCanvas.height = img.height;
            const pCtx = pCanvas.getContext('2d');
            const pSize = 25;
            pCtx.imageSmoothingEnabled = false;
            pCtx.drawImage(img, 0, 0, img.width / pSize, img.height / pSize);
            pCtx.drawImage(pCanvas, 0, 0, img.width / pSize, img.height / pSize, 0, 0, img.width, img.height);
            const pImg = new Image();
            pImg.src = pCanvas.toDataURL();
            pImg.onload = () => setPixelImage(pImg);

            const bCanvas = document.createElement('canvas');
            bCanvas.width = img.width; bCanvas.height = img.height;
            const bCtx = bCanvas.getContext('2d');
            bCtx.filter = 'blur(20px)';
            bCtx.drawImage(img, 0, 0);
            const bImg = new Image();
            bImg.src = bCanvas.toDataURL();
            bImg.onload = () => {
                setBlurImage(bImg);
                setLoading(false);
            };
        };
    }, [isOpen, imageSrc, currentIndex]);

    const handleSwitchImage = (index) => {
        if (index === currentIndex) return;

        // Save current work to session history
        setSessionHistory(prev => ({
            ...prev,
            [currentIndex]: lines
        }));

        if (onIndexChange) onIndexChange(index);
    };

    const handleMouseDown = (e) => {
        if (tool === TOOLS.SELECT || isSavingBulk) return;
        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
        if (!pos) return;

        const transform = stage.getAbsoluteTransform().copy().invert();
        const pt = transform.point(pos);

        isDrawing.current = true;
        setLines([...lines, {
            tool,
            points: [pt.x, pt.y],
            strokeWidth: brushSize / scale
        }]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current || tool === TOOLS.SELECT || isSavingBulk) return;
        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
        if (!pos) return;

        const transform = stage.getAbsoluteTransform().copy().invert();
        const pt = transform.point(pos);

        const newLines = lines.slice();
        let lastLine = newLines[newLines.length - 1];
        if (lastLine) {
            lastLine.points = lastLine.points.concat([pt.x, pt.y]);
            setLines(newLines);
        }
    };

    const handleMouseUp = () => {
        isDrawing.current = false;
    };

    const handleUndo = () => setLines(lines.slice(0, -1));
    const handleClear = () => {
        if (window.confirm('¿Borrar todas las ediciones de esta imagen?')) setLines([]);
    };

    const handleSaveBulk = async () => {
        if (!stageRef.current) return;

        // 1. Finalize current session history
        const finalSession = {
            ...sessionHistory,
            [currentIndex]: lines
        };

        const editedIndices = Object.keys(finalSession).filter(idx => finalSession[idx].length > 0).map(Number);

        if (editedIndices.length === 0) {
            onClose();
            return;
        }

        setIsSavingBulk(true);
        const results = [];

        try {
            for (const idx of editedIndices) {
                const imgData = allImages[idx];

                // Need to load the image onto the stage
                const tempImg = new Image();
                tempImg.crossOrigin = 'Anonymous';
                tempImg.src = imgData.src;

                await new Promise((resolve) => {
                    tempImg.onload = resolve;
                });

                // Set up temp images for pixel/blur
                const pCanvas = document.createElement('canvas');
                pCanvas.width = tempImg.width; pCanvas.height = tempImg.height;
                const pCtx = pCanvas.getContext('2d');
                pCtx.imageSmoothingEnabled = false;
                pCtx.drawImage(tempImg, 0, 0, tempImg.width / 25, tempImg.height / 25);
                pCtx.drawImage(pCanvas, 0, 0, tempImg.width / 25, tempImg.height / 25, 0, 0, tempImg.width, tempImg.height);
                const pImg = new Image(); pImg.src = pCanvas.toDataURL();
                await new Promise(r => pImg.onload = r);

                const bCanvas = document.createElement('canvas');
                bCanvas.width = tempImg.width; bCanvas.height = tempImg.height;
                const bCtx = bCanvas.getContext('2d');
                bCtx.filter = 'blur(20px)';
                bCtx.drawImage(tempImg, 0, 0);
                const bImg = new Image(); bImg.src = bCanvas.toDataURL();
                await new Promise(r => bImg.onload = r);

                // Update stage state manually for export
                setImage(tempImg);
                setPixelImage(pImg);
                setBlurImage(bImg);
                setLines(finalSession[idx]);
                setScale(1);
                setPosition({ x: 0, y: 0 });

                // Wait for render cycle
                await new Promise(r => setTimeout(r, 100));

                const dataUrl = stageRef.current.toDataURL({
                    pixelRatio: 1,
                    mimeType: 'image/webp',
                    quality: 0.95
                });

                const response = await fetch(dataUrl);
                const blob = await response.blob();
                let finalName = imgData.name.toLowerCase().endsWith('.webp') ? imgData.name : imgData.name.split('.')[0] + '.webp';
                const file = new File([blob], finalName, { type: 'image/webp' });

                results.push({
                    file,
                    dataUrl,
                    index: idx
                });
            }

            onSave(results);
            onClose();
        } catch (err) {
            console.error("Bulk save error:", err);
            alert("Error al guardar el lote.");
        } finally {
            setIsSavingBulk(false);
        }
    };
    if (!isOpen || !imageSrc) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-[100] flex flex-col p-2 sm:p-6 text-slate-200 select-none" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 bg-slate-900/40 p-5 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-5">
                    <div className="bg-brand-600 p-3 rounded-2xl shadow-xl shadow-brand-500/20">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-white font-black text-2xl tracking-tight leading-tight">Pincel Mágico Oasis</h2>
                            {allImages.length > 1 && (
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                    <button
                                        onClick={() => handleSwitchImage((currentIndex - 1 + allImages.length) % allImages.length)}
                                        className="text-slate-400 hover:text-white transition p-1"
                                    >
                                        <Undo2 size={16} className="rotate-90" />
                                    </button>
                                    <span className="text-[10px] font-black text-brand-400 min-w-[40px] text-center">
                                        {currentIndex + 1} / {allImages.length}
                                    </span>
                                    <button
                                        onClick={() => handleSwitchImage((currentIndex + 1) % allImages.length)}
                                        className="text-slate-400 hover:text-white transition p-1"
                                    >
                                        <Undo2 size={16} className="-rotate-90" />
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] uppercase font-black tracking-widest mt-1">
                            <span className="text-brand-400">Censura Premium</span>
                            <div className="w-1 h-1 rounded-full bg-slate-600" />
                            <span className="text-slate-500 truncate max-w-[200px]">{imageName}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleUndo} disabled={lines.length === 0} className="p-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition disabled:opacity-10" title="Deshacer" type="button"><Undo2 size={24} /></button>
                    <button onClick={handleClear} className="p-4 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-2xl transition" title="Limpiar todo" type="button"><RefreshCw size={24} /></button>
                    <div className="w-px h-10 bg-white/5 mx-2" />
                    <button onClick={onClose} className="p-4 bg-slate-800 text-slate-400 hover:text-white rounded-full transition hover:rotate-90" type="button"><X size={28} /></button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
                <div className="flex md:flex-col gap-4 p-5 bg-slate-900/40 rounded-[3rem] border border-white/5 h-fit md:h-full backdrop-blur-md shadow-2xl">
                    {[
                        { id: TOOLS.SELECT, icon: MousePointer2, label: 'Mover' },
                        { id: TOOLS.PIXEL, icon: ShieldAlert, label: 'Pixelar' },
                        { id: TOOLS.BLUR, icon: BrushIcon, label: 'Difuminar' },
                        { id: TOOLS.ERASE, icon: Eraser, label: 'Borrador' }
                    ].map(btn => (
                        <button key={btn.id} type="button" onClick={() => setTool(btn.id)} className={`p-6 rounded-[2rem] flex flex-col items-center gap-2 transition-all relative group ${tool === btn.id ? 'bg-brand-600 text-white shadow-2xl shadow-brand-500/30 scale-105' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
                            <btn.icon size={26} />
                            <span className="hidden md:block text-[9px] font-black uppercase tracking-[0.2em] mt-2 opacity-70 group-hover:opacity-100">{btn.label}</span>
                        </button>
                    ))}
                    <div className="hidden md:block flex-1" />
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className="relative h-48 w-10 flex items-center justify-center">
                            <input type="range" min="10" max="150" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="h-2 w-48 accent-brand-500 -rotate-90 cursor-grab active:cursor-grabbing" />
                        </div>
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">{brushSize}px</span>
                    </div>
                </div>

                <div className="flex-1 bg-slate-900/10 rounded-[4rem] border border-white/5 relative overflow-hidden flex flex-col group shadow-2xl">
                    <div className="flex-1 flex items-center justify-center relative min-h-0">
                        {loading || isSavingBulk ? (
                            <div className="flex flex-col items-center gap-8">
                                <RefreshCw className="animate-spin text-brand-600" size={60} />
                                {isSavingBulk && <p className="text-white font-black animate-pulse uppercase tracking-[0.3em] text-xs">Guardando Lote...</p>}
                            </div>
                        ) : (
                            <Stage
                                width={dim.width} height={dim.height} ref={stageRef}
                                x={position.x} y={position.y} scaleX={scale} scaleY={scale}
                                draggable={tool === TOOLS.SELECT}
                                onDragMove={(e) => setPosition({ x: e.target.x(), y: e.target.y() })}
                                onDragEnd={(e) => setPosition({ x: e.target.x(), y: e.target.y() })}
                                onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
                                onTouchStart={handleMouseDown} onTouchMove={handleMouseMove} onTouchEnd={handleMouseUp}
                                className="bg-black/40 shadow-2xl"
                            >
                                <Layer listening={false}>
                                    <KonvaImage image={image} width={dim.width} height={dim.height} />
                                </Layer>
                                <Layer listening={false}>
                                    <Group>
                                        {lines.filter(l => l.tool === TOOLS.PIXEL || l.tool === TOOLS.ERASE).map((line, i) => (
                                            <Line key={i} points={line.points} stroke="black" strokeWidth={line.strokeWidth} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation={line.tool === TOOLS.ERASE ? 'destination-out' : 'source-over'} />
                                        ))}
                                    </Group>
                                    <KonvaImage image={pixelImage} width={dim.width} height={dim.height} globalCompositeOperation="source-in" />
                                </Layer>
                                <Layer listening={false}>
                                    <Group>
                                        {lines.filter(l => l.tool === TOOLS.BLUR || l.tool === TOOLS.ERASE).map((line, i) => (
                                            <Line key={i} points={line.points} stroke="black" strokeWidth={line.strokeWidth} tension={0.5} lineCap="round" lineJoin="round" globalCompositeOperation={line.tool === TOOLS.ERASE ? 'destination-out' : 'source-over'} />
                                        ))}
                                    </Group>
                                    <KonvaImage image={blurImage} width={dim.width} height={dim.height} globalCompositeOperation="source-in" />
                                </Layer>
                            </Stage>
                        )}

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 bg-slate-950/80 backdrop-blur-2xl rounded-3xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-[20]">
                            <button onClick={() => setScale(s => s * 1.25)} className="p-3 text-white hover:bg-white/10 rounded-2xl transition" type="button"><Plus size={20} /></button>
                            <span className="text-xs text-brand-400 font-black px-4 min-w-[70px] text-center tracking-widest">{Math.round(scale * 100)}%</span>
                            <button onClick={() => setScale(s => s / 1.25)} className="p-3 text-white hover:bg-white/10 rounded-2xl transition" type="button"><Minus size={20} /></button>
                            <div className="w-px h-10 bg-white/10 mx-2" />
                            <button onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }} className="p-3 text-white bg-brand-600 hover:bg-brand-500 rounded-2xl transition shadow-lg shadow-brand-500/20" type="button"><Maximize size={20} /></button>
                        </div>
                    </div>

                    {/* Quick Image Switcher Strip */}
                    {allImages.length > 1 && (
                        <div className="h-32 bg-slate-900/60 border-t border-white/5 p-4 flex gap-4 overflow-x-auto scrollbar-hide items-center px-8">
                            {allImages.map((img, idx) => {
                                const isEdited = (idx === currentIndex && lines.length > 0) || (sessionHistory[idx] && sessionHistory[idx].length > 0);
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleSwitchImage(idx)}
                                        className={`relative h-20 aspect-square rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${currentIndex === idx ? 'border-brand-500 scale-110 shadow-lg shadow-brand-500/20 ring-4 ring-brand-500/10' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'}`}
                                    >
                                        <img src={img.src} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                                        {isEdited && (
                                            <div className="absolute top-2 right-2 w-3 h-3 bg-brand-500 rounded-full border-2 border-slate-950 shadow-lg" />
                                        )}
                                        {currentIndex === idx && (
                                            <div className="absolute inset-0 bg-brand-600/10 flex items-center justify-center">
                                                <Sparkles className="text-white" size={16} />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="md:w-80 flex flex-col gap-6 h-full">
                    <div className="flex-1 p-8 bg-slate-900/40 rounded-[3rem] border border-white/5 backdrop-blur-md shadow-2xl">
                        <h4 className="text-brand-400 font-black text-[10px] uppercase tracking-[0.4em] mb-10 flex items-center gap-3"><Sparkles size={16} /> GUÍA RÁPIDA</h4>
                        <div className="space-y-10">
                            {[
                                { t: 'Mover e Interacción', d: 'Activa el modo "Mover" para desplazarte por la imagen.', c: 'bg-blue-500' },
                                { t: 'Pincel Mágico', d: 'Pixelar o Difuminar para proteger rostros.', c: 'bg-brand-500' },
                                { t: 'Borrador Inteligente', d: 'Limpia trazos accidentales.', c: 'bg-red-500' }
                            ].map((item, i) => (
                                <div key={i} className="group cursor-default">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className={`w-3 h-3 rounded-full ${item.c} shadow-[0_0_15px_${item.c}] group-hover:scale-125 transition-transform`} />
                                        <p className="text-white text-[12px] font-black uppercase tracking-widest">{item.t}</p>
                                    </div>
                                    <p className="text-slate-500 text-[11px] leading-relaxed ml-7 font-medium opacity-80">{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleSaveBulk}
                        type="button"
                        disabled={isSavingBulk}
                        className="w-full py-8 bg-brand-600 hover:bg-brand-500 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] shadow-[0_20px_60px_rgba(240,111,54,0.3)] transition-all hover:-translate-y-2 active:scale-95 flex items-center justify-center gap-4 border-t border-white/20 disabled:opacity-50 disabled:translate-y-0"
                    >
                        <Save size={24} /> {isSavingBulk ? 'GUARDANDO...' : 'CONFIRMAR TODO'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageEditorModal;
