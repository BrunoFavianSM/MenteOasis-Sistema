import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Group, Rect } from 'react-konva';
import {
    X, Save, Undo2, MousePointer2, Eraser,
    Maximize, RefreshCw,
    Sparkles, Minus, Plus, ShieldAlert,
    Brush as BrushIcon, Crop, Check, XCircle,
    ChevronLeft, ChevronRight
} from 'lucide-react';

const TOOLS = {
    SELECT: 'select',
    PIXEL: 'pixel',
    BLUR: 'blur',
    ERASE: 'erase',
    CROP: 'crop'
};

// Helper: generate pixel + blur images from a source Image
const generateEffectImages = (sourceImg) => {
    return new Promise((resolve) => {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = sourceImg.width; pCanvas.height = sourceImg.height;
        const pCtx = pCanvas.getContext('2d');
        pCtx.imageSmoothingEnabled = false;
        pCtx.drawImage(sourceImg, 0, 0, sourceImg.width / 25, sourceImg.height / 25);
        pCtx.drawImage(pCanvas, 0, 0, sourceImg.width / 25, sourceImg.height / 25, 0, 0, sourceImg.width, sourceImg.height);

        const bCanvas = document.createElement('canvas');
        bCanvas.width = sourceImg.width; bCanvas.height = sourceImg.height;
        const bCtx = bCanvas.getContext('2d');
        bCtx.filter = 'blur(20px)';
        bCtx.drawImage(sourceImg, 0, 0);

        const pImg = new window.Image();
        const bImg = new window.Image();
        let loaded = 0;
        const check = () => { loaded++; if (loaded === 2) resolve({ pixelImg: pImg, blurImg: bImg }); };
        pImg.onload = check;
        bImg.onload = check;
        pImg.src = pCanvas.toDataURL();
        bImg.src = bCanvas.toDataURL();
    });
};

const calcDim = (imgW, imgH) => {
    const maxW = window.innerWidth * 0.80;
    const maxH = window.innerHeight * 0.65;
    const ratio = imgW / imgH;
    let w = maxW;
    let h = maxW / ratio;
    if (h > maxH) { h = maxH; w = maxH * ratio; }
    return { width: w, height: h };
};

