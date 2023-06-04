## 2.d Altering data in server

When creating notes in our application, we would naturally want to store them in some backend server. The [json-server](https://github.com/typicode/json-server) package claims to be a so-called REST or RESTful API in its documentation:

[REST API textbook definition](https://en.wikipedia.org/wiki/Representational_state_transfer)

some of the [conventions](https://en.wikipedia.org/wiki/Representational_state_transfer#Applied_to_web_services) used by json-server and REST APIs in general. In particular, we will be taking a look at the conventional use of [routes](https://github.com/typicode/json-server#routes), aka URLs and HTTP request types, in REST.

### REST

In REST terminology, we refer to individual data objects, such as the notes in our application, as <i>resources</i>. Every resource has a unique address associated with it - its URL. According to a general convention used by json-server, we would be able to locate an individual note at the resource URL <i>notes/3</i>, where 3 is the id of the resource. The <i>notes</i> URL, on the other hand, would point to a resource collection containing all the notes.

Resources are fetched from the server with HTTP GET requests.

Creating a new resource for storing a note is done by making an HTTP POST request to the <i>notes</i> URL. The data for the new note resource is sent in the <i>body</i> of the request.

json-server requires all data to be sent in JSON format. What this means in practice is that the data must be a correctly formatted string and that the request must contain the <i>Content-Type</i> request header with the value <i>application/json</i>.

### Sending Data to the Server

Let's make the following changes to the event handler responsible for creating a new note:

```js
addNote = (event) => {
  event.preventDefault();
  const noteObject = {
    content: newNote,
    important: Math.random() > 0.5,
  };

  axios.post('http://localhost:3001/notes', noteObject).then((response) => {
    // highlight-start
    setNotes(notes.concat(response.data));
    setNewNote('');
    // highlight-end
  });
};
```

We create a new object for the note but omit the <i>id</i> property since it's better to let the server generate ids for our resources!

The object is sent using the axios <em>post</em> method. The registered event handler logs the response that is sent back from the server to the console.

When we try to create a new note, the following output pops up in the console:

> status:201,statusText:Create

The newly created note resource is stored in the value of the <i>data</i> property of the _response_ object.

Quite often it is useful to inspect HTTP requests in the <i>Network</i> tab of Chrome developer tools. We can use the inspector to check that the headers sent in the POST request are what we expected them to be.

Since the data we sent in the POST request was a JavaScript object, axios automatically knew to set the appropriate <i>application/json</i> value for the <i>Content-Type</i> header.

The tab <i>payload</i> can be used to check the request data.

Also the tab <i>response</i> is useful, it shows what was the data the server responded with.

Once the data returned by the server starts to have an effect on the behavior of our web applications, we are immediately faced with a whole new set of challenges arising from, for instance, the asynchronicity of communication. This necessitates new debugging strategies, console logging and other means of debugging become increasingly more important. We must also develop a sufficient understanding of the principles of both the JavaScript runtime and React components. Guessing won't be enough.

### Changing the Importance of Notes

Let's add a button to every note that can be used for toggling its importance.

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'make not important' : 'make important';

  return (
    <li>
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};
```

The <i>App</i> component defines an initial version of the <em>toggleImportanceOf</em> event handler function and passes it to every <i>Note</i> component:

```js
const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);

  // ...

  // highlight-start
  const toggleImportanceOf = (id) => {
    console.log('importance of ' + id + ' needs to be toggled'); //Java-like manner
  };
  // highlight-end

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} // highlight-line
          />
        ))}
      </ul>
      // ...
    </div>
  );
};
```

Notice how every note receives its own <i>unique</i> event handler function since the <i>id</i> of every note is unique.

The [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) syntax added in ES6 can be used to write similar strings in a much nicer way:

```js
console.log(`importance of ${id} needs to be toggled`);
```

Individual notes stored in the json-server backend can be modified in two different ways by making HTTP requests to the note's unique URL. We can either <i>replace</i> the entire note with an HTTP PUT request or only change some of the note's properties with an HTTP PATCH request.

The final form of the event handler function is the following:

```js
const toggleImportanceOf = (id) => {
  const url = `http://localhost:3001/notes/${id}`;
  const note = notes.find((n) => n.id === id);
  const changedNote = { ...note, important: !note.important };

  axios.put(url, changedNote).then((response) => {
    setNotes(notes.map((n) => (n.id !== id ? n : response.data)));
  });
};
```

The first line defines the unique URL for each note resource based on its id.

The array [find method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) is used to find the note we want to modify, and we then assign it to the _note_ variable.

After this, we create a <i>new object</i> that is an exact copy of the old note, apart from the important property that has the value flipped (from true to false or from false to true).

The code for creating the new object uses the [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)

In practice, <em>{ ...note }</em> creates a new object with copies of all the properties from the _note_ object. When we add properties inside the curly braces after the spread object, the <em>important</em> property gets the negation of its previous value in the original object.

There are a few things to point out. Why did we make a copy of the note object we wanted to modify when the following code also appears to work?

```js
const note = notes.find(n => n.id === id)
note.important = !note.important

