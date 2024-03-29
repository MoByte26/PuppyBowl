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

// const fetchSinglePlayer = async (playerId) => {
//   try {
//   } catch (err) {
//     console.error(`Oh no, trouble fetching player #${playerId}!`, err);
//   }
// };

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/players/${playerId}`);
    const result = await response.json();
    if (result.error) throw result.error;
    return result.data.player;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

const addNewPlayer = async (playerObj) => {
  try {
    const newPlayerResponse = await fetch(`${APIURL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj),
    });
    const result = await newPlayerResponse.json();
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

const removePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}/players/${playerId}`, {
      method: "DELETE",
    });
    const result = await response.json();
    if (result.error) throw result.error;
    return;
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
    const template = playerList.forEach(
      ({ id, name, breed, status, imageUrl, teamId, cohortId }) => {
        //SINGLE PUPPY CONTAINER
        const puppyContainer = document.createElement("div");

        async (event) => {
          event.preventDefault();
          renderAllPlayers(detailsButton);
          detailsButton.disabled = false;
        };
        let detailsButton = [
          ...document.getElementsByClassName("detail-button"),
        ];

        // detailButton.forEach((button) => {
        //   button.addEventListener("click", async () => {
        //     const players = await fetchAllPlayers(button.dataset.id);
        //     renderAllPlayers(players);
        //   });
        // });

        puppyContainer.innerHTML = `
        <div class="player">
          <button class="details-button" disabled="">See Details</button>
        </div>

        <section>
          <img src="${imageUrl}"/>
            <h2>id: ${id}</h2>
            <h2>name: ${name}</h2>
            <h2>breed: ${breed}</h2>
            <h2>status: ${status}</h2>
            <h2>teamId: ${teamId}</h2>
            <h2>cohortId: ${cohortId}</h2>
        </section>`;

        //ALL PLAYERS
        playerContainer.append(puppyContainer);
        const deleteButton = document.createElement("button");

        //DELETE BUTTON FOR SPECIFIC PUPPY
        deleteButton.textContent = "DELETE";

        puppyContainer.append(deleteButton);

        deleteButton.addEventListener("click", async () => {
          await removePlayer(id);
          const players = await fetchAllPlayers();
          renderAllPlayers(players);
        });
      }
    );
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
    const formElement = document.createElement("form");
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
`;
    //SETTING INNER HTML TO OUR TEMPLATE
    formElement.innerHTML = formTemplate;
    //ADDING EVENT LISTENER
    formElement.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = event.target.name.value;
      const breed = event.target.breed.value;
      const status = event.target.status.value;
      const imgUrl = event.target.imgurl.value;

      await addNewPlayer({ name, breed, status, imageUrl: imgUrl });
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
    });

    //THIS IS THE DIV CONTAINING THE FORM
    newPlayerFormContainer.append(formElement);
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