// ========== HTML CROP OVERLAY COMPONENT ==========
const CropOverlay = ({ containerWidth, containerHeight, onApply, onCancel }) => {
    const MIN_SIZE = 30;
    const [crop, setCrop] = useState({
        x: Math.round(containerWidth * 0.1),
        y: Math.round(containerHeight * 0.1),
        w: Math.round(containerWidth * 0.8),
        h: Math.round(containerHeight * 0.8),
    });
    const dragInfo = useRef(null);

    // Reset crop when container dimensions change
    useEffect(() => {
        setCrop({
            x: Math.round(containerWidth * 0.1),
            y: Math.round(containerHeight * 0.1),
            w: Math.round(containerWidth * 0.8),
            h: Math.round(containerHeight * 0.8),
        });
    }, [containerWidth, containerHeight]);

    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    const handlePointerDown = (e, action) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.closest('[data-crop-container]').getBoundingClientRect();
        dragInfo.current = {
            action,
            startX: e.clientX,
            startY: e.clientY,
            startCrop: { ...crop },
            containerRect: rect,
        };

        const handlePointerMove = (ev) => {
            if (!dragInfo.current) return;
            const { action, startX, startY, startCrop } = dragInfo.current;
            const dx = ev.clientX - startX;
            const dy = ev.clientY - startY;

            let newCrop = { ...startCrop };

            if (action === 'move') {
                newCrop.x = clamp(startCrop.x + dx, 0, containerWidth - startCrop.w);
                newCrop.y = clamp(startCrop.y + dy, 0, containerHeight - startCrop.h);
            } else {
                // Resize from edges/corners
                if (action.includes('l')) {
                    const newX = clamp(startCrop.x + dx, 0, startCrop.x + startCrop.w - MIN_SIZE);
                    newCrop.w = startCrop.w + (startCrop.x - newX);
                    newCrop.x = newX;
                }
                if (action.includes('r')) {
                    newCrop.w = clamp(startCrop.w + dx, MIN_SIZE, containerWidth - startCrop.x);
                }
                if (action.includes('t')) {
                    const newY = clamp(startCrop.y + dy, 0, startCrop.y + startCrop.h - MIN_SIZE);
                    newCrop.h = startCrop.h + (startCrop.y - newY);
                    newCrop.y = newY;
                }
                if (action.includes('b')) {
                    newCrop.h = clamp(startCrop.h + dy, MIN_SIZE, containerHeight - startCrop.y);
                }
            }

            setCrop(newCrop);
        };

        const handlePointerUp = () => {
            dragInfo.current = null;
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
        };

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
    };

    const handleApply = () => onApply(crop);

    // Handle styles
    const handleStyle = (cursor) => ({
        position: 'absolute',
        width: '14px',
        height: '14px',
        background: '#fff',
        border: '2px solid #6366f1',
        borderRadius: '3px',
        cursor,
        zIndex: 10,
        touchAction: 'none',
    });

    return (
        <div
            data-crop-container
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: containerWidth,
                height: containerHeight,
                zIndex: 15,
                pointerEvents: 'auto',
            }}
        >
            {/* Dark overlay masks — 4 rects around the crop area */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: crop.y, background: 'rgba(0,0,0,0.55)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: crop.y, left: 0, width: crop.x, height: crop.h, background: 'rgba(0,0,0,0.55)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: crop.y, left: crop.x + crop.w, width: containerWidth - crop.x - crop.w, height: crop.h, background: 'rgba(0,0,0,0.55)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: crop.y + crop.h, left: 0, width: '100%', height: containerHeight - crop.y - crop.h, background: 'rgba(0,0,0,0.55)', pointerEvents: 'none' }} />

            {/* Crop selection area — draggable to move */}
            <div
                style={{
                    position: 'absolute',
                    left: crop.x,
                    top: crop.y,
                    width: crop.w,
                    height: crop.h,
                    border: '2px dashed #818cf8',
                    cursor: 'move',
                    touchAction: 'none',
                    boxSizing: 'border-box',
                }}
                onPointerDown={(e) => handlePointerDown(e, 'move')}
            >
                {/* Rule of thirds grid lines */}
                <div style={{ position: 'absolute', left: '33.3%', top: 0, width: 1, height: '100%', background: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', left: '66.6%', top: 0, width: 1, height: '100%', background: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '33.3%', left: 0, height: 1, width: '100%', background: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', top: '66.6%', left: 0, height: 1, width: '100%', background: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }} />
            </div>

            {/* Resize handles — corners */}
            <div style={{ ...handleStyle('nw-resize'), left: crop.x - 7, top: crop.y - 7 }} onPointerDown={(e) => handlePointerDown(e, 'tl')} />
            <div style={{ ...handleStyle('ne-resize'), left: crop.x + crop.w - 7, top: crop.y - 7 }} onPointerDown={(e) => handlePointerDown(e, 'tr')} />
            <div style={{ ...handleStyle('sw-resize'), left: crop.x - 7, top: crop.y + crop.h - 7 }} onPointerDown={(e) => handlePointerDown(e, 'bl')} />
            <div style={{ ...handleStyle('se-resize'), left: crop.x + crop.w - 7, top: crop.y + crop.h - 7 }} onPointerDown={(e) => handlePointerDown(e, 'br')} />

            {/* Resize handles — edges */}
            <div style={{ ...handleStyle('n-resize'), left: crop.x + crop.w / 2 - 7, top: crop.y - 7 }} onPointerDown={(e) => handlePointerDown(e, 't')} />
            <div style={{ ...handleStyle('s-resize'), left: crop.x + crop.w / 2 - 7, top: crop.y + crop.h - 7 }} onPointerDown={(e) => handlePointerDown(e, 'b')} />
            <div style={{ ...handleStyle('w-resize'), left: crop.x - 7, top: crop.y + crop.h / 2 - 7 }} onPointerDown={(e) => handlePointerDown(e, 'l')} />
            <div style={{ ...handleStyle('e-resize'), left: crop.x + crop.w - 7, top: crop.y + crop.h / 2 - 7 }} onPointerDown={(e) => handlePointerDown(e, 'r')} />

            {/* Action bar */}
            <div
                style={{
                    position: 'absolute',
                    top: 12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 16px',
                    background: 'rgba(79, 70, 229, 0.92)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 14,
                    border: '1px solid rgba(129, 140, 248, 0.3)',
                    boxShadow: '0 10px 40px rgba(79, 70, 229, 0.3)',
                }}
            >
                <Crop size={16} style={{ color: '#fff' }} />
                <span style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recorte</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>
                    {Math.round(crop.w)}×{Math.round(crop.h)}
                </span>
                <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)' }} />
                <button
                    onClick={handleApply}
                    type="button"
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px',
                        background: '#22c55e', border: 'none', borderRadius: 10,
                        color: '#fff', fontSize: 11, fontWeight: 900,
                        textTransform: 'uppercase', cursor: 'pointer',
                        letterSpacing: '0.05em',
                    }}
                >
                    <Check size={14} /> Aplicar
                </button>
                <button
                    onClick={onCancel}
                    type="button"
                    style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px',
                        background: 'rgba(239, 68, 68, 0.8)', border: 'none', borderRadius: 10,
                        color: '#fff', fontSize: 11, fontWeight: 900,
                        textTransform: 'uppercase', cursor: 'pointer',
                        letterSpacing: '0.05em',
                    }}
                >
                    <XCircle size={14} /> Cancelar
                </button>
            </div>
        </div>
    );
};

