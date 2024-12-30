import { LocationState } from '../hooks/useLocation';
import { Marker } from 'react-map-gl';

const LocationInnerMarker = () => (
  <div className='w-[20px] h-[20px] bg-blue-500 rounded-full border-2 border-gray-50 drop-shadow-md' />
);

interface UserLocationMarkerProps {
  userLocation: LocationState;
}

const UserLocationMarker = ({ userLocation }: UserLocationMarkerProps) => {
  if (
    userLocation.loading ||
    userLocation.error ||
    !userLocation.latitude ||
    !userLocation.longitude
  ) {
    return null;
  }

  return (
    <Marker latitude={userLocation.latitude} longitude={userLocation.longitude}>
      <div className='pop-in'>
        <LocationInnerMarker />
      </div>
    </Marker>
  );

  return null;
};

export default UserLocationMarker;
