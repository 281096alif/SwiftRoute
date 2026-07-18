import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLoaderData } from 'react-router';

// Custom "coverage" pin: a solid dot with a pulsing translucent ring, built as a
// divIcon (raw HTML) since Leaflet renders marker icons outside React's tree.
// Leaflet injects this markup directly into the DOM, so it can't pick up Tailwind
// classes applied via JSX — it needs actual CSS rules, which is why the small
// <style> block below (not Tailwind) defines .coverage-pin and its animation.
const coveragePin = L.divIcon({
  className: 'coverage-pin-wrapper',
  html: '<span class="coverage-pin"><span class="coverage-pin__ring"></span><span class="coverage-pin__dot"></span></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -14],
});

const BANGLADESH_CENTER = [23.685, 90.3563];
const DEFAULT_ZOOM = 7;
const DISTRICT_ZOOM = 10;
const UPAZILA_ZOOM = 12;
const COVERAGE_RADIUS_METERS = 6000;

// Inline styles for the parts Tailwind can't reach: the divIcon markup Leaflet
// renders outside React, the pulsing keyframe animation, and Leaflet's own
// popup chrome (which ships with its own class names we need to override).
const LEAFLET_OVERRIDE_STYLES = `
  .coverage-pin {
    position: relative;
    display: block;
    width: 22px;
    height: 22px;
  }
  .coverage-pin__dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 12px;
    margin: -6px 0 0 -6px;
    border-radius: 50%;
    background: #0e7c66;
    border: 2px solid #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
  }
  .coverage-pin__ring {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 12px;
    margin: -6px 0 0 -6px;
    border-radius: 50%;
    background: rgba(14, 124, 102, 0.55);
    animation: coverage-pulse 1.8s ease-out infinite;
  }
  @keyframes coverage-pulse {
    0% { transform: scale(1); opacity: 0.7; }
    100% { transform: scale(2.6); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .coverage-pin__ring { animation: none; opacity: 0.35; }
  }
  .leaflet-popup-content-wrapper { border-radius: 8px; }
  .leaflet-popup-content { font-size: 0.85rem; line-height: 1.4; }
`;

// MapContainer's center/zoom props only apply once, on first mount. This child
// component uses the useMap() hook to smoothly re-center the live map instance
// whenever the selected district/upazila (and therefore target position) changes.
function FlyToTarget({ position, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(position, zoom, { duration: 0.9 });
  }, [position, zoom, map]);
  return null;
}

const selectClasses =
  'w-full appearance-none rounded-lg border border-slate-200 bg-white bg-no-repeat px-3 py-2.5 pr-9 text-[0.95rem] text-slate-900 ' +
  'transition-colors enabled:hover:border-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 focus-visible:outline-offset-1 ' +
  'disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 cursor-pointer';

const selectBgStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%235b6572'/%3E%3C/svg%3E\")",
  backgroundPosition: 'right 0.85rem center',
};

