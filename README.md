# Part2. Communicating with server

## a. Rendering a collection, modules

### Protip: Visual Studio Code snippets

'snippets': shortcuts for quickly generating commonly re-used portions of code

Instructions for creating snippets can be found [here](https://code.visualstudio.com/docs/editor/userdefinedsnippets#_creating-your-own-snippets).

Useful, ready-made snippets can also be found as VS Code plugins, in the [marketplace](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets).

The most important snippet is the one for the <em>console.log()</em> command, for example, <em>clog</em>. This can be created like so:

```js
{
  "console.log": {
    "prefix": "clog",
    "body": [
      "console.log('$1')",
    ],
    "description": "Log output to console"
  }
}
```

Debugging your code using _console.log()_ is so common that Visual Studio Code has that snippet built in. To use it, type _log_ and hit Tab to autocomplete. More fully featured _console.log()_ snippet extensions can be found in the [marketplace](https://marketplace.visualstudio.com/search?term=console.log&target=VSCode&category=All%20categories&sortBy=Relevance).

### JavaScript Arrays

From here on out, we will be using the functional programming operators of the JavaScript [array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), such as _find_, _filter_, and _map_ - all of the time.

If operating arrays with functional operators feels foreign to you, it is worth watching at least the first three parts of the YouTube video series [Functional Programming in JavaScript](https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84):

- [Higher-order functions](https://www.youtube.com/watch?v=BMUiFMZr7vk&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84)
- [Map](https://www.youtube.com/watch?v=bCqtb-Z5YGQ&list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84&index=2)
- [Reduce basics](https://www.youtube.com/watch?v=Wl98eZpkp-c&t=31s)

### Map

Understanding how the array method [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) works is crucial for the rest of the course.

> React uses the key attributes of objects in an array to determine how to update the view generated by a component when the component is re-rendered. More about this is in the [React documentation](https://react.dev/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key).

Let's pause for a moment and examine how _map_ works.

```js
const result = notes.map((note) => note.id);
console.log(result);
```

<i>[1, 2, 3]</i> will be printed to the console.
_map_ always creates a new array, the elements of which have been created from the elements of the original array by <i>mapping</i>: using the function given as a parameter to the _map_ method.

The function is

```js
(note) => note.id;
```

The function gets a note object as a parameter and returns the value of its id field.

### Anti-pattern: Array Indexes as Keys

This is, however, **not recommended** and can create undesired problems even if it seems to be working just fine.

Read more about this in [this article](https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318).

### Refactoring Modules

If we display a single note in its own component, the key attribute must now be defined for the Note components, and not for the li tags like before.

Common practice is to declare each component in its own file as an ES6-module.

In smaller applications, components are usually placed in a directory called components, which is in turn placed within the src directory. The convention is to name the file after the component.

```js
import App from './App';
```

imports the main component, the app module, and places it into the variable <i>App</i>.

```js
export default Note;
```

The last line of the module [exports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) the declared module, the variable <i>Note</i>.

## b.forms

```js
const addNote = (event) => {
  event.preventDefault();
  console.log('button clicked', event.target);
};
```

The <em>event</em> parameter is the [event](https://react.dev/learn/responding-to-events) that triggers the call to the event handler function:

The event handler immediately calls the <em>event.preventDefault()</em> method, which prevents the default action of submitting a form. The default action would, [among other things](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event), cause the page to reload.

The target of the event stored in _event.target_ in this case is the form that we have defined in our component.

### Controlled component

There are many ways to accomplish this; the first method we will take a look at is through the use of so-called [controlled components](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable).

When performing comparisons, it's therefore safer to exclusively use <em>val1 === val2</em>. You can read more about the topic [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness).

```js
import { useState } from 'react';
import Note from './components/Note';

const App = (props) => {
  const [notes, setNotes] = useState(props.notes);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(false);

  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
      id: notes.length + 1,
    };

    setNotes(notes.concat(noteObject));
    setNewNote('');
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important); //or note.important===true

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        <ul>
          {notesToShow.map((note) => (
            <Note key={note.id} note={note} />
          ))}
        </ul>
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
```

> JavaScript arrays have numerous suitable [methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).
> [how object equality works](https://www.joshbritz.co/posts/why-its-so-hard-to-check-object-equality/) in Javascript.

> warning with the [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) command

**Hint:** when you are forming strings that contain values from variables, it is recommended to use a [template string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals):

```js
`${newName} is already added to phonebook`;
```

in a more Java-like fashion by using the plus operator:

```js
newName + ' is already added to phonebook';
```

Using template strings is the more idiomatic option and the sign of a true JavaScript professional.

## c. Getting data from server

Let's use a tool meant to be used during software development called [JSON Server](https://github.com/typicode/json-server) to act as our server.

Create a file named <i>db.json</i> in the root directory of the previous <i>notes</i> project with the following content:

```json
{
  "notes": [
    {
      "id": 1,
      "content": "HTML is easy",
      "important": true
    },
    {
      "id": 2,
      "content": "Browser can execute only JavaScript",
      "important": false
    },
    {
      "id": 3,
      "content": "GET and POST are the most important methods of HTTP protocol",
      "important": true
    }
  ]
}
```

You can [install](https://github.com/typicode/json-server#getting-started) a JSON server globally on your machine using the command _npm install -g json-server_.

```js
json-server --port 3001 --watch db.json
```

However, a global installation is not necessary. From the root directory of your app, we can run the <i>json-server</i> using the command _npx_:

```js
npx json-server --port 3001 --watch db.json
```

Let's navigate to the address <http://localhost:3001/notes> in the browser. We can see that <i>json-server</i> serves the notes we previously wrote to the file in JSON format:

> NPX allows you to run and use packages without needing to locally or globally install them.

If your browser doesn't have a way to format the display of JSON-data, then install an appropriate plugin, e.g. [JSONVue](https://chrome.google.com/webstore/detail/jsonview/chklaanhfefbnpoihckbnefhakgolnmc) to make your life easier.

### The browser as a runtime environment

The code in the example was fetching the data using [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), otherwise known as an HTTP request made using an XHR object. This is a technique introduced in 1999, which every browser has supported for a good while now.

The use of XHR is no longer recommended, and browsers already widely support the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) method, which is based on so-called [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), instead of the event-driven model used by XHR.

As a reminder from part0 (which one should <i>remember to not use</i> without a pressing reason), data was fetched using XHR in the following way:

```js
const xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText);
    // handle the response that is saved in variable data
  }
};

xhttp.open('GET', '/data.json', true);
xhttp.send();
```

Right at the beginning, we register an <i>event handler</i> to the <em>xhttp</em> object representing the HTTP request, which will be called by the JavaScript runtime whenever the state of the <em>xhttp</em> object changes. If the change in state means that the response to the request has arrived, then the data is handled accordingly.

It is worth noting that the code in the event handler is defined before the request is sent to the server. Despite this, the code within the event handler will be executed at a later point in time. Therefore, the code does not execute synchronously "from top to bottom", but does so <i>asynchronously</i>. JavaScript calls the event handler that was registered for the request at some point.

In contrast, JavaScript engines, or runtime environments follow the [asynchronous model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop). In principle, this requires all [IO operations](https://en.wikipedia.org/wiki/Input/output) (with some exceptions) to be executed as non-blocking. This means that code execution continues immediately after calling an IO function, without waiting for it to return.

When an asynchronous operation is completed, or, more specifically, at some point after its completion, the JavaScript engine calls the event handlers registered to the operation.

Currently, JavaScript engines are <i>single-threaded</i>, which means that they cannot execute code in parallel. As a result, it is a requirement in practice to use a non-blocking model for executing IO operations. Otherwise, the browser would "freeze" during, for instance, the fetching of data from a server.

Another consequence of this single-threaded nature of JavaScript engines is that if some code execution takes up a lot of time, the browser will get stuck for the duration of the execution. If we added the following code at the top of our application:

```js
setTimeout(() => {
  console.log('loop..');
  let i = 0;
  while (i < 50000000000) {
    i++;
  }
  console.log('end');
}, 5000);
```

everything would work normally for 5 seconds. However, when the function defined as the parameter for <em>setTimeout</em> is run, the browser will be stuck for the duration of the execution of the long loop. Even the browser tab cannot be closed during the execution of the loop, at least not in Chrome.

For the browser to remain <i>responsive</i>, i.e., to be able to continuously react to user operations with sufficient speed, the code logic needs to be such that no single computation can take too long.

There is a host of additional material on the subject to be found on the internet. One particularly clear presentation of the topic is the keynote by Philip Roberts called [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

In today's browsers, it is possible to run parallelized code with the help of so-called [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). The event loop of an individual browser window is, however, still only handled by a [single thread](https://medium.com/techtrument/multithreading-javascript-46156179cf9a).

### npm

We could use the previously mentioned promise-based function [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) to pull the data from the server. Fetch is a great tool. It is standardized and supported by all modern browsers (excluding IE).

That being said, we will be using the [axios](https://github.com/axios/axios) library instead for communication between the browser and server. It functions like fetch but is somewhat more pleasant to use. Another good reason to use axios is our getting familiar with adding external libraries, so-called <i>npm packages</i>, to React projects.

Nowadays, practically all JavaScript projects are defined using the node package manager, aka [npm](https://docs.npmjs.com/getting-started/what-is-npm). The projects created using create-react-app also follow the npm format. A clear indicator that a project uses npm is the <i>package.json</i> file located at the root of the project.

At this point, the <i>dependencies</i> part is of most interest to us as it defines what <i>dependencies</i>, or external libraries, the project has.

```js
npm install axios
```

Let's make another addition. Install <i>json-server</i> as a development dependency (only used during development) by executing the command:

```js
npm install json-server --save-dev
```

and making a small addition to the <i>scripts</i> part of the <i>package.json</i> file:

```json
{
  // ...
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "server": "json-server -p3001 --watch db.json" // highlight-line
  }
}
```

We can now conveniently, without parameter definitions, start the json-server from the project root directory with the command:

```js
npm run server
```

There is a fine difference in the parameters. <i>axios</i> is installed as a runtime dependency of the application because the execution of the program requires the existence of the library. On the other hand, <i>json-server</i> was installed as a development dependency (_--save-dev_), since the program itself doesn't require it. It is used for assistance during software development. There will be more on different dependencies in the next part of the course.

### Axios and promises

json-server is assumed to be running on port 3001.

<i>index.js</i>:

```js
import axios from 'axios';

const promise = axios.get('http://localhost:3001/notes');
console.log(promise);

const promise2 = axios.get('http://localhost:3001/foobar');
console.log(promise2);
```

If you open <http://localhost:3000> in the browser, Axios' method _get_ returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).

> <i>A Promise is an object representing the eventual completion or failure of an asynchronous operation.</i>

In other words, a promise is an object that represents an asynchronous operation. A promise can have three distinct states:

1. The promise is <i>pending</i>: It means that the final value (one of the following two) is not available yet.
2. The promise is <i>fulfilled</i>: It means that the operation has been completed and the final value is available, which generally is a successful operation. This state is sometimes also called <i>resolved</i>.
3. The promise is <i>rejected</i>: It means that an error prevented the final value from being determined, which generally represents a failed operation.

The first promise in our example is <i>fulfilled</i>, representing a successful _axios.get('http://localhost:3001/notes')_ request. The second one, however, is <i>rejected</i>, and the console tells us the reason. It looks like we were trying to make an HTTP GET request to a non-existent address.

If, and when, we want to access the result of the operation represented by the promise, we must register an event handler to the promise. This is achieved using the method <em>then</em>:

```js
const promise = axios.get('http://localhost:3001/notes');

promise.then((response) => {
  console.log(response);
});
```

The JavaScript runtime environment calls the callback function registered by the <em>then</em> method providing it with a <em>response</em> object as a parameter. The <em>response</em> object contains all the essential data related to the response of an HTTP GET request, which would include the returned <i>data</i>, <i>status code</i>, and <i>headers</i>.

```js
axios.get('http://localhost:3001/notes').then((response) => {
  const notes = response.data;
  console.log(notes);
});
```

The data returned by the server is plain text, basically just one long string. The axios library is still able to parse the data into a JavaScript array, since the server has specified that the data format is <i>application/json; charset=utf-8</i> (see the previous image) using the <i>content-type</i> header.

We can finally begin using the data fetched from the server.

Let's try and request the notes from our local server and render them, initially as the App component. Please note that this approach has many issues, as we're rendering the entire <i>App</i> component only when we successfully retrieve a response:

```js
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';

axios.get('http://localhost:3001/notes').then((response) => {
  const notes = response.data;
  ReactDOM.createRoot(document.getElementById('root')).render(
    <App notes={notes} />
  );
});
```

Let's instead move the fetching of the data into the <i>App</i> component.

### Effect-hooks

As per the official docs:

> <i>The [effect hook](https://react.dev/reference/react#effect-hooks) lets you perform side effects on function components.</i>

> <i>Data fetching, setting up a subscription, and manually changing the DOM in React components are all examples of side effects.</i>

As such, effect hooks are precisely the right tool to use when fetching data from a server.

Let's remove the fetching of data from <i>index.js</i>. Since we're going to be retrieving the notes from the server, there is no longer a need to pass data as props to the <i>App</i> component. So <i>index.js</i> can be simplified to:

```js
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
```

The <i>App</i> component changes as follows:

```js
import { useState, useEffect } from 'react'; // highlight-line
import axios from 'axios'; // highlight-line
import Note from './components/Note';

const App = () => {
  // highlight-line
  const [notes, setNotes] = useState([]); // highlight-line
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);

  // highlight-start
  useEffect(() => {
    console.log('effect');
    axios.get('http://localhost:3001/notes').then((response) => {
      console.log('promise fulfilled');
      setNotes(response.data);
    });
  }, []);

  console.log('render', notes.length, 'notes');
  // highlight-end

  // ...
};
```

This is printed to the console:

<pre>
render 0 notes
effect
promise fulfilled
render 3 notes
</pre>

First, the body of the function defining the component is executed and the component is rendered for the first time. At this point <i>render 0 notes</i> is printed, meaning data hasn't been fetched from the server yet.

The Effect funciton is executed immediately after rendering. The execution of the function results in <i>effect</i> being printed to the console, and the command <em>axios.get</em> initiates the fetching of data from the server as well as registers a function as an <i>event handler</i> for the operation.

When data arrives from the server, the JavaScript runtime calls the function registered as the event handler, which prints <i>promise fulfilled</i> to the console and stores the notes received from the server into the state using the function <em>setNotes(response.data)</em>.

As always, a call to a state-updating function triggers the re-rendering of the component. As a result, <i>render 3 notes</i> is printed to the console, and the notes fetched from the server are rendered to the screen.

the function [useEffect](https://react.dev/reference/react/useEffect) takes <i>two parameters</i>. The first is a function, the <i>effect</i> itself. According to the documentation:

> <i>By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.</i>

So by default, the effect is <i>always</i> run after the component has been rendered. In our case, however, we only want to execute the effect along with the first render.

The second parameter of <em>useEffect</em> is used to [specify how often the effect is run](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect). If the second parameter is an empty array <em>[]</em>, then the effect is only run along with the first render of the component.

There are many possible use cases for an effect hook other than fetching data from the server. However, this use is sufficient for us, for now.

Think back to the sequence of events we just discussed. Which parts of the code are run? In what order? How often? Understanding the order of events is critical!

A reference to an event handler function is assigned to the variable <em>eventHandler</em>. The promise returned by the <em>get</em> method of Axios is stored in the variable <em>promise</em>. The registration of the callback happens by giving the <em>eventHandler</em> variable, referring to the event-handler function, as a parameter to the <em>then</em> method of the promise. It isn't usually necessary to assign functions and promises to variables, and a more compact way of representing things, as seen further above, is sufficient.

We still have a problem with our application. When adding new notes, they are not stored on the server.

The code for the application, as described so far, can be found in full on [github](https://github.com/fullstack-hy2020/part2-notes/tree/part2-4), on branch <i>part2-4</i>.

### The development runtime environment

The configuration for the whole application has steadily grown more complex. Let's review what happens and where. The following image describes the makeup of the application

![diagram of composition of react app](https://fullstackopen.com/static/0e3766361ce9d08f0c4fdd39152cf493/5a190/18e.png)

The JavaScript code making up our React application is run in the browser. The browser gets the JavaScript from the <i>React dev server</i>, which is the application that runs after running the command <em>npm start</em>. The dev-server transforms the JavaScript into a format understood by the browser. Among other things, it stitches together JavaScript from different files into one file. We'll discuss the dev-server in more detail in part 7 of the course.

The React application running in the browser fetches the JSON formatted data from <i>json-server</i> running on port 3001 on the machine. The server we query the data from - <i>json-server</i> - gets its data from the file <i>db.json</i>.

At this point in development, all the parts of the application happen to reside on the software developer's machine, otherwise known as localhost.
