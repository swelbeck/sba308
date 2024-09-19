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

  try {
    if (course.id !== ag.course_id) {
      throw `Input Invalid.`;
    }

    for (let key in submissions) {
      let entry = submissions[key];
      let learnerID = entry.learner_id;

      for (let k in ag.assignments) {
        let eachAssignment = ag.assignments[k];
        if (!learnerObj[learnerID]) {
          learnerObj[learnerID] = [];
        }

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

    for (let j in learnerObj) {
      let newObj = { id: j };
      let weightedPoints = 0;
      let weightedPossiblePoints = 0;
      let eachEntry = learnerObj[j];

      for (let i in eachEntry) {
  
        let assignmentID = eachEntry[i].assignment_id;
        let dueDate = new Date(eachEntry[i].due_at);
        let submissionDate = new Date(eachEntry[i].submitted_at);
        let points = eachEntry[i].score;
        let pointsPossible = eachEntry[i].points_possible;

        // Check if assignment is late or if due date has not passed yet
        if (dueDate > todaysDate) {
          // Ignore, do not include in any grading
          continue;
        } else if (dueDate < submissionDate) {
          // Late, Deduct 10% of Possible points from their score
          points -= pointsPossible * 0.1;
          newObj[assignmentID] = points / pointsPossible;
          weightedPoints += points;
          weightedPossiblePoints += pointsPossible;

        } else {
          // Need to round numbers to two decimal places. Don't forget!
          newObj[assignmentID] = points / pointsPossible;
          weightedPoints += points;
          weightedPossiblePoints += pointsPossible;
        }
      }
      newObj[`avg`] = weightedPoints / weightedPossiblePoints;
      result.push(newObj);
      newObj = {};
    }
  } catch (error) {
    console.error(error);
  }
  return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);

//   const result = [
//     {
//       id: 125,
//       avg: 0.985, // (47 + 150) / (50 + 150)
//       1: 0.94, // 47 / 50
//       2: 1.0, // 150 / 150
//     },
//     {
//       id: 132,
//       avg: 0.82, // (39 + 125) / (50 + 150)
//       1: 0.78, // 39 / 50
//       2: 0.833, // late: (140 - 15) / 150
//     },
//   ];
