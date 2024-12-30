import { BBox } from 'geojson';
import { MapRef } from 'react-map-gl';

export const getBbox = (map: MapRef): BBox => {
  const bounds = map.getBounds()?.toArray();
  if (bounds) {
    const bbox = bounds[0].concat(bounds[1]);
    return bbox as BBox;
  }
  return [0, 0, 0, 0];
};
