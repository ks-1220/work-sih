"use client";

import React from 'react';
import Calendar from "../../components/calendar/Calendar";
import ProgressBar from "../../components/progress/ProgressBar";
import './Tracker.css'; // Import the CSS file

class Tracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activityCounts: {}
    };
  }

  handleActivitySelect = (day, activity, isChecked) => {
    const { activityCounts } = this.state;
    const updatedCounts = { ...activityCounts };

    if (!updatedCounts[day]) {
      updatedCounts[day] = {};
    }

    if (isChecked) {
      updatedCounts[day][activity] = true; // Add activity
    } else {
      delete updatedCounts[day][activity]; // Remove activity
    }

    this.setState({ activityCounts: updatedCounts });
  };

  render() {
    return (
      <div>
        <div className="tracker-title">TRACK YOUR PROGRESS</div>
        <ProgressBar activityCounts={this.state.activityCounts} />
        <Calendar onActivitySelect={this.handleActivitySelect} />
      </div>
    );
  }
}

export default Tracker;
