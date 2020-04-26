import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { loadCourses, saveCourse } from "../redux/actions/courseActions";
import { loadAuthors } from "../redux/actions/authorActions";
import PropTypes from "prop-types";
import CourseForm from "./CourseForm";
import { newCourse } from "../tools/mockData";

//Component in function format
//function ManageCoursePage(props) {
function ManageCoursePage({
  courses,
  authors,
  loadAuthors,
  loadCourses,
  saveCourse,
  //Every component loaded via react-router route gets history past automatically
  history,
  ...props // Any other props past to the component
}) {
  //Setting state on the function component
  const [course, setCourse] = useState({ ...props.course });
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (courses.length === 0) {
      loadCourses().catch((error) => {
        alert("Loading courses failed:" + error);
      });
    } else {
      setCourse({ ...props.course });
    }

    if (authors.length === 0) {
      loadAuthors().catch((error) => {
        alert("Loading authors failed:" + error);
      });
    }
  }, [props.course]); // The second parameter indicates what the hook must watch. If empty, the hook will only run once, if inexistent it will load everytime the module mounts.

  function handleChange(event) {
    const { name, value } = event.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: name === "authorId" ? parseInt(value, 10) : value,
    }));
  }

  function handleSave(event) {
    event.preventDefault();
    saveCourse(course).then(() => {
      history.push("/courses");
    });
  }

  return (
    <CourseForm
      course={course}
      errors={errors}
      authors={authors}
      onChange={handleChange}
      onSave={handleSave}
    />
  );
}

ManageCoursePage.propTypes = {
  course: PropTypes.object.isRequired,
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  loadCourses: PropTypes.func.isRequired,
  saveCourse: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export function getCourseBySlug(courses, slug) {
  //Memoization in a Nutshell
  //Memoization is the programmatic practice of making long recursive/iterative functions run much faster.
  //Bellow, the find function can be memoized with library reselect to not make the recursion everytime when the parameters are the same, but it`s not being
  return courses.find((course) => course.slug === slug) || null;
}

//mapStateToProps(state, ownProps) -> own props can be used to pass component own props.
function mapStateToProps(state, ownProps) {
  const slug = ownProps.match.params.slug;
  const course =
    slug && state.courses.length > 0
      ? getCourseBySlug(state.courses, slug)
      : newCourse;
  return {
    course,
    courses: state.authors,
    authors: state.authors,
  };
}

const mapDispatchToProps = {
  loadCourses,
  loadAuthors,
  saveCourse,
};

// mapDispatchToProps can be used as an object
// const mapDispatchToProps = {
//   createCourse: coursesActions.createCourse,
// };

//connect(mapStateToProps,mapDispatchToProps) -> mapDispatchToProps especify what acctions must be exposed to the component. When ommited, the component get a dispatch property injected automatically, so we can use it to dispatch our actions.
export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
