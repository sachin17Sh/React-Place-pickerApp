 //putting the data to backend

    export async function updatedUserPlaces(places) {
      const response = await fetch('http://localhost:3000/user-places', {
        method: 'PUT',
        body: JSON.stringify({places}),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const resData = await response.json();
      if (!response.ok) {
        throw new Error('Failed to update data..')
      }
      return resData.message
    }



    export async function fetchUserPlace(){
        const response = await fetch('http://localhost:3000/user-places')
        const resData = await response.json()
        if (!response.ok) {
            throw new Error('Failed to update data..')
          }
          return resData.places;
    }