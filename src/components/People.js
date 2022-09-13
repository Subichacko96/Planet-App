import React, { useEffect ,useReducer} from "react";
import Spinner from 'react-bootstrap/Spinner';
import axios from "axios";
import "./styles/styles.css";



function checkSpecies(species) {
  return species.classification === "reptile";
}

const getPlanetData = (state,dispatch) => {
 
  axios
    .get("https://swapi.dev/api/species/")
    .then((res) => {
      
      const speciesValue = res.data.results;
     
      const reptiles = speciesValue.filter(checkSpecies);
      return reptiles;
    })
    .then(async(reptiles) => {
    const film= reptiles[0].films[0]
    const planet=reptiles[0].homeworld
   
     return await Promise.all([
      axios.get(film),
      axios.get(planet)
    ]);

    }).then(([film,planet])=>{ 
      dispatch({name: 'setData',
      payload: {
          film: film,
          planet:planet
      }})
      
    }).catch((err)=>{
      console.log(err,"errored")
    })
};
const listAllData = (state, action) => {
  
  switch (action.name){
      case "setData":
        
          const {film, planet} = action.payload;
          state.film=film.data;
          state.planet=planet.data;
          //Return the state
          return state;
      default:
          return state;
  }
}

function People() {
 
  const [state, dispatch] = useReducer(listAllData, {film:null,planet:null});
 
  useEffect(() => {
    
    getPlanetData(state, dispatch); 
    
  }, []);
 
  // if(state.planet===null){
   
  //   return( <>
  //     <Spinner animation="border" role="status">
  //     <span className="visually-hidden">Loading...</span>
  //   </Spinner>
  //     </>
  //     )  
  // }
  console.log(state,"state vale")
  return (
    <>
      <div class="container-fluid">
        <div id="projects" class=" sections container">
         
          <div class="row project">
            <div class="card w-100">
            <div class=""style={{backgroundColor:"#605b5b"}} >
            <h3 class="text-center"></h3>
          </div>
              <div class="card-body" style={{backgroundColor:"#605b5b"}}>
                <h5 class="card-title" style={{ color: "black" }}>
               
                </h5>
                <p class="card-text float-left"><span>Created Date: </span>
                {
                state.planet?state.planet.created.split('T')[0]:""
              }</p>
              <p class="card-text float-right"><span>Modified Date: </span>
                {
                state.planet?state.planet.edited.split('T')[0]:""
              }
                </p><br/>
               
                <p class="card-textone float-none"> <span>Planet Name :&nbsp;</span>{
                state.planet?state.planet.name:""
              }</p>
               <p class="card-texttwo"><span>Planet Climate :&nbsp;</span> {
                state.planet?state.planet.climate:""
              }</p>
              <p class="card-texttwo"><span>Planet Film :&nbsp;</span> {
                state.film?state.film.title:""
              }</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default People;