// ========== MAIN COMPONENT ==========
const ImageEditorModal = ({
    isOpen,
    onClose,
    imageSrc,
    onSave,
    imageName = 'edited-image.webp',
    allImages = [],
    onIndexChange
}) => {
    const [image, setImage] = useState(null);
    const [pixelImage, setPixelImage] = useState(null);
    const [blurImage, setBlurImage] = useState(null);
    const [lines, setLines] = useState([]);
    const [sessionHistory, setSessionHistory] = useState({});
    const [tool, setTool] = useState(TOOLS.PIXEL);
    const [brushSize, setBrushSize] = useState(40);

    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const isDrawing = useRef(false);
    const stageRef = useRef(null);
    const stageContainerRef = useRef(null);
    const [dim, setDim] = useState({ width: 0, height: 0 });
    const [loading, setLoading] = useState(true);
    const [isSavingBulk, setIsSavingBulk] = useState(false);

    // Cropping
    const [isCropping, setIsCropping] = useState(false);
    const cropHistoryRef = useRef({});
    const workingImagesRef = useRef({});

    // Image strip
    const stripRef = useRef(null);

    // FIX: Ensure allImages is never empty for core logic
    const effectiveAllImages = useMemo(() => {
        if (allImages && allImages.length > 0) return allImages;
        return [{ src: imageSrc, name: imageName }];
    }, [allImages, imageSrc, imageName]);

    const currentIndex = effectiveAllImages.findIndex(img => img.src === imageSrc);

    // ========== LOAD IMAGE ==========
    useEffect(() => {
        if (!isOpen || !imageSrc) return;
        setLoading(true);
        setIsCropping(false);

        const savedLines = sessionHistory[currentIndex] || [];
        setLines(savedLines);
        setScale(1);
        setPosition({ x: 0, y: 0 });

        const srcToLoad = workingImagesRef.current[currentIndex] || imageSrc;

        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.src = srcToLoad;
        img.onload = async () => {
            setImage(img);
            const d = calcDim(img.width, img.height);
            setDim(d);
            const { pixelImg, blurImg } = await generateEffectImages(img);
            setPixelImage(pixelImg);
            setBlurImage(blurImg);
            setLoading(false);
        };
    }, [isOpen, imageSrc, currentIndex]);

    // ========== CROP TOOL ACTIVATION ==========
    useEffect(() => {
        if (tool === TOOLS.CROP) {
            setScale(1);
            setPosition({ x: 0, y: 0 });
            setIsCropping(true);
        }
    }, [tool]);

    // ========== KEYBOARD NAVIGATION ==========
    useEffect(() => {
        if (!isOpen || effectiveAllImages.length <= 1) return;

        const handleKeyDown = (e) => {
            if (isSavingBulk || isCropping) return;
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handleSwitchImage((currentIndex - 1 + effectiveAllImages.length) % effectiveAllImages.length);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleSwitchImage((currentIndex + 1) % effectiveAllImages.length);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, allImages.length, currentIndex, isSavingBulk, isCropping, lines]);

    // ========== AUTO-SCROLL IMAGE STRIP ==========
    useEffect(() => {
        if (stripRef.current && effectiveAllImages.length > 1) {
            const activeBtn = stripRef.current.querySelector(`[data-idx="${currentIndex}"]`);
            if (activeBtn) {
                activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [currentIndex, effectiveAllImages.length]);

    // ========== IMAGE SWITCHING ==========
    const handleSwitchImage = useCallback((index) => {
        if (index === currentIndex) return;
        setSessionHistory(prev => ({ ...prev, [currentIndex]: lines }));
        if (onIndexChange) onIndexChange(index);
    }, [currentIndex, lines, onIndexChange]);

    // ========== DRAWING ==========
    const handleMouseDown = (e) => {
        if (tool === TOOLS.SELECT || tool === TOOLS.CROP || isSavingBulk) return;
        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
        if (!pos) return;
        const transform = stage.getAbsoluteTransform().copy().invert();
        const pt = transform.point(pos);
        isDrawing.current = true;
        setLines(prev => [...prev, { tool, points: [pt.x, pt.y], strokeWidth: brushSize / scale }]);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing.current || tool === TOOLS.SELECT || tool === TOOLS.CROP || isSavingBulk) return;
        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
        if (!pos) return;
        const transform = stage.getAbsoluteTransform().copy().invert();
        const pt = transform.point(pos);
        setLines(prev => {
            const newLines = prev.slice();
            const last = newLines[newLines.length - 1];
            if (last) last.points = last.points.concat([pt.x, pt.y]);
            return newLines;
        });
    };

    const handleMouseUp = () => { isDrawing.current = false; };
    const handleUndo = () => setLines(prev => prev.slice(0, -1));
    const handleClear = () => { if (window.confirm('¿Borrar todas las ediciones?')) setLines([]); };

    // ========== CROP: APPLY (from HTML overlay) ==========
    const handleApplyCrop = useCallback((cropRect) => {
        if (!image) return;

        // Convert display coords to original image coords
        const scaleXR = image.width / dim.width;
        const scaleYR = image.height / dim.height;

        const srcX = Math.max(0, Math.round(cropRect.x * scaleXR));
        const srcY = Math.max(0, Math.round(cropRect.y * scaleYR));
        const srcW = Math.min(image.width - srcX, Math.round(cropRect.w * scaleXR));
        const srcH = Math.min(image.height - srcY, Math.round(cropRect.h * scaleYR));

        if (srcW <= 0 || srcH <= 0) { alert('Área de recorte inválida.'); return; }

        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = srcW;
        cropCanvas.height = srcH;
        const ctx = cropCanvas.getContext('2d');
        ctx.drawImage(image, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);

        const croppedDataUrl = cropCanvas.toDataURL('image/png');
        workingImagesRef.current[currentIndex] = croppedDataUrl;
        cropHistoryRef.current[currentIndex] = true;

        const croppedImg = new window.Image();
        croppedImg.src = croppedDataUrl;
        croppedImg.onload = async () => {
            setImage(croppedImg);
            const d = calcDim(croppedImg.width, croppedImg.height);
            setDim(d);
            const { pixelImg, blurImg } = await generateEffectImages(croppedImg);
            setPixelImage(pixelImg);
            setBlurImage(blurImg);
            setLines([]);
            setSessionHistory(prev => ({ ...prev, [currentIndex]: [] }));
            setIsCropping(false);
            setTool(TOOLS.PIXEL);
            setScale(1);
            setPosition({ x: 0, y: 0 });
        };
    }, [image, dim, currentIndex]);

    const handleCancelCrop = () => {
        setIsCropping(false);
        setTool(TOOLS.PIXEL);
    };

    // ========== BULK SAVE ==========
    const handleSaveBulk = async () => {
        if (!stageRef.current) return;

        const finalSession = { ...sessionHistory, [currentIndex]: lines };

        const editedIndices = new Set();
        Object.keys(finalSession).forEach(idx => {
            if (finalSession[idx] && finalSession[idx].length > 0) editedIndices.add(Number(idx));
        });
        Object.keys(cropHistoryRef.current).forEach(idx => editedIndices.add(Number(idx)));

        if (editedIndices.size === 0) { onClose(); return; }

        setIsSavingBulk(true);
        const results = [];

        try {
            for (const idx of editedIndices) {
                const imgData = effectiveAllImages[idx];
                if (!imgData) continue;

                const srcToLoad = workingImagesRef.current[idx] || imgData.src;
                const sourceImg = new window.Image();
                sourceImg.crossOrigin = 'Anonymous';
                sourceImg.src = srcToLoad;
                await new Promise((resolve, reject) => {
                    sourceImg.onload = resolve;
                    sourceImg.onerror = () => reject(new Error(`Error al cargar: ${imgData.name}`));
                });

                const { pixelImg, blurImg } = await generateEffectImages(sourceImg);
                const d = calcDim(sourceImg.width, sourceImg.height);

                setImage(sourceImg);
                setPixelImage(pixelImg);
                setBlurImage(blurImg);
                setDim(d);
                setLines(finalSession[idx] || []);
                setScale(1);
                setPosition({ x: 0, y: 0 });
                setIsCropping(false);

                await new Promise(r => setTimeout(r, 150));

                const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 });
                const response = await fetch(dataUrl);
                const blob = await response.blob();
                const finalName = imgData.name.toLowerCase().endsWith('.webp') ? imgData.name : imgData.name.split('.')[0] + '.webp';
                const file = new File([blob], finalName, { type: 'image/webp' });
                results.push({ file, dataUrl, index: idx });
            }

            await onSave(results);
            onClose();
        } catch (err) {
            console.error("Bulk save error:", err);
            alert(`Error al guardar: ${err.message || 'Error desconocido'}`);
        } finally {
            setIsSavingBulk(false);
        }
    };

    if (!isOpen || !imageSrc) return null;

    const isCropped = !!cropHistoryRef.current[currentIndex];

    return (
        <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-3xl z-[100] flex flex-col p-2 sm:p-6 text-slate-200 select-none" onClick={e => e.stopPropagation()} tabIndex={-1}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6 bg-slate-900/40 p-5 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-2xl">
                <div className="flex items-center gap-5">
                    <div className="bg-brand-600 p-3 rounded-2xl shadow-xl shadow-brand-500/20">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-white font-black text-2xl tracking-tight leading-tight">Pincel Mágico Oasis</h2>
                            {effectiveAllImages.length > 1 && (
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                    <button onClick={() => handleSwitchImage((currentIndex - 1 + effectiveAllImages.length) % effectiveAllImages.length)} className="text-slate-400 hover:text-white transition p-1"><ChevronLeft size={16} /></button>
                                    <span className="text-[10px] font-black text-brand-400 min-w-[40px] text-center">{currentIndex + 1} / {effectiveAllImages.length}</span>
                                    <button onClick={() => handleSwitchImage((currentIndex + 1) % effectiveAllImages.length)} className="text-slate-400 hover:text-white transition p-1"><ChevronRight size={16} /></button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] uppercase font-black tracking-widest mt-1">
                            <span className="text-brand-400">Censura Premium</span>
                            <div className="w-1 h-1 rounded-full bg-slate-600" />
                            <span className="text-slate-500 truncate max-w-[200px]">{imageName}</span>
                            {isCropped && (<><div className="w-1 h-1 rounded-full bg-indigo-500" /><span className="text-indigo-400">Recortada</span></>)}
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

            {/* Main content */}
            <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
                {/* Left Toolbar */}
                <div className="flex md:flex-col gap-4 p-5 bg-slate-900/40 rounded-[3rem] border border-white/5 h-fit md:h-full backdrop-blur-md shadow-2xl">
                    {[
                        { id: TOOLS.SELECT, icon: MousePointer2, label: 'Mover' },
                        { id: TOOLS.PIXEL, icon: ShieldAlert, label: 'Pixelar' },
                        { id: TOOLS.BLUR, icon: BrushIcon, label: 'Difuminar' },
                        { id: TOOLS.ERASE, icon: Eraser, label: 'Borrador' },
                        { id: TOOLS.CROP, icon: Crop, label: 'Cortar' }
                    ].map(btn => (
                        <button key={btn.id} type="button" onClick={() => setTool(btn.id)} className={`p-6 rounded-[2rem] flex flex-col items-center gap-2 transition-all relative group ${tool === btn.id ? 'bg-brand-600 text-white shadow-2xl shadow-brand-500/30 scale-105' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}>
                            <btn.icon size={26} />
                            <span className="hidden md:block text-[9px] font-black uppercase tracking-[0.2em] mt-2 opacity-70 group-hover:opacity-100">{btn.label}</span>
                        </button>
                    ))}
                    <div className="hidden md:block flex-1" />
                    {tool !== TOOLS.CROP && (
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="relative h-48 w-10 flex items-center justify-center">
                                <input type="range" min="10" max="150" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value))} className="h-2 w-48 accent-brand-500 -rotate-90 cursor-grab active:cursor-grabbing" />
                            </div>
                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">{brushSize}px</span>
                        </div>
                    )}
                </div>

                {/* Center Canvas Area */}
                <div className="flex-1 bg-slate-900/10 rounded-[4rem] border border-white/5 relative overflow-hidden flex flex-col group shadow-2xl">
                    <div className="flex-1 flex items-center justify-center relative min-h-0">
                        {(loading || isSavingBulk) && (
                            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/50 backdrop-blur-sm gap-8">
                                <RefreshCw className="animate-spin text-brand-600" size={60} />
                                {isSavingBulk && <p className="text-white font-black animate-pulse uppercase tracking-[0.3em] text-xs">Guardando Lote...</p>}
                            </div>
                        )}

                        {/* Canvas + Crop overlay wrapper */}
                        <div ref={stageContainerRef} style={{ position: 'relative', width: dim.width, height: dim.height, display: loading || isSavingBulk ? 'none' : 'block' }}>
                            <Stage
                                width={dim.width} height={dim.height} ref={stageRef}
                                x={position.x} y={position.y} scaleX={scale} scaleY={scale}
                                draggable={tool === TOOLS.SELECT && !loading && !isSavingBulk}
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

                            {/* HTML Crop Overlay — sits ON TOP of the canvas */}
                            {isCropping && (
                                <CropOverlay
                                    containerWidth={dim.width}
                                    containerHeight={dim.height}
                                    onApply={handleApplyCrop}
                                    onCancel={handleCancelCrop}
                                />
                            )}
                        </div>

                        {/* Zoom controls — only when NOT cropping */}
                        {!isCropping && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 bg-slate-950/80 backdrop-blur-2xl rounded-3xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 z-[20]">
                                <button onClick={() => setScale(s => s * 1.25)} className="p-3 text-white hover:bg-white/10 rounded-2xl transition" type="button"><Plus size={20} /></button>
                                <span className="text-xs text-brand-400 font-black px-4 min-w-[70px] text-center tracking-widest">{Math.round(scale * 100)}%</span>
                                <button onClick={() => setScale(s => s / 1.25)} className="p-3 text-white hover:bg-white/10 rounded-2xl transition" type="button"><Minus size={20} /></button>
                                <div className="w-px h-10 bg-white/10 mx-2" />
                                <button onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }} className="p-3 text-white bg-brand-600 hover:bg-brand-500 rounded-2xl transition shadow-lg shadow-brand-500/20" type="button"><Maximize size={20} /></button>
                            </div>
                        )}
                    </div>

                    {/* Quick Image Switcher Strip */}
                    {effectiveAllImages.length > 1 && (
                        <div ref={stripRef} className="h-32 bg-slate-900/60 border-t border-white/5 p-4 flex gap-4 overflow-x-auto scrollbar-hide items-center px-8">
                            {effectiveAllImages.map((img, idx) => {
                                const isEdited = (idx === currentIndex && lines.length > 0) || (sessionHistory[idx] && sessionHistory[idx].length > 0) || !!cropHistoryRef.current[idx];
                                return (
                                    <button key={idx} data-idx={idx} onClick={() => handleSwitchImage(idx)} className={`relative h-20 aspect-square rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${currentIndex === idx ? 'border-brand-500 scale-110 shadow-lg shadow-brand-500/20 ring-4 ring-brand-500/10' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'}`}>
                                        <img src={workingImagesRef.current[idx] || img.src} alt={`preview ${idx}`} className="w-full h-full object-cover" />
                                        {isEdited && <div className="absolute top-1 right-1 w-3 h-3 bg-brand-500 rounded-full border-2 border-slate-950 shadow-lg" />}
                                        {currentIndex === idx && <div className="absolute inset-0 bg-brand-600/10 flex items-center justify-center"><Sparkles className="text-white" size={16} /></div>}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="md:w-80 flex flex-col gap-6 h-full">
                    <div className="flex-1 p-8 bg-slate-900/40 rounded-[3rem] border border-white/5 backdrop-blur-md shadow-2xl">
                        <h4 className="text-brand-400 font-black text-[10px] uppercase tracking-[0.4em] mb-10 flex items-center gap-3"><Sparkles size={16} /> GUÍA RÁPIDA</h4>
                        <div className="space-y-10">
                            {[
                                { t: 'Mover e Interacción', d: 'Activa "Mover" para desplazarte por la imagen.', c: 'bg-blue-500' },
                                { t: 'Pincel Mágico', d: 'Pixelar o Difuminar para proteger rostros.', c: 'bg-brand-500' },
                                { t: 'Borrador', d: 'Limpia trazos accidentales.', c: 'bg-red-500' },
                                { t: 'Recorte', d: 'Arrastra las anclas blancas para ajustar. Mueve el centro para reposicionar.', c: 'bg-indigo-500' },
                                { t: 'Atajos', d: '← → para cambiar de imagen rápidamente.', c: 'bg-emerald-500' }
                            ].map((item, i) => (
                                <div key={i} className="group cursor-default">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className={`w-3 h-3 rounded-full ${item.c} group-hover:scale-125 transition-transform`} />
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
                        disabled={isSavingBulk || isCropping}
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
