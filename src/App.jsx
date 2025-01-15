import { useRef, useState, useCallback, useEffect } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import Error from './components/ErrorPage.jsx';
import {updatedUserPlaces, fetchUserPlace} from "./http.js"

function App() {
  const selectedPlace = useRef();
  const [userPlaces, setUserPlaces] = useState([]);
  const [isFetching, setisFetching] = useState(false);
  const [error, setError] = useState()
  const [erroeUpdating, setErrorUpdating] = useState()
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(()=>{
    async function fetchPlace(){
      setisFetching(true);
      try {
        const userPlaces = await fetchUserPlace()
      setUserPlaces(userPlaces)
      } catch (error) {
        setError({message:error.message || "Failed to fetch user place"})
      }
      setisFetching(false);
    }

    fetchPlace();
  },[])

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });
    try {
      await updatedUserPlaces([selectedPlace, ...userPlaces])  // importing the updateduserplaces from http req
    } catch (error) {
      setUserPlaces(userPlaces); //setting to intial state
      setErrorUpdating({message: error.message || "Failed to update any place" })
    }
  }

  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try {
      await updatedUserPlaces(userPlaces.filter(place=> place.id !== selectedPlace.current.id))
      
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdating({message: error.message || "Failed to Delete place" });
    }
    
    setModalIsOpen(false);
  }, [userPlaces]);

  function handleError(){
    setErrorUpdating(null)
  }

  return (
    <>
    <Modal open={erroeUpdating} onClose={handleError}>
     { erroeUpdating && 
     (<Error
      title="An Error occured"
      message={erroeUpdating.message}
      onConfirm={handleError}
      />)}
    </Modal>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
      {error && <Error title="An Error occured" message={error.message}/>}

      { !error &&
       ( <Places
          title="I'd like to visit ..."
          fallbackText="Select the places you would like to visit below."
          places={userPlaces}
          onSelectPlace={handleStartRemovePlace}
          loadingText="Fetching your message...."
          isLoading={isFetching}
        />
        )};

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
