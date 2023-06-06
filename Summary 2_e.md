## 2.e Adding styles to React app

Mozilla's [CSS tutorial](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics).

First, we will add CSS to our application the old-school way; in a single file without using a [CSS preprocessor](https://developer.mozilla.org/en-US/docs/Glossary/CSS_preprocessor)

Let's add a new <i>index.css</i> file under the <i>src</i> directory and then add it to the application by importing it in the <i>index.js</i> file:

```js
import './index.css';
```

```css
h1 {
  color: green;
  font-style: italic; // highlight-line
}
```

CSS rules comprise of <i>selectors</i> and <i>declarations</i>. The selector defines which elements the rule should be applied to. The selector above is <i>h1</i>, which will match all of the <i>h1</i> header tags in our application.

The declaration sets the _color_ property to the value <i>green</i>.

There are many ways of matching elements by using [different types of CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors).

[class selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Class_selectors).

In regular HTML, classes are defined as the value of the <i>class</i> attribute:

```html
<li class="note">some text...</li>
```

In React we have to use the [className](https://react.dev/learn#adding-styles) attribute instead of the class attribute. With this in mind, let's make the following changes to our <i>Note</i> component:

```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'make not important' : 'make important';
  return (
    <li className="note">
      {' '}
      // highlight-line
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  );
};
```

Class selectors are defined with the _.classname_ syntax:

```css
.note {
  color: grey;
  padding-top: 5px;
  font-size: 15px;
}
```

If you now add other <i>li</i> elements to the application, they will not be affected by the style rule above.

### Improved error message

We previously implemented the error message that was displayed when the user tried to toggle the importance of a deleted note with the <em>alert</em> method. Let's implement the error message as its own React component.

```js
const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return <div className="error">{message}</div>;
};
```

Let's add a new piece of state called <i>errorMessage</i> to the <i>App</i> component. Let's initialize it with some error message so that we can immediately test our component:

```js
const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState('some error happened...'); // highlight-line

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} /> // highlight-line
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      // ...
    </div>
  );
};
```

Then let's add a style rule that suits an error message:

```css
.error {
  color: red;
  background: lightgrey;
  font-size: 20px;
  border-style: solid;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}
```

Now we are ready to add the logic for displaying the error message. Let's change the <em>toggleImportanceOf</em> function in the following way:

```js
const toggleImportanceOf = (id) => {
  const note = notes.find((n) => n.id === id);
  const changedNote = { ...note, important: !note.important };

  noteService
    .update(id, changedNote)
    .then((returnedNote) => {
      setNotes(notes.map((note) => (note.id !== id ? note : returnedNote)));
    })
    .catch((error) => {
      // highlight-start
      setErrorMessage(`Note '${note.content}' was already removed from server`);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      // highlight-end
      setNotes(notes.filter((n) => n.id !== id));
    });
};
```

When the error occurs we add a descriptive error message to the <em>errorMessage</em> state. At the same time, we start a timer, that will set the <em>errorMessage</em> state to <em>null</em> after five seconds.

The code for the current state of our application [GitHub](https://github.com/fullstack-hy2020/part2-notes/tree/part2-7).

### Inline styles

[inline styles](https://react-cn.github.io/react/tips/inline-styles.html).

Any React component or element can be provided with a set of CSS properties as a JavaScript object through the [style](https://react.dev/reference/react-dom/components/common#applying-css-styles) attribute.

CSS rules are defined slightly differently in JavaScript than in normal CSS files.

```js
{
  color: 'green',
  fontStyle: 'italic',
  fontSize: 16
}
```

Every CSS property is defined as a separate property of the JavaScript object. Numeric values for pixels can be simply defined as integers. One of the major differences compared to regular CSS, is that hyphenated (kebab case) CSS properties are written in camelCase.

Next, we could add a "bottom block" to our application by creating a <i>Footer</i> component and defining the following inline styles for it:

```js
// highlight-start
const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16,
  };

  return (
    <div style={footerStyle}>
      <br />
      <em>
        Note app, Department of Computer Science, University of Helsinki 2022
      </em>
    </div>
  );
};
// highlight-end

const App = () => {
  // ...

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      // ...
      <Footer /> // highlight-line
    </div>
  );
};
```

Inline styles limitations: so-called [pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) can't be used straightforwardly.

Inline styles and some of the other ways of adding styles to React components go completely against the grain of old conventions. Traditionally, it has been considered best practice to entirely separate CSS from the content (HTML) and functionality (JavaScript). According to this older school of thought, the goal was to write CSS, HTML, and JavaScript into their separate files.

The philosophy of React is, in fact, the polar opposite of this. Since the separation of CSS, HTML, and JavaScript into separate files did not seem to scale well in larger applications, React bases the division of the application along the lines of its logical functional entities.

The structural units that make up the application's functional entities are React components. A React component defines the HTML for structuring the content, the JavaScript functions for determining functionality, and also the component's styling; all in one place. This is to create individual components that are as independent and reusable as possible.

### Couple of important remarks

We set the state _notes_ to have initial value of an empty array:

```js
const App = () => {
  const [notes, setNotes] = useState([]);

  // ...
};
```

This is a pretty natural initial value since the notes are a set, that is, there are many notes that the state will store.

If the state would be only saving "one thing", a more proper initial value would be _null_ denoting that there is <i>nothing</i> in the state at the start. Let us try what happens if we use this initial value:

```js
const App = () => {
  const [notes, setNotes] = useState(null); // highlight-line

  // ...
};
```

The app breaks down. The error message is

```bash
Cannot read properties of null (reading 'map')
```

The variable _notesToShow_ is first assigned the value of the state _notes_ and then the code tries to call method _map_ to an nonexisting object, that is, to _null_.

What is the reason for that?

The effect hook uses the function _setNotes_ to set _notes_ to have the notes that the backend is returning:

```js
useEffect(() => {
  noteService.getAll().then((initialNotes) => {
    setNotes(initialNotes); // highlight-line
  });
}, []);
```

However the problem is that the effect is executed only <i>after the first render</i>.
And because _notes_ has the initial value of null:

```js
const App = () => {
  const [notes, setNotes] = useState(null) // highlight-line

  // ...
```

on the first render the following code gets executed

```js
notesToShow = notes

// ...

notesToShow.map(note => ...)
```

and this blows up the app since we can not call method _map_ of the value _null_.

When we set _notes_ to be initially an empty array, there is no error since it is allowed to call _map_ to an empty array.

So, the initialization of the state "masked" the problem that is caused by the fact that the data is not yet fetched from the backend.

Another way to circumvent the problem is to use <i>conditional rendering</i> and return null if the component state is not properly initialized:

```js
const App = () => {
  const [notes, setNotes] = useState(null); // highlight-line
  // ...

  useEffect(() => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes);
    });
  }, []);

  // do not render anything if notes is still null
  // highlight-start
  if (!notes) {
    return null;
  }
  // highlight-end

  // ...
};
```

So on the first render, nothing is rendered. When the notes arrive from the backend, the effect used function _setNotes_ to set the value of the state _notes_. This causes the component to be rendered again, and at the second render, the notes get rendered to the screen.

The method based on conditional rendering is suitable in cases where it is impossible to define the state so that the initial rendering is possible.

The other thing that we still need to have a closer look is the second parameter of the useEffect:

```js
useEffect(() => {
  noteService.getAll().then((initialNotes) => {
    setNotes(initialNotes);
  });
}, []); // highlight-line
```

The second parameter of <em>useEffect</em> is used to [specify how often the effect is run](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect).
The principle is that the effect is always executed after the first render of the component <i>and</i> when the value of the second parameter changes.

If the second parameter is an empty array <em>[]</em>, it's content never changes and the effect is only run after the first render of the component. This is exactly what we want when we are initializing the app state from the server.

However, there are situations where we want to perform the effect at other times, e.g. when the state of the component changes in a particular way.

Consider the following simple application for querying currency exchange rates from the [Exchange rate API](https://www.exchangerate-api.com/):

```js
import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [value, setValue] = useState('');
  const [rates, setRates] = useState({});
  const [currency, setCurrency] = useState(null);

  useEffect(() => {
    console.log('effect run, currency is now', currency);

    // skip if currency is not defined
    if (currency) {
      console.log('fetching exchange rates...');
      axios
        .get(`https://open.er-api.com/v6/latest/${currency}`)
        .then((response) => {
          setRates(response.data.rates);
        });
    }
  }, [currency]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = (event) => {
    event.preventDefault();
    setCurrency(value);
  };

  return (
    <div>
      <form onSubmit={onSearch}>
        currency: <input value={value} onChange={handleChange} />
        <button type="submit">exchange rate</button>
      </form>
      <pre>{JSON.stringify(rates, null, 2)}</pre>
    </div>
  );
};
```

The user interface of the application has a form, in the input field of which the name of the desired currency is written. If the currency exists, the application renders the exchange rates of the currency to other currencies:

The application sets the name of the currency entered to the form to the state _currency_ at the moment the button is pressed.

When the _currency_ gets a new value, the application fetches its exchange rates from the API in the effect function:

```js
const App = () => {
  // ...
  const [currency, setCurrency] = useState(null);

  useEffect(() => {
    console.log('effect run, currency is now', currency);

    // skip if currency is not defined
    if (currency) {
      console.log('fetching exchange rates...');
      axios
        .get(`https://open.er-api.com/v6/latest/${currency}`)
        .then((response) => {
          setRates(response.data.rates);
        });
    }
  }, [currency]); // highlight-line
  // ...
};
```

The useEffect hook has now _[currency]_ as the second parameter. The effect function is therefore executed after the first render, and <i>always</i> after the table as its second parameter _[currency]_ changes. That is, when the state _currency_ gets a new value, the content of the table changes and the effect function is executed.

The effect has the following condition

```js
if (currency) {
  // exchange rates are fetched
}
```

which prevents requesting the exchange rates just after the first render when the variable _currency_ still has the initial value, i.e. a null value.

So if the user writes e.g. <i>eur</i> in the search field, the application uses Axios to perform an HTTP GET request to the address <https://open.er-api.com/v6/latest/eur> and stores the response in the _rates_ state.

When the user then enters another value in the search field, e.g. <i>usd</i>, the effect function is executed again and the exchange rates of the new currency are requested from the API.

The way presented here for making API requests might seem a bit awkward.
This particular application could have been made completely without using the useEffect, by making the API requests directly in the form submit handler function:

```js
const onSearch = (event) => {
  event.preventDefault();
  axios.get(`https://open.er-api.com/v6/latest/${value}`).then((response) => {
    setRates(response.data.rates);
  });
};
```
