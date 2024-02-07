const playerContainer = document.getElementById("all-players-container");
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2308-ACC-ET-WEB-PT-A";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
  try {
    // const response = await fetch(`${BASE_URL}/${name}`);
    const response = await fetch(`${APIURL}/players`);
    const result = await response.json();
    // console.log(result)
    return result.data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

const addNewPlayer = async (playerObj) => {
  
  // const string1 = 'hello'
  // const string2 = 'monica';
  // const string3 = string1 + ' ' + string2; // hello monica // String Concatenation
  // const string4 = `${string1} + ${string2}` // hello monica // Template Literal;

  try {
    const newPlayerResponse = await fetch(`${APIURL}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }, 
      body: JSON.stringify(playerObj)
    }
  );
    const result = await newPlayerResponse.json();
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(
      // https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players/${WHATEVER THE PLAYER ID ENDS UP BEING}
        `${APIURL}/players/${playerId}`,
        {
          method: 'DELETE',
        }
      );xs
      const result = await response.json();
      console.log(result);
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
  try {
    const template = playerList
      .forEach(({id, name, breed, status, imageUrl, teamId, cohortId}) => {
        //SINGLE PUPPY CONTAINER
        const puppyContainer = document.createElement('div');
        puppyContainer.innerHTML =`
        <section>
          <img src="${imageUrl}"/>
          <p>${imageUrl} currentUrl passed from API</p>
            <h2>id: ${id}</h2>
            <h2>name: ${name}</h2>
            <h2>breed: ${breed}</h2>
            <h2>status: ${status}</h2>
            <h2>teamId: ${teamId}</h2>
            <h2>cohortId: ${cohortId}</h2>
            </section>`;
            //ALL PLAYERS
            playerContainer.append(puppyContainer);
            const deleteButton = document.createElement('button');
            //DELETE BUTTON FOR SPECIFIC PUPPY 
            deleteButton.textContent = 'DELETE'
            //ADD CALLBACK TO DELETE BUTTON AND PASS IN ID SOMEHOW
            deleteButton.addEventListener('click', () => {
            //   console.log({name, id, status})
            removePlayer(id)
            })
            puppyContainer.append(deleteButton)
      })


      // .join("");
    // playerContainer.innerHTML = template;
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    //USING JS TO CREATE A FORM
    const formElement = document.createElement('form');
const formTemplate = `
<label>name</label>
<input name="name"/>
<label>breed</label>
<input name="breed"/>
<label>imgurl</label>
<input name="imgurl"/>
<label for="status"> Select a Status:</label>
<select name="status">
<option value="">SELECT STATUS</option>
<option value="field">field</option>
<option value="bench">bench</option>
</select>
<button type="submit"> SUBMIT </button
`
//SETTING INNER HTML TO OUR TEMPLATE
formElement.innerHTML = formTemplate;
//ADDING EVENT LISTENER
formElement.addEventListener(('submit'), (event) => {
event.preventDefault();
const name = event.target.name.value;
const breed = event.target.breed.value;
const status = event.target.status.value;
const imgUrl = event.target.imgurl.value;
addNewPlayer({name,breed,status, imgUrl: imgUrl});

})

//THIS IS THE DIV CONTAINING THE FORM
newPlayerFormContainer.append(formElement)
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

const init = async () => {
  const players = await fetchAllPlayers();
  console.log(players);
  renderAllPlayers(players);

  renderNewPlayerForm();
};

init();
