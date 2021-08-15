import React, {useEffect, useState} from 'react'
import { CssBaseline, Grid } from '@material-ui/core'
import Header from './components/Header/Header';
import { getPlacesData } from './api';
import List from './components/List/List';
import Map from './components/Map/Map';
function App() {

    const [places,setPlaces] = useState([]);
    const [childClicked, setChildClicked] = useState(null);

    const [filteredPlaces, setFilteredPlaces] = useState([]);

    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({});

    const [isLoading, setIsLoading] = useState(false);

    const [type, setType] = useState("restaurants");
    const [rating, setRating] = useState("");

    useEffect(() => {
      navigator.geolocation.getCurrentPosition(({ coords: {latitude, longitude} }) => {
        setCoordinates({lat: latitude, lng: longitude});
      })
    },[]);

    useEffect(() => {
      const filteredPlaces = places?.filter((place) => place.rating > rating)
      setFilteredPlaces(filteredPlaces);
    }, [places, rating])

    useEffect(() => {
      if(bounds.sw && bounds.ne) {
      setIsLoading(true);
      console.log(bounds);
      getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
        setFilteredPlaces([]);
        setIsLoading(false);
      })
      }
    },[bounds, type]);

    return (
      <>
        <CssBaseline />
        <Header/>
        <Grid container spacing={3} style={{ width: "100%" }}>
          <Grid item xs={12} md={4}>
            <List
              places={filteredPlaces?.length ? filteredPlaces : places}
              childClicked={childClicked}
              isLoading={isLoading}
              type={type}
              setType={setType}
              rating={rating}
              setRating={setRating}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Map
              coordinates={coordinates}
              setCoordinates={setCoordinates}
              setBounds={setBounds}
              places={filteredPlaces?.length ? filteredPlaces : places}
              setChildClicked={setChildClicked}
            />
          </Grid>
        </Grid>
      </>
    );
}

export default App