axios.put(url, note).then(response => {
  // ...
```

This is not recommended because the variable <em>note</em> is a reference to an item in the <em>notes</em> array in the component's state, and as we recall we must [never mutate state directly](https://react.dev/learn/updating-objects-in-state#why-is-mutating-state-not-recommended-in-react) in React.

It's also worth noting that the new object _changedNote_ is only a so-called [shallow copy](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy), meaning that the values of the new object are the same as the values of the old object. If the values of the old object were objects themselves, then the copied values in the new object would reference the same objects that were in the old object.

The new note is then sent with a PUT request to the backend where it will replace the old object.

The callback function sets the component's <em>notes</em> state to a new array that contains all the items from the previous <em>notes</em> array, except for the old note which is replaced by the updated version of it returned by the server:

```js
axios.put(url, changedNote).then((response) => {
  setNotes(notes.map((note) => (note.id !== id ? note : response.data)));
});
```

The map method creates a new array by mapping every item from the old array into an item in the new array.

### Extracting Communication with the Backend into a Separate Module

The <i>App</i> component has become somewhat bloated after adding the code for communicating with the backend server. In the spirit of the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle), we deem it wise to extract this communication into its own module.
Let's create a <i>src/services</i> directory and add a file there called <i>notes.js</i>:

```js
import axios from 'axios';
const baseUrl = 'http://localhost:3001/notes';

const getAll = () => {
  return axios.get(baseUrl);
};

const create = (newObject) => {
  return axios.post(baseUrl, newObject);
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject);
};

export default { getAll, create, update };
```

The module returns an object that has three functions (<i>getAll</i>, <i>create</i>, and <i>update</i>) as its properties that deal with notes. The functions directly return the promises returned by the axios methods.

The <i>App</i> component:

```js
import noteService from './services/notes'; // highlight-line
```

The functions of the module can be used directly with the imported variable _noteService_ as follows:

```js
const App = () => {
  // ...

  useEffect(() => {
    // highlight-start
    noteService.getAll().then((response) => {
      setNotes(response.data);
    });
    // highlight-end
  }, []);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    // highlight-start
    noteService.update(id, changedNote).then((response) => {
      setNotes(notes.map((note) => (note.id !== id ? note : response.data)));
    });
    // highlight-end
  };

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    };

    // highlight-start
    noteService.create(noteObject).then((response) => {
      setNotes(notes.concat(response.data));
      setNewNote('');
    });
    // highlight-end
  };

  // ...
};

export default App;
```

We could take our implementation a step further. When the <i>App</i> component uses the functions, it receives an object that contains the entire response for the HTTP request:

```js
noteService.getAll().then((response) => {
  setNotes(response.data);
});
```

The module would be much nicer to use if, instead of the entire HTTP response, we would only get the response data.

```js
import axios from 'axios';
const baseUrl = 'http://localhost:3001/notes';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

