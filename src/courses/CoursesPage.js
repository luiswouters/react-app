import React from "react";
import { connect } from "react-redux";
import * as coursesActions from "../redux/actions/courseActions";
import * as authorActions from "../redux/actions/authorActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import CourseList from "./CoursesList";
import { Redirect } from "react-router-dom";

//Component in class format
class CoursesPage extends React.Component {
  //Setting state on the class component
  state = {
    redirectToAddCoursePage: false,
  };
  handleChange = (event) => {
    const course = { ...this.state.course, title: event.target.value };
    this.setState({ course: course });
  };
  componentDidMount() {
    const { courses, authors, actions } = this.props;
    if (courses.length === 0) {
      actions.loadCourses().catch((error) => {
        alert("Loading courses failed:" + error);
      });
    }

    if (authors.length === 0) {
      actions.loadAuthors().catch((error) => {
        alert("Loading authors failed:" + error);
      });
    }
  }
  render() {
    return (
      <>
        {this.state.redirectToAddCoursePage && <Redirect to="/course" />}
        <h2>Courses</h2>
        <button
          style={{ marginBotton: 20 }}
          className="btn btn-primary add-course"
          onClick={() => this.setState({ redirectToAddCoursePage: true })}
        >
          Add Course
        </button>
        <CourseList courses={this.props.courses} />
      </>
    );
  }
}

CoursesPage.propTypes = {
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

//mapStateToProps(state, ownProps) -> own props can be used to pass component own props.
function mapStateToProps(state) {
  return {
    //only de data that must be exposed to the component. The component will be reload every time these data change.
    courses:
      state.authors.length === 0
        ? []
        : state.courses.map((course) => {
            return {
              ...course,
              authorName: state.authors.find((a) => a.id === course.authorId)
                .name,
            };
          }),
    authors: state.authors,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      //createCourse: (course) => dispatch(coursesActions.createCourse(course)), -> Without bind action creators
      loadCourses: bindActionCreators(coursesActions.loadCourses, dispatch),
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
    },
  };
}

// mapDispatchToProps can be used as an object
// const mapDispatchToProps = {
//   createCourse: coursesActions.createCourse,
// };

//connect(mapStateToProps,mapDispatchToProps) -> mapDispatchToProps especify what acctions must be exposed to the component. When ommited, the component get a dispatch property injected automatically, so we can use it to dispatch our actions.
export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
