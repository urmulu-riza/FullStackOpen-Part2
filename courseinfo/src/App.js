const Header = ({ course }) => (
  <div>
    <br /> <h2>{course}</h2>
  </div>
);
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
const Courses = ({ courses }) => (
  <div>
    {courses.map((course) => (
      <Course course={course} />
    ))}
  </div>
);
const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1,
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2,
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3,
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1,
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  return <Courses courses={courses} />;
};

export default App;
