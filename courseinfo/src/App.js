const Header = ({ course }) => <h1>{course}</h1>;
const Total = ({ parts }) => (
  <p>
    <b>
      total of {parts.map((p) => p.exercises).reduce((a, cv) => a + cv)}{' '}
      exercises
    </b>
  </p>
);
const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((p, i) => (
      <Part key={i} name={p.name} exercises={p.exercises} />
    ))}
  </>
);
const Course = ({ course }) => (
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
);
const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
      },
      {
        name: 'State of a component',
        exercises: 14,
      },
    ],
  };

  return <Course course={course} />;
};

export default App;
