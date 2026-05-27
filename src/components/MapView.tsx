import React, { useState, useEffect, useRef } from 'react';
import { 
  Map, 
  Search, 
  Building2, 
  MapPin, 
  Star, 
  DollarSign, 
  Compass, 
  ArrowRight,
  Info,
  Layers,
  ZoomIn,
  ZoomOut,
  X
} from 'lucide-react';
import { Company } from '../types';

interface MapViewProps {
  darkMode: boolean;
}

export default function MapView({ darkMode }: MapViewProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [searchProvince, setSearchProvince] = useState("");
  const [searchType, setSearchType] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedPin, setSelectedPin] = useState<Company | null>(null);

  useEffect(() => {
    async function loadMapData() {
      try {
        const [compRes, studRes] = await Promise.all([
          fetch("/api/companies?status=Active"),
          fetch("/api/students")
        ]);
        if (compRes.ok) {
          setCompanies(await compRes.json());
        }
        if (studRes.ok) {
          setStudents(await studRes.json());
        }
      } catch (err) {
        console.error("Failed to load map statistics:", err);
      }
    }
    loadMapData();
  }, []);

  const getInternCountForComp = (companyId: string) => {
    return students.filter(s => {
      const matchCompany = s.company_id === companyId;
      const matchYear = selectedYear === "" || s.internship_year === Number(selectedYear);
      return matchCompany && matchYear;
    }).length;
  };

  // Filter companies on map
  const activePins = companies.filter(c => {
    const matchProv = searchProvince === "" || c.province === searchProvince;
    const matchType = searchType === "" || c.business_type === searchType;
    return matchProv && matchType;
  });

  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);

  // Dynamically load Leaflet resources
  useEffect(() => {
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    // Load stylesheet
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
    link.crossOrigin = "";
    document.head.appendChild(link);

    // Load JS script
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // Cleanup map instance on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.error("Error removing map instance:", e);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update or initialize the map
  useEffect(() => {
    if (!leafletLoaded) return;
    const L = (window as any).L;
    if (!L) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current && mapContainerRef.current) {
      const defaultCenter = [13.22, 100.98]; // Centralized Thailand
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
      }).setView(defaultCenter, 6);

      const tileUrl = darkMode 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        attribution: '© OpenStreetMap, © CartoDB',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({
        position: 'bottomright'
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.featureGroup().addTo(map);
    } else if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      // Remove previous tiles to apply the theme
      map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      const tileUrl = darkMode 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        attribution: '© OpenStreetMap, © CartoDB',
        maxZoom: 19,
      }).addTo(map);
    }

    const markersGroup = markersGroupRef.current;
    if (markersGroup) {
      markersGroup.clearLayers();
    }

    // Draw active pins
    activePins.forEach((comp) => {
      if (!comp.latitude || !comp.longitude) return;

      let markerColor = "#EF4444"; // red
      if (comp.avg_rating >= 4.0) markerColor = "#10B981"; // emerald
      else if (comp.avg_rating >= 3.0) markerColor = "#F59E0B"; // amber

      const count = getInternCountForComp(comp.company_id);
      const idNum = comp.company_id.slice(-2);
      const isSelected = selectedPin?.company_id === comp.company_id;

      const ringPulseHtml = count > 0 ? `<span class="absolute -left-1.5 -top-1.5 inline-flex h-9 w-9 rounded-full animate-ping opacity-25" style="background-color: ${markerColor}"></span>` : "";
      const badgeHtml = count > 0 ? `<span class="absolute -top-3.5 -right-3.5 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-600 text-white shadow-md border border-white dark:border-slate-800 z-20">${count}</span>` : "";

      const customHtml = `
        <div class="relative flex items-center justify-center cursor-pointer" style="width: 24px; height: 24px;">
          ${ringPulseHtml}
          <div class="h-6 w-6 rounded-full flex items-center justify-center font-bold text-[8px] border text-white transition-all duration-300 shadow-md ${isSelected ? 'scale-125 border-blue-500 bg-blue-600 ring-4 ring-blue-500/30' : ''}"
               style="background-color: ${isSelected ? '#3B82F6' : markerColor}; border-color: ${isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.7)'}">
            <span>${idNum}</span>
          </div>
          ${badgeHtml}
        </div>
      `;

      const icon = L.divIcon({
        html: customHtml,
        className: "custom-leaflet-marker-icon",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([comp.latitude, comp.longitude], { icon })
        .on('click', () => {
          setSelectedPin(comp);
        });

      if (markersGroup) {
        markersGroup.addLayer(marker);
      }
    });

    // Fit bounds only if markers exist and the list isn't empty
    if (activePins.length > 0 && mapInstanceRef.current && markersGroup) {
      try {
        const bounds = markersGroup.getBounds();
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      } catch (e) {
        // Safe fallback
      }
    }
  }, [leafletLoaded, activePins, darkMode, selectedPin, selectedYear]);

  // Thailand Coordinates to Map Canvas Pixels Mapping Solver
  // Latitude bounds: 5.5 (South) to 20.6 (North)
  // Longitude bounds: 97.2 (West) to 105.8 (East)
  const mapCoords = (lat: number, lng: number) => {
    const latMin = 5.5;
    const latMax = 20.6;
    const lngMin = 97.2;
    const lngMax = 105.8;
    
    // Convert to percentage coordinates inside our SVG layout
    // In SVG, Outer height (y) is 0 at top (latMax) and 100 at bottom (latMin)
    const yPct = ((latMax - lat) / (latMax - latMin)) * 100;
    // Outer width (x) is 0 at left (lngMin) and 100 at right (lngMax)
    const xPct = ((lng - lngMin) / (lngMax - lngMin)) * 100;

    return { x: xPct, y: yPct };
  };

  const getMarkerColor = (rating: number) => {
    if (rating >= 4.0) return "bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/40 ring-emerald-500/20";
    if (rating >= 3.0) return "bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/40 ring-amber-500/20";
    return "bg-red-500 hover:bg-red-400 text-white shadow-red-500/40 ring-red-500/20";
  };

  const getMarkerDotColor = (rating: number) => {
    if (rating >= 4.0) return "bg-emerald-400";
    if (rating >= 3.0) return "bg-amber-400";
    return "bg-red-400";
  };

  const provinces = ["กรุงเทพมหานคร", "นนทบุรี", "ชลบุรี", "ระยอง", "เชียงใหม่", "ภูเก็ต", "ขอนแก่น", "นครราชสีมา", "ปทุมธานี", "สมุทรปราการ"];
  const businessTypes = ["IT", "Manufacturing", "Logistics", "Construction", "Service"];

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 flex flex-col min-h-0">
      
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-500/10 pb-5 shrink-0">
        <div>
          <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase font-mono">
            Module 5 : Map Visualization
          </span>
          <h1 className={`text-2xl md:text-3xl font-sans font-bold tracking-tight mt-1 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            ภูมิสารสนเทศแผนที่ฝึกงานทั่วประเทศ
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            ระบุตำแหน่งสถานประกอบการแบ่งเฉดสีตามระดับความพึงพอใจประเมินอย่างชัดเจน
          </p>
        </div>

        {/* Legend Panel */}
        <div className="flex gap-4 p-3 px-4 rounded-xl border text-[11px] font-sans font-semibold bg-slate-500/5 border-slate-500/10 shrink-0">
          <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> <span>Rating &gt; 4.0 (ดีมาก)</span></div>
          <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> <span>Rating 3.0-4.0 (ปานกลาง)</span></div>
          <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> <span>Rating &lt; 3.0 (ต้องปรับปรุง)</span></div>
        </div>
      </div>

      {/* Map Filter Controls Box */}
      <div className={`p-4 rounded-2xl border shrink-0 ${
        darkMode ? 'bg-[#1E2732] border-[#253341]' : 'bg-white border-slate-100 shadow-sm'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">ค้นหาหรือคลิกเลือกจังหวัดภูมิภาค</label>
            <select
              value={searchProvince}
              onChange={(e) => {
                setSearchProvince(e.target.value);
                setSelectedPin(null);
              }}
              className={`w-full py-2.5 px-3.5 text-xs font-semibold rounded-xl outline-none border focus:ring-2 focus:ring-blue-500/20 transition-all ${
                darkMode 
                  ? 'bg-[#15202B] border-[#253341] text-gray-300 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-150 text-slate-700 focus:border-blue-400 focus:bg-white'
              }`}
            >
              <option value="">ค้นหาจังหวัดหลักที่ต้องการ (ทั้งหมด)</option>
              {provinces.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">จำแนกประเภทกลุ่มอุตสาหกรรม</label>
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setSelectedPin(null);
              }}
              className={`w-full py-2.5 px-3.5 text-xs font-semibold rounded-xl outline-none border focus:ring-2 focus:ring-blue-500/20 transition-all ${
                darkMode 
                  ? 'bg-[#15202B] border-[#253341] text-gray-300 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-150 text-slate-700 focus:border-blue-400 focus:bg-white'
              }`}
            >
              <option value="">เลือกสายงานอุตสาหกรรม (ทั้งหมด)</option>
              {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">ปีศึกษาของนักศึกษาฝึกงาน (Dropdown)</label>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedPin(null);
              }}
              className={`w-full py-2.5 px-3.5 text-xs font-semibold rounded-xl outline-none border focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer ${
                darkMode 
                  ? 'bg-[#15202B] border-[#253341] text-gray-305 focus:border-blue-500' 
                  : 'bg-slate-50 border-slate-150 text-slate-700 focus:border-blue-400 focus:bg-white'
              }`}
            >
              <option value="">แสดงแผนที่ตามปีการศึกษา (ทั้งหมด)</option>
              <option value="2025">ปีการศึกษา 2025 (พ.ศ. 2568)</option>
              <option value="2026">ปีการศึกษา 2026 (พ.ศ. 2569)</option>
              <option value="2027">ปีการศึกษา 2027 (พ.ศ. 2570)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Map Working Screen Area Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-[480px]">
        
        {/* Geographic Plot Canvas (Left, 2 columns) */}
        <div className={`lg:col-span-2 rounded-2xl border relative overflow-hidden flex flex-col min-h-[480px] ${
          darkMode ? 'bg-[#15202B] border-[#253341]' : 'bg-slate-50 border-slate-150'
        }`}>
          <style dangerouslySetInnerHTML={{ __html: `
            .custom-leaflet-marker-icon {
              background: none !important;
              border: none !important;
            }
            .leaflet-container {
              font-family: inherit;
            }
            /* Styling Leaflet Controls to match dark mode theme beautifully */
            .dark .leaflet-bar a {
              background-color: #1E2732 !important;
              color: #94A3B8 !important;
              border-color: #253341 !important;
            }
            .dark .leaflet-bar a:hover {
              background-color: #253341 !important;
              color: #FFFFFF !important;
            }
            .leaflet-control-attribution {
              font-size: 9px !important;
              background-color: rgba(255,255,255,0.7) !important;
            }
            .dark .leaflet-control-attribution {
              background-color: rgba(30,39,50,0.85) !important;
              color: #94A3B8 !important;
            }
            .dark .leaflet-control-attribution a {
              color: #3B82F6 !important;
            }
          `}} />

          {/* Compass Rose Accent (kept purely for subtle decoration) */}
          <div className="absolute top-4 left-4 p-2 opacity-15 pointer-events-none text-slate-500 z-[1000]">
            <Compass size={40} className="animate-spin-slow" />
          </div>

          {/* Quick Stats Over map */}
          <div className="absolute top-4 right-4 z-[1000] p-3 bg-slate-900/85 backdrop-blur-xs border border-slate-800/60 rounded-xl text-[10px] font-mono text-slate-300 shadow-md">
            <span>แสดงตําแหน่งสหกิจ: {activePins.length} แห่ง / นำเสนอด้วย GIS</span>
          </div>

          {/* OpenStreetMap Tile Layer Container */}
          <div className="flex-1 w-full h-full min-h-[460px] relative">
            {!leafletLoaded ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
                <span className="text-xs text-slate-400 font-mono">กำลังเชื่อมโยงข้อมูลโครงข่ายแผนที่ OpenStreetMap...</span>
              </div>
            ) : (
              <div ref={mapContainerRef} className="w-full h-full min-h-[460px] relative z-1" />
            )}
          </div>
        </div>

        {/* Selected Location Card Display (Right side panel, 1 column) */}
        <div className="col-span-1 space-y-4">
          {selectedPin ? (
            <div className={`p-6 rounded-2xl border text-left flex flex-col h-full bg-white transition-all ${
              darkMode ? 'bg-[#1E2732] border-blue-500/20' : 'border-slate-150 shadow-md'
            }`}>
              
              <div className="flex justify-between items-start border-b border-slate-500/5 pb-4">
                <div className="min-w-0">
                  <span className="text-[10px] tracking-wider uppercase font-bold text-indigo-400 font-mono">
                    พิกัดสถานประกอบการ
                  </span>
                  <h3 className={`font-sans font-black text-base truncate mt-1 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    {selectedPin.company_name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 font-mono">ID: {selectedPin.company_id} | {selectedPin.business_type}</p>
                </div>
                <button 
                  onClick={() => setSelectedPin(null)}
                  className="p-1 hover:bg-slate-500/10 rounded-full text-slate-400 cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Attributes Details summary */}
              <div className="mt-5 space-y-4 flex-1 text-xs text-slate-400">
                <p className="flex items-start gap-2">
                  <MapPin size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <span className={darkMode ? 'text-slate-200' : 'text-slate-700'}>{selectedPin.address}</span>
                </p>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-500/5">
                  <div>
                    <span className="block text-[10px] uppercase font-mono">เรตติ้งประเมินผล</span>
                    <strong className="text-amber-500 text-sm font-mono mt-0.5 block flex items-center gap-0.5">
                      ⭐ {selectedPin.avg_rating} ดาว
                    </strong>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-mono">ค่าเบี้ยเลี้ยงรายวัน</span>
                    <strong className="text-emerald-500 text-sm font-mono mt-0.5 block">
                      {selectedPin.allowance > 0 ? `฿${selectedPin.allowance}/วัน` : 'ไม่มีค่าเป้าหลัก'}
                    </strong>
                  </div>
                </div>

                <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex items-center justify-between text-xs transition-colors">
                  <div>
                    <span className="block text-[9px] uppercase font-mono text-slate-400">จํานวนนิสิตฝึกงาน</span>
                    <span className="text-[10px] font-bold text-blue-500 block">
                      ปีการศึกษา {selectedYear || "ทั้งหมด"}
                    </span>
                  </div>
                  <div className="text-right">
                    <strong className="text-base font-black font-mono text-blue-500">
                      {getInternCountForComp(selectedPin.company_id)}
                    </strong>
                    <span className="text-[10px] text-slate-400 ml-1">คน</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-500/5">
                  <span className="block text-[10px] uppercase font-mono">ตําแหน่งงานเปิดรับวิชาสหกิจ</span>
                  <p className={`font-semibold ${darkMode ? 'text-slate-150' : 'text-slate-850'}`}>{selectedPin.available_positions}</p>
                </div>

                <div className="pt-3 border-t border-slate-500/5 space-y-1.5 text-[11px]">
                  <span className="block text-[10px] uppercase font-mono mb-1">พิกัดทางภูมิศาสตร์</span>
                  <p className="font-mono">Latitude: <strong className="text-[#3B82F6]">{selectedPin.latitude}</strong></p>
                  <p className="font-mono">Longitude: <strong className="text-[#3B82F6]">{selectedPin.longitude}</strong></p>
                </div>

              </div>

              {/* Action row */}
              <div className="pt-5 border-t border-slate-500/5 text-right mt-auto">
                <div className={`p-3 rounded-xl text-[11px] leading-relaxed flex gap-2 ${
                  darkMode ? 'bg-[#15202B] text-slate-400' : 'bg-slate-50 text-slate-650'
                }`}>
                  <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>ตำแหน่งพิกัดวิเคราะห์ประมวลด้วยระบบ GIS บนเทคโนโลยีแผนที่สาธารณะ OpenStreetMap และ CartoDB นำเสนอข้อมูลตำแหน่งและความพึงพอใจอย่างเรียลไทม์</span>
                </div>
              </div>

            </div>
          ) : (
            <div className={`p-8 text-center border rounded-2xl border-dashed h-full flex flex-col justify-center items-center ${
              darkMode ? 'border-slate-800 text-slate-500' : 'border-slate-150 text-slate-400'
            }`}>
              <Compass size={36} className="mb-2.5 text-slate-450 shrink-0" />
              <p className="text-xs font-bold">รอการเลือกจุดประสานพิกัด</p>
              <p className="text-[11px] mt-1 max-w-[200px] text-center mx-auto leading-relaxed">
                คลิกเลือกที่จุด Pin หมายเลขคลาวด์บริษัทบนแผนที่เพื่อวิเคราะห์พิกัดสวัสดิการและเฉดสีคะแนน
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
