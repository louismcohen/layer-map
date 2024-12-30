import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Business } from '../types';
import SearchBar from './SearchBar';
import { AnimatePresence } from 'motion/react';
import { useDebounce } from 'use-debounce';
import IconMarker from './IconMarker';
import {
  Map,
  MapRef,
  Marker,
  ViewState,
  ViewStateChangeEvent,
} from 'react-map-gl';
import { BBox } from 'geojson';
import useLocation, { LocationState } from '../hooks/useLocation';
import UserLocationMarker from './UserLocationMarker';
// import DebugOverlay from './DebugOverlay';
import LoadingOverlay from './LoadingOverlay';
import { useSearchFilterStore } from '../stores/searchFilterStore';
import { getBbox } from '../utils';
import { useSearchPlaces } from '../hooks/useSearchPlaces';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapStore } from '../stores/mapStore';

const INITIAL_VIEWSTATE: ViewState = {
  latitude: 34.04162072763611,
  longitude: -118.26326182991187,
  zoom: 13,
  bearing: 0,
  pitch: 0,
  padding: { top: 0, bottom: 0, left: 0, right: 0 },
};

// const OVERRIDE_USER_LOCATION = true;

interface MapOverlayProps {
  isFetching: boolean;
}

const MapOverlay = React.memo(({ isFetching }: MapOverlayProps) => {
  return (
    <>
      <AnimatePresence>{isFetching && <LoadingOverlay />}</AnimatePresence>
    </>
  );
});

const MapCenter = () => {
  const mapRef = useRef<MapRef>(null);
  // const userLocation = OVERRIDE_USER_LOCATION
  //   ? ({
  //       latitude: DEFAULT_CENTER.lat,
  //       longitude: DEFAULT_CENTER.lng,
  //       error: null,
  //       loading: false,
  //     } as LocationState)
  //   : useLocation();
  const userLocation: LocationState = {
    latitude: INITIAL_VIEWSTATE.latitude,
    longitude: INITIAL_VIEWSTATE.longitude,
    error: null,
    loading: false,
  };
  const userHasInteracted = useRef(false);
  const [bounds, setBounds] = useState<BBox>();
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEWSTATE);

  const { searchTerm, updateSearchInputFocused } = useSearchFilterStore();
  const { isFetching, refetch } = useSearchPlaces(searchTerm, viewState);
  const { layers } = useMapStore();

  // useEffect(() => {
  //   if (
  //     !userLocation.loading &&
  //     userLocation.latitude &&
  //     userLocation.longitude &&
  //     !userHasInteracted.current
  //   ) {
  //     if (mapRef.current) {
  //       const map = mapRef.current;
  //       map.flyTo({
  //         center: [userLocation.longitude, userLocation.latitude],
  //         zoom: INITIAL_VIEWSTATE.zoom,
  //         maxDuration: 1000,
  //       });
  //     }
  //   }
  // }, [userLocation]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // deselectBusiness();
        updateSearchInputFocused(false);
      } else if (e.metaKey && e.key === 'k') {
        updateSearchInputFocused(true);
      } else if (e.key === 'Enter') {
        if (searchTerm !== '') {
          refetch();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [debouncedBounds] = useDebounce(bounds, 300);
  const [debouncedZoom] = useDebounce(viewState.zoom, 300);

  // const deselectBusiness = () => setSelectedBusiness(undefined);

  const handleMarkerPress = useCallback((marker: Business) => {
    // setSelectedBusiness(marker);
  }, []);

  const handleMapPress = () => {
    // deselectBusiness();
    updateSearchInputFocused(false);
  };

  const handleMapInitialInteraction = () => {
    userHasInteracted.current = true;
  };

  const MapOverlayProps = {
    isFetching,
    // selectedBusiness,
    // message: 'Test alert',
  };

  const handleMapMoveEnd = (e: ViewStateChangeEvent) => {
    if (mapRef.current) {
      setViewState(e.viewState);
    }
  };

  const handleMapLoad = (m: MapEvent) => {
    if (mapRef.current) {
      setBounds(getBbox(mapRef.current));
    }
  };

  return (
    <>
      <div className='w-screen h-screen focus:outline-none outline-none'>
        <Map
          mapStyle='mapbox://styles/louiscohen/cm54miu4700j201qparty6veb'
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
          initialViewState={INITIAL_VIEWSTATE}
          ref={mapRef}
          onClick={handleMapPress}
          onMoveStart={handleMapInitialInteraction}
          onMoveEnd={handleMapMoveEnd}
          onLoad={handleMapLoad}
          style={{
            width: '100vw',
            height: '100vh',
            font: 'inherit',
          }}
        >
          {layers.map(
            (layer) =>
              layer.visible &&
              layer.places.map((place) => (
                <Marker
                  key={place.cid}
                  latitude={place.latitude}
                  longitude={place.longitude}
                  color={layer.color}
                />
              ))
          )}
          {/* <div className='absolute top-0 left-0 flex justify-center items-center p-4 border border-red-500 bg-gray-900/50'>
            <p className='text-white'>Test</p>
          </div> */}
          <SearchBar />
          <UserLocationMarker userLocation={userLocation} />
        </Map>
      </div>
      <SearchBar />

      {/* <MapOverlay {...MapOverlayProps} /> */}
      {/* <DebugOverlay title='User Location' message={userLocation.error} /> */}
    </>
  );
};

export default MapCenter;
