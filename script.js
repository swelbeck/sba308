// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript",
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50,
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150,
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500,
    },
  ],
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47,
    },
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150,
    },
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400,
    },
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39,
    },
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140,
    },
  },
];

function getLearnerData(course, ag, submissions) {
  // here, we would process this data to achieve the desired result.

  let learnerObj = {};
  const result = [];
  const todaysDate = new Date();

  // Check to make sure we are grading the right assigments for the right course
  try {
    if (course.id !== ag.course_id) {
      // if the course IDs do not match, throw an error
      throw `Input Invalid.`;
    }

    for (let entry of submissions) {
      let learnerID = entry.learner_id;

      for (let k in ag.assignments) {
        let eachAssignment = ag.assignments[k];
        // If the learner ID is not in the emptty Object variable, add the learner's ID, and an array for each learner
        if (!learnerObj[learnerID]) {
          learnerObj[learnerID] = [];
        }

        // If the Assigment ID matches the Submission ID, add all this info to the array for that learner in our learnerObj
        if (eachAssignment.id === entry.assignment_id) {
          learnerObj[learnerID].push({
            assignment_id: eachAssignment.id,
            score: entry.submission.score,
            submitted_at: entry.submission.submitted_at,
            due_at: eachAssignment.due_at,
            points_possible: eachAssignment.points_possible,
          });
        }
      }
    }

    // Figuring out points for assignments
    for (let j in learnerObj) {
      // Create a new object variable for each learner ID, this will end up being in our results variable
      let newObj = { id: j };
      let weightedPoints = 0;
      let weightedPossiblePoints = 0;
      let eachEntry = learnerObj[j];

      for (let i in eachEntry) {
        // create variables for assigment ID, dueDate, submission Date, points and possible points
        let assignmentID = eachEntry[i].assignment_id;
        let dueDate = new Date(eachEntry[i].due_at);
        let submissionDate = new Date(eachEntry[i].submitted_at);
        let points = eachEntry[i].score;
        let pointsPossible = eachEntry[i].points_possible;

        // Check to make sure the points_possible is not equal to zero
        try {
          if (pointsPossible === 0) {
            throw new Error(
              `Assignment ${assignmentID} has zero points_possible. Do not grade.`
            );
          }

          if (dueDate > todaysDate) {
            // If due date has not happened, ignore, do not include in any grading
            continue;
          } else if (dueDate < submissionDate) {
            // If late, deduct 10% of Possible points from their score
            points -= pointsPossible * 0.1;
            newObj[assignmentID] = Number((points / pointsPossible).toFixed(3));
            weightedPoints += points;
            weightedPossiblePoints += pointsPossible;
          } else {
            // If submitted on time, grade normally
            newObj[assignmentID] = Number((points / pointsPossible).toFixed(3));
            weightedPoints += points;
            weightedPossiblePoints += pointsPossible;
          }
        } catch (err) {
          console.error(err);
          continue;
        }
      }
      // Calculate weighted average for each learner
      newObj["avg"] = Number(
        (weightedPoints / weightedPossiblePoints).toFixed(3)
      );
      // Add each object to the results array
      result.push(newObj);
    }
  } catch (error) {
    console.error(error);
  }
  return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
