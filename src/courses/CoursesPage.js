import React from "react";
import { connect } from "react-redux";
import * as coursesActions from "../redux/actions/courseActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";

class CoursesPage extends React.Component {
  state = {
    course: {
      title: "",
    },
  };
  handleChange = (event) => {
    const course = { ...this.state.course, title: event.target.value };
    this.setState({ course: course });
  };
  handleSubmit = (event) => {
    event.preventDefault();
    //this.props.dispatch(coursesActions.createCourse(this.state.course)); -> When not using mapDispatchToProps
    //this.props.createCourse(this.state.course); -> Without bind action creators
    this.props.actions.createCourse(this.state.course);
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Courses</h2>
        <h3>Add Courses</h3>
        <input
          type="text"
          onChange={this.handleChange}
          value={this.state.course.title}
        />
        <input type="submit" value="Enviar" />
        {this.props.courses.map((course) => (
          <div key={course.title}>{course.title}</div>
        ))}
      </form>
    );
  }
}

CoursesPage.propTypes = {
  courses: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

//mapStateToProps(state, ownProps) -> own props can be used to pass component own props.
function mapStateToProps(state) {
  return {
    //only de data that must be exposed to the component. The component will be reload every time these data change.
    courses: state.courses,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    //createCourse: (course) => dispatch(coursesActions.createCourse(course)), -> Without bind action creators
    actions: bindActionCreators(coursesActions, dispatch),
  };
}

// mapDispatchToProps can be used as an object
// const mapDispatchToProps = {
//   createCourse: coursesActions.createCourse,
// };

//connect(mapStateToProps,mapDispatchToProps) -> mapDispatchToProps especify what acctions must be exposed to the component. When ommited, the component get a dispatch property injected automatically, so we can use it to dispatch our actions.
export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