export default { getAll, create, update };
```

We no longer return the promise returned by axios directly. Instead, we assign the promise to the <em>request</em> variable and call its <em>then</em> method:

```js
const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};
```

The last row in our function is simply a more compact expression of the same code as shown below:

```js
const getAll = () => {
  const request = axios.get(baseUrl);
  // highlight-start
  return request.then((response) => {
    return response.data;
  });
  // highlight-end
};
```

The modified <em>getAll</em> function still returns a promise, as the <em>then</em> method of a promise also [returns a promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then).

After defining the parameter of the <em>then</em> method to directly return <i>response.data</i>, we have gotten the <em>getAll</em> function to work like we wanted it to. When the HTTP request is successful, the promise returns the data sent back in the response from the backend.

We have to update the <i>App</i> component to work with the changes made to our module. We have to fix the callback functions given as parameters to the <em>noteService</em> object's methods so that they use the directly returned response data:

```js
const App = () => {
  // ...

  useEffect(() => {
    noteService
      .getAll()
      // highlight-start
      .then((initialNotes) => {
        setNotes(initialNotes);
        // highlight-end
      });
  }, []);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService
      .update(id, changedNote)
      // highlight-start
      .then((returnedNote) => {
        setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
        // highlight-end
      });
  };

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    };

    noteService
      .create(noteObject)
      // highlight-start
      .then((returnedNote) => {
        setNotes(notes.concat(returnedNote));
        // highlight-end
        setNewNote('');
      });
  };

  // ...
};
```

This is all quite complicated and attempting to explain it may just make it harder to understand. The internet is full of material discussing the topic, such as [this](https://javascript.info/promise-chaining) one.

The "Async and performance" book from the [You do not know JS](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed) book series [explains the topic](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md) well, but the explanation is many pages long.

Promises are central to modern JavaScript development and it is highly recommended to invest a reasonable amount of time into understanding them.

### Cleaner Syntax for Defining Object Literals

The module defining note-related services currently exports an object with the properties <i>getAll</i>, <i>create</i>, and <i>update</i> that are assigned to functions for handling notes.

In defining the object using this shorter notation, we make use of a [new feature](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Property_definitions) that was introduced to JavaScript through ES6, enabling a slightly more compact way of defining objects using variables.

```js
const name = 'Leevi',
  age = 0;
const person = { name, age };
```

it creates an object with a <i>name</i> property with the value <i>Leevi</i> and an <i>age</i> property with the value <i>0</i>.

### Promises and Errors

If our application allowed users to delete notes, we could end up in a situation where a user tries to change the importance of a note that has already been deleted from the system.

Let's simulate this situation by making the <em>getAll</em> function of the note service return a "hardcoded" note that does not actually exist on the backend server:

```js
const getAll = () => {
  const request = axios.get(baseUrl);
  const nonExisting = {
    id: 10000,
    content: 'This note is not saved to server',
    important: true,
  };
  return request.then((response) => response.data.concat(nonExisting));
};
```

When we try to change the importance of the hardcoded note, we see the following error message in the console. The error says that the backend server responded to our HTTP PUT request with a status code 404 <i>not found</i>.

The application should be able to handle these types of error situations gracefully. Users won't be able to tell that an error has occurred unless they happen to have their console open. The only way the error can be seen in the application is that clicking the button does not affect the note's importance.

a promise can be in one of three different states. When an HTTP request fails, the associated promise is <i>rejected</i>. Our current code does not handle this rejection in any way.

The rejection of a promise is [handled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) by providing the <em>then</em> method with a second callback function, which is called in the situation where the promise is rejected.

The more common way of adding a handler for rejected promises is to use the [catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) method.

In practice, the error handler for rejected promises is defined like this:

```js
axios
  .get('http://example.com/probably_will_fail')
  .then((response) => {
    console.log('success!');
  })
  .catch((error) => {
    console.log('fail');
  });
```

If the request fails, the event handler registered with the <em>catch</em> method gets called.

The <em>catch</em> method is often utilized by placing it deeper within the promise chain.

When our application makes an HTTP request, we are in fact creating a [promise chain](https://javascript.info/promise-chaining):

```js
axios
  .put(`${baseUrl}/${id}`, newObject)
  .then((response) => response.data)
  .then((changedNote) => {
    // ...
  });
```

The <em>catch</em> method can be used to define a handler function at the end of a promise chain, which is called once any promise in the chain throws an error and the promise becomes <i>rejected</i>.

```js
axios
  .put(`${baseUrl}/${id}`, newObject)
  .then((response) => response.data)
  .then((changedNote) => {
    // ...
  })
  .catch((error) => {
    console.log('fail');
  });
```

Let's use this feature and register an error handler in the <i>App</i> component:

```js
const toggleImportanceOf = (id) => {
  const note = notes.find((n) => n.id === id);
  const changedNote = { ...note, important: !note.important };

  noteService
    .update(id, changedNote)
    .then((returnedNote) => {
      setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
    })
    // highlight-start
    .catch((error) => {
      alert(`the note '${note.content}' was already deleted from server`);
      setNotes(notes.filter((n) => n.id !== id));
    });
  // highlight-end
};
```

The error message is displayed to the user with the trusty old [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) dialog popup, and the deleted note gets filtered out from the state.

Removing an already deleted note from the application's state is done with the array [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method, which returns a new array comprising only the items from the list for which the function that was passed as a parameter returns true for.

[window.confirm](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) method.
