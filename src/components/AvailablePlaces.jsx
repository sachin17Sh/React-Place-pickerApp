import Places from './Places.jsx';
import { useState, useEffect } from 'react';
import Error from './ErrorPage.jsx';
// import { sortPlacesByDistance } from "../loc.js"

export default function AvailablePlaces({ onSelectPlace }) {
  const [availablePlace, setAvailablePlaces] = useState([]);
  const [isFetching, setisFetching] = useState(false);
  const [error, setError] = useState()


  useEffect(() => {
    async function fetchPlaces() {
      setisFetching(true)

      try {
        const response = await fetch('http://localhost:3000/places');
        const resData = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }

        //fetching user current [positon]
        // navigator.geolocation.getCurrentPosition(() => {
        //   const sortedPlaces = sortPlacesByDistance(
        //     resData.places,
        //     position.coords.latitude,
        //     position.coords.longitude
        //   );
        //   setAvailablePlaces(sortedPlaces); 
        //   setisFetching(false);
        // });
        setAvailablePlaces(resData.places); 

      } catch (error) {
        setError({ message: error.message || "Could not fetch Data try again letter..." })
      }
      setisFetching(false);
    }
    fetchPlaces();
  }, [])

  if (error) {
    return <Error title="An error occured" message={error.message} />
  }
  return (
    <Places
      title="Available Places"
      places={availablePlace}
      isLoading={isFetching}
      loadingText="fetching the data...."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
