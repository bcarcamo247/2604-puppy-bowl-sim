// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2604-BRANDON"; 
const API = BASE + COHORT;

// === STATE ===
// this is an empty array to store all the puppies from API
let puppies = [];
// this is a variable where the puppies that are selected will be stored
let selectedPuppy;

const app = document.querySelector("#app");

// === Getting the puppies from the API ===
async function getPuppies() {
  try {
    // Go fetch the puppies data from the API
    // The puppies data in state will be updated
    //JSON will convert data from API into a Javascript object we can use
    // In this instance its converting the data of the puppies into an object 
    // we can use in our code
    // Rerender the page with updated puppies and if an error occurs 
    // print it in the console
    const response = await fetch(API + "/players/");
    const result = await response.json();
    puppies = result.data.players;
    
    render();
  } catch (error) {
    console.error(error);
  }
}
// === Get one puppy from the API ===
// This function contains a parameter of id, which is the id of the puppy selected.
async function getPuppy(id) {
  try {
    // The id allows us to fetch data of a specific puppy from the API.
    // The data of the selected puppy will be stored in the selectedPuppy variable.
    //Page is again rerendered so the details of the selected puppy can be displayed.
    const response = await fetch(API + "/players/" + id);
    const result = await response.json();
    selectedPuppy = result.data;
    
    render();
  } catch (error) {
    console.error(error);
  }
}
// === Add a new puppy to the API ===
// Parameter is puppy now, which is the new puppy that will be added to the API
async function addPuppy(puppy) {
  try {
    //Sending a new puppy object to the API with a POST request, 
    // which will add and save the new puppy to the API.
    // Javascript is now being converted into JSON text and is 
    // sending the puppy data in a format the API can understand.
    await fetch(API + "/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(puppy)
    });
    // Line 65 is giving the API time to allow puppy data to load before 
    // continuing with the rest of the code.

    await getPuppies();
  
  } catch (error) {
    console.error(error);
  }

}
// === Remove a puppy from the API by its id ===
async function removePuppy(id) {
  try {
    //Re fetch the puppies from the API to update the roster and display the changes.
    // With the id of the selected puppy send a Delete request to the API.
    // We will be able to remove a selected puppy from the API and the roster.
    await fetch(API + "/players/" + id, {
      method: "DELETE",
    });
    // After the pupppy is removed from API, line 83 is so that 
    // no puppy will be displayed.
    selectedPuppy = null;
    
    await getPuppies();
  }  catch (error) {
    console.error(error);
  }
  
}
// === Create one list item for each puppy ===
function PuppyListItem(puppy) {
  // Now that an li element is made, we can add the puppy's name and 
  // image to the li element.
  // An event listener is added to click on the puppy's name or image,
  // which will save that puppy as the selected puppy.
  // The re render will display the details of the selected puppy on the page.
  // Finally, return the li element.

  const $li = document.createElement("li");
  $li.innerHTML = `
    <img src="${puppy.imageUrl}" alt="${puppy.name}"
    width="20" />
    <a href="#">${puppy.name}</a>
  `;
  $li.addEventListener("click", () => {
    selectedPuppy = puppy;
    render();
  });
  return $li;
}
// === Create a list of all the puppies ===
function PuppyList() {
  // Now we create a ul element, once that is made .map will be used 
  // to loop through all the puppies.
  // Each puppy will be turned into a PuppyListItem component and now all the 
  // puppy list items will be added to the ul element. Then, we return the ul element.
  const $ul = document.createElement("ul");
  const $puppies = puppies.map(PuppyListItem);
  $ul.replaceChildren(...$puppies);
  return $ul;
}
// === Create section to display puppy details ===
function PuppyDetails() {
  // If no puppy is selected, a message will be displayed 
  // asking the user to select a puppy to learn more.
  if (!selectedPuppy) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a puppy to learn more.";
    return $p;
  }
  // If a puppy is selected, a section element will be made to 
  // display the details of the selected puppy.
  // the class name is "puppy" so that we can style the section with CSS.
  const $puppy = document.createElement("section");
  $puppy.classList.add("puppy");
  // All these details below are just the information of the puppy that is clicked.
  // Puppies with no team will be displayed as "Unassigned". A button is 
  // added to remove the selected puppy from the roster.
  $puppy.innerHTML = `
    <figure>
      <img alt="${selectedPuppy.name}" src="${selectedPuppy.imageUrl}" width="150" />
    </figure>
    <h3>${selectedPuppy.name} </h3>
    <p><span>ID:</span> ${selectedPuppy.id}</p>
    <p><span>Breed:</span> ${selectedPuppy.breed}</p>
    <p><span>Status:</span> ${selectedPuppy.status}</p>
    <p><span>Team:</span> ${selectedPuppy.team ? selectedPuppy.team.name : "Unassigned"}</p>
    <button>Remove from roster</button>
  `;
  // The eventListener to remove a selected puppy
  $puppy.querySelector("button").addEventListener("click", () => {
    removePuppy(selectedPuppy.id);
  });
// Finally, return the section element with the puppy details.
  return $puppy;
}
// This is the function to create a form to add a new puppy to 
// the roster and API.
function NewPuppyForm() {
  const $form = document.createElement("form");
  // These are the inputs created for the form, which will allow the user to 
  // input the name, breed, status, and image url of the new puppy.
  // Options for "bench" and "field" are given and the "invite puppy" button
  //  is added to submit the form.
  $form.innerHTML = `
    <label>
      Name
      <input name="name" required />
    </label>
    <label>
      Breed
      <input name="breed" required />
    </label>
    <label>
      Status
      <select name="status" required>
        <option value="bench">Bench</option>
        <option value="field">Field</option>
      </select>
    </label>
    <label>
      Image Url
      <input name="imageUrl" required />
    </label>
    <button>Invite puppy</button>
  `;
  // Important, because this stops the page from refreshing when the form is submitted.
  $form.addEventListener("submit", (event) => {
    event.preventDefault();
    // FormData is used to get the data from the form and store it in variables.
    // in other words take what we type in box and save it to what we named it in the form.
    const formData = new FormData($form);
    const name = formData.get("name");
    const breed = formData.get("breed");
    const status = formData.get ("status");
    const imageUrl = formData.get("imageUrl");
  // This is how we add a new puppy to the API roster.
  // Rerender the page new puppy appears and 
  // Return the form thats completed.
    puppies.push({ name, breed, status, imageUrl });
    render();
  });
  return $form;
}
// === Render the entire app ===
function render() {
  // Line 210 is where we select the app element from the HTML page to add all 
  // our elements in it.
  const $app = document.querySelector("#app");
   // This is the HTML structure of the page, which includes a 
  // header, and two sections.
  // The first section is the roster, which will display the 
  // list of puppies and the form to add a new puppy.
  // The second section is the puppy details, which will
  //  display the details of a selected puppy.
  $app.innerHTML = `
    <h1>Puppy Bowl</h1>
    <main>
      <section>
        <h2>Roster</h2>
        <section id="roster"></section>
        <h3>Invite a puppy</h3>
        <section id="new-puppy-form"></section>
      </section>
      <section>
        <h2>Puppy Details</h2>
        <section id="puppy-details"></section>
      </section>
    </main>
  `;
  $app.querySelector("#roster").replaceWith(PuppyList());
  $app.querySelector("#new-puppy-form").replaceWith(NewPuppyForm());
  $app.querySelector("#puppy-details").replaceWith(PuppyDetails());
}
//Wait for data to load before rendering and this finally,
//starts the app by calling init function.
async function init() {
  await getPuppies();
  render();
}

init();
