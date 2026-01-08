function LocationMap() {
  const lat = -33.5340911;
  const lon = -70.576598;
  const bbox = [-70.5773111, -33.5358894, -70.5757642, -33.5322452];
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.join(
    '%2C'
  )}&layer=mapnik&marker=${lat}%2C${lon}`;
  const linkUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`;

  return (
    <div className="location-map">
      <iframe
        title="Mapa AMILAB"
        src={mapUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <a href={linkUrl} target="_blank" rel="noreferrer">
        Ver mapa en OpenStreetMap
      </a>
    </div>
  );
}

export default LocationMap;