const Coverage = () => {
  // The route loader already fetched bangladesh_geo_data.json before this
  // component rendered, so the data is available synchronously here — no
  // effect, no loading state, no cleanup/cancellation to manage.
  const geoData = useLoaderData();

  const [districtName, setDistrictName] = useState('');
  const [upazilaName, setUpazilaName] = useState('');

  const divisions = useMemo(() => geoData?.divisions ?? [], [geoData]);

  // Districts are unique by name across all of Bangladesh, so a simple name
  // lookup across divisions is enough to find the full selected district record.
  const selectedDistrict = useMemo(() => {
    for (const division of divisions) {
      const match = division.districts.find((d) => d.name === districtName);
      if (match) return { ...match, divisionName: division.name };
    }
    return null;
  }, [divisions, districtName]);

  const upazilas = selectedDistrict?.upazilas ?? [];

  const selectedUpazila = useMemo(
    () => upazilas.find((u) => u.name === upazilaName) ?? null,
    [upazilas, upazilaName]
  );

  const activeLocation = selectedUpazila || selectedDistrict;
  const targetPosition = activeLocation
    ? [activeLocation.latitude, activeLocation.longitude]
    : BANGLADESH_CENTER;
  const targetZoom = selectedUpazila ? UPAZILA_ZOOM : selectedDistrict ? DISTRICT_ZOOM : DEFAULT_ZOOM;

  const handleDistrictChange = (e) => {
    setDistrictName(e.target.value);
    setUpazilaName(''); // an upazila from the old district is no longer valid
  };

  const handleReset = () => {
    setDistrictName('');
    setUpazilaName('');
  };

  return (
    <div className="min-h-screen box-border bg-[#f7f8fa] p-8 text-[#17212b] [&_*]:box-border">
      <style>{LEAFLET_OVERRIDE_STYLES}</style>

      <header className="coverage-header">
        <h1 className="m-0 mb-1 text-[1.75rem] font-bold tracking-[-0.01em]">Coverage</h1>
        <p className="m-0 mb-6 text-slate-500">Select a district and upazila to locate it on the map.</p>
      </header>

      <div className="grid grid-cols-[300px_1fr] items-start gap-5 md:grid-cols-[300px_1fr] max-md:grid-cols-1">
        <aside className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(23,33,43,0.04)]">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="district-select" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              District (Zilla)
            </label>
            <select
              id="district-select"
              value={districtName}
              onChange={handleDistrictChange}
              className={selectClasses}
              style={selectBgStyle}
            >
              <option value="">Select a district</option>
              {divisions.map((division) => (
                <optgroup key={division.name} label={division.name}>
                  {division.districts.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="upazila-select" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Upazila (Upozilla)
            </label>
            <select
              id="upazila-select"
              value={upazilaName}
              onChange={(e) => setUpazilaName(e.target.value)}
              disabled={!selectedDistrict}
              className={selectClasses}
              style={selectBgStyle}
            >
              <option value="">
                {selectedDistrict ? 'Select an upazila' : 'Select a district first'}
              </option>
              {upazilas.map((u) => (
                <option key={u.name} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {activeLocation && (
            <div className="flex flex-col gap-1 rounded-lg border border-emerald-700/25 bg-emerald-700/10 p-3.5">
              <span className="text-[0.72rem] font-bold uppercase tracking-wider text-emerald-700">
                {selectedUpazila ? 'Upazila' : 'District'}
              </span>
              <strong className="text-[1.05rem]">{activeLocation.name}</strong>
              {selectedUpazila && (
                <span className="text-[0.82rem] text-slate-500">{selectedDistrict.name} District</span>
              )}
              <code className="font-mono text-[0.78rem] text-slate-500">
                {activeLocation.latitude.toFixed(4)}, {activeLocation.longitude.toFixed(4)}
              </code>
              <button
                type="button"
                onClick={handleReset}
                className="mt-1.5 self-start bg-transparent p-0 text-[0.8rem] font-semibold text-emerald-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-700 focus-visible:outline-offset-2"
              >
                Clear selection
              </button>
            </div>
          )}

          {geoData?.meta && (
            <p className="m-0 text-[0.78rem] text-slate-500">
              {geoData.meta.district_count} districts · {geoData.meta.upazila_count} upazilas mapped
            </p>
          )}
        </aside>

        <div className="h-[620px] overflow-hidden rounded-xl border border-slate-200 max-md:h-[420px]">
          <MapContainer
            center={BANGLADESH_CENTER}
            zoom={DEFAULT_ZOOM}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FlyToTarget position={targetPosition} zoom={targetZoom} />
            {activeLocation && (
              <>
                <Circle
                  center={targetPosition}
                  radius={COVERAGE_RADIUS_METERS}
                  pathOptions={{ color: '#0e7c66', fillColor: '#0e7c66', fillOpacity: 0.08, weight: 1 }}
                />
                <Marker position={targetPosition} icon={coveragePin}>
                  <Popup>
                    <strong>{activeLocation.name}</strong>
                    <br />
                    {selectedUpazila ? `${selectedDistrict.name} District` : 'District'}
                    <br />
                    {activeLocation.latitude.toFixed(5)}, {activeLocation.longitude.toFixed(5)}
                  </Popup>
                </Marker>
              </>
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Coverage;
