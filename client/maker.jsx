const helper = require('./helper');
const React = require('react');
const ReactDOM = require('react-dom');

const handleDomo = (e) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#domoName').value;
  const age = e.target.querySelector('#domoAge').value;
  const type = e.target.querySelector('#domoType').value;

  if (!name || !age || !type){
    helper.handleError('All fields are required!');
    return false;
  }

  helper.sendPost(e.target.action, {name, age, type}, loadDomosFromServer);

  return false;
};

const DomoForm = (props) => {
  return (
    <form id="domoForm"
        onSubmit={handleDomo}
        name="domoForm"
        action="/maker"
        method="POST"
        className="domoForm"
    >
      <label htmlFor="name">Name: </label>
      <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
      <label htmlFor="age">Age: </label>
      <input id="domoAge" type="number" min="0" name="age"/>
      <label htmlFor="type">Type: </label>
      <select id="domoType" name="type" defaultValue="Normal">
        <option value="Normal">Normal</option>
        <option value="Fire">Fire</option>
        <option value="Water">Water</option>
        <option value="Electric">Electric</option>
        <option value="Grass">Grass</option>
        <option value="Ice">Ice</option>
        <option value="Fighting">Fighting</option>
        <option value="Poison">Poison</option>
      </select>
      <input className="makeDomoSubmit" type="submit" value="Make Domo"/>
      
    </form>
  )
};

const DomoList = (props) => {
  if (props.domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">No Domos yet</h3>
      </div>
    );
  }

  const handleDelete = async (id) => {
    const response = await fetch(`/deleteDomo/${id}`, { method: 'DELETE' });
    if (response.ok) {
      loadDomosFromServer();
    } else {
      console.error(`Failed to delete domo with id ${id}`);
    }
  };

  const DomoNodes = props.domos.map(domo => {
    return (
      <div key={domo._id} className="domo">
        <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace"/>
        <h3 className="domoName">Name: {domo.name}</h3>
        <h3 className="domoName">Type: {domo.type}</h3>
        <h3 className="domoAge">Age: {domo.age}</h3>
        <button onClick={() => handleDelete(domo._id)} className="deleteDomo">Delete</button>
      </div>
    );
  });

  return (
    <div className="domoList">
      {DomoNodes}
    </div>
  );
};

const loadDomosFromServer = async () => {
  const response = await fetch('/getDomos');
  const data = await response.json();
  ReactDOM.render(
    <DomoList domos={data.domos} />, 
    document.getElementById('domos')
  );
};

const init = () => {
  ReactDOM.render(
    <DomoForm />, 
    document.getElementById('makeDomo')
  );

  ReactDOM.render(
    <DomoList domos={[]} />, 
    document.getElementById('domos')
  );

  loadDomosFromServer();
}

window.onload = init;