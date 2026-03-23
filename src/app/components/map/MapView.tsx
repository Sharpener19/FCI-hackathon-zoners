import { useEffect, useRef, useState } from 'react';
import type { Parcel } from '../../data/waterlooGuelphData';
import { zoneRegulations } from '../../data/waterlooGuelphData';
import type { Filters } from '../../pages/Homepage';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '../ui/button';

interface MapViewProps {
  parcels: Parcel[];
  selectedParcel: Parcel | null;
  onParcelClick: (parcel: Parcel) => void;
  filters: Filters;
}

export function MapView({ parcels, selectedParcel, onParcelClick, filters }: MapViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [baseTransform, setBaseTransform] = useState({ scale: 1, offsetX: 0, offsetY: 0, minX: 0, minY: 0 });

  const getZoneColor = (parcel: Parcel) => {
    const zone = zoneRegulations.find(z => 
      z.municipalityId === parcel.municipalityId && z.zoneCode === parcel.zoneCode
    );
    if (!zone) return '#94a3b8';

    switch (zone.restrictiveness) {
      case 'Very High': return '#ffdaff';
      case 'High': return '#e388e1';
      case 'Medium': return '#9b2cb7';
      case 'Low': return '#640877';
      default: return '#c8c8c8';
    }
  };

  // Resize canvas to match container
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw municipality label
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(filters.municipality.toUpperCase(), canvas.width / 2, 35);
    ctx.textAlign = 'left'; // Reset text alignment

    // Calculate bounding box of all parcels to center them
    if (parcels.length > 0) {
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      
      parcels.forEach(parcel => {
        parcel.coordinates.forEach(coord => {
          minX = Math.min(minX, coord.x);
          maxX = Math.max(maxX, coord.x);
          minY = Math.min(minY, coord.y);
          maxY = Math.max(maxY, coord.y);
        });
      });

      const parcelWidth = maxX - minX;
      const parcelHeight = maxY - minY;
      
      const availableWidth = canvas.width - 40;
      const availableHeight = canvas.height - 90;
      
      const scaleX = availableWidth / parcelWidth;
      const scaleY = availableHeight / parcelHeight;
      const baseScale = Math.min(scaleX, scaleY);
      
      const scaledWidth = parcelWidth * baseScale;
      const baseOffsetX = (canvas.width - scaledWidth) / 2;
      const baseOffsetY = 60;

      // Store base transform for reset
      setBaseTransform({ scale: baseScale, offsetX: baseOffsetX, offsetY: baseOffsetY, minX, minY });

      // Apply zoom and pan
      const scale = baseScale * zoom;
      const offsetX = baseOffsetX + pan.x;
      const offsetY = baseOffsetY + pan.y;

      // Draw parcels with scale and offset
      parcels.forEach(parcel => {
        const color = getZoneColor(parcel);
        const isSelected = selectedParcel?.id === parcel.id;

        // Fill parcel
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        const firstX = (parcel.coordinates[0].x - minX) * scale + offsetX;
        const firstY = (parcel.coordinates[0].y - minY) * scale + offsetY;
        ctx.moveTo(firstX, firstY);
        parcel.coordinates.forEach(coord => {
          const x = (coord.x - minX) * scale + offsetX;
          const y = (coord.y - minY) * scale + offsetY;
          ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fill();

        // Draw border
        ctx.globalAlpha = 1;
        ctx.strokeStyle = isSelected ? '#1e293b' : '#64748b';
        ctx.lineWidth = isSelected ? 3 : 1;
        ctx.stroke();

        // Draw parcel label
        const centerX = parcel.coordinates.reduce((sum, c) => sum + (c.x - minX) * scale, 0) / parcel.coordinates.length + offsetX;
        const centerY = parcel.coordinates.reduce((sum, c) => sum + (c.y - minY) * scale, 0) / parcel.coordinates.length + offsetY;
        
        ctx.fillStyle = '#1e293b';
        ctx.font = `bold ${Math.max(11, Math.floor(14 * baseScale * zoom))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(parcel.zoneCode, centerX, centerY);
      });
    }

    ctx.globalAlpha = 1;
    ctx.textAlign = 'left'; // Reset text alignment
  }, [parcels, selectedParcel, filters.municipality, zoom, pan]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) return; // Don't select parcel if we were panning

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Use base transform
    const scale = baseTransform.scale * zoom;
    const offsetX = baseTransform.offsetX + pan.x;
    const offsetY = baseTransform.offsetY + pan.y;
    const minX = baseTransform.minX;
    const minY = baseTransform.minY;

    // Check which parcel was clicked
    for (const parcel of parcels) {
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      ctx.beginPath();
      const firstX = (parcel.coordinates[0].x - minX) * scale + offsetX;
      const firstY = (parcel.coordinates[0].y - minY) * scale + offsetY;
      ctx.moveTo(firstX, firstY);
      parcel.coordinates.forEach(coord => {
        const px = (coord.x - minX) * scale + offsetX;
        const py = (coord.y - minY) * scale + offsetY;
        ctx.lineTo(px, py);
      });
      ctx.closePath();

      if (ctx.isPointInPath(x, y)) {
        onParcelClick(parcel);
        return;
      }
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsPanning(true);
    setPanStart({ x: event.clientX - pan.x, y: event.clientY - pan.y });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPanning) return;
    setPan({
      x: event.clientX - panStart.x,
      y: event.clientY - panStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (event: React.WheelEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prevZoom => Math.max(0.5, Math.min(5, prevZoom * delta)));
  };

  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(5, prevZoom * 1.2));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(0.5, prevZoom / 1.2));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Determine the hint text based on what's being shown
  const getHintText = () => {
    if (filters.municipality === 'waterloo') {
      return 'Showing Waterloo parcels';
    } else if (filters.municipality === 'guelph') {
      return 'Showing Guelph parcels';
    }
    return '';
  };

  return (
    <div className="w-full h-full bg-slate-100 relative flex justify-center items-start overflow-auto">
      <canvas
        ref={canvasRef}
        width={700}
        height={400}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`max-w-full max-h-full w-auto h-auto ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ imageRendering: 'crisp-edges' }}
      />
      
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomIn}
          className="bg-white hover:bg-slate-100 shadow-lg"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleZoomOut}
          className="bg-white hover:bg-slate-100 shadow-lg"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleReset}
          className="bg-white hover:bg-slate-100 shadow-lg"
          title="Reset zoom and position"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-xs">
        <p className="font-medium text-slate-900 mb-1">Click on any parcel to view details</p>
        {/* <p className="text-slate-600">{getHintText()}</p> */}
        <p className="text-slate-600 mt-1">Colors indicate zoning restrictiveness</p>
        <p className="text-slate-600 mt-1">Scroll to zoom • Drag to pan</p>
      </div>
    </div>
  );
}