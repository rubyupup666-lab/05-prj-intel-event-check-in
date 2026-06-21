// Intel Sustainability Summit Check-In JavaScript

// Attendance goal
const ATTENDANCE_GOAL = 50;

// Team names
const TEAM_NAMES = {
  water: "Team Water Wise",
  zero: "Team Net Zero",
  power: "Team Renewables",
};

// Get HTML elements
const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const greeting = document.getElementById("greeting");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");

const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");

// Create extra sections using JavaScript only
const container = document.querySelector(".container");

// Celebration message
const celebrationMessage = document.createElement("p");
celebrationMessage.id = "celebrationMessage";
celebrationMessage.style.display = "none";
celebrationMessage.style.marginTop = "20px";
celebrationMessage.style.padding = "16px 20px";
celebrationMessage.style.borderRadius = "10px";
celebrationMessage.style.backgroundColor = "#ecfdf3";
celebrationMessage.style.color = "#166534";
celebrationMessage.style.fontWeight = "700";
celebrationMessage.style.fontSize = "18px";
container.appendChild(celebrationMessage);

// Attendee list section
const attendeeListSection = document.createElement("div");
attendeeListSection.id = "attendeeListSection";
attendeeListSection.style.marginTop = "30px";
attendeeListSection.style.paddingTop = "25px";
attendeeListSection.style.borderTop = "2px solid #f1f5f9";
attendeeListSection.innerHTML = `
  <h3 style="color:#64748b; font-size:16px; margin-bottom:15px;">
    Attendee List
  </h3>
  <ul id="attendeeList" style="list-style:none; padding:0; margin:0;"></ul>
`;
container.appendChild(attendeeListSection);

const attendeeList = document.getElementById("attendeeList");

// Main data object
let attendanceData = {
  total: 0,
  teams: {
    water: 0,
    zero: 0,
    power: 0,
  },
  attendees: [],
};

// Load saved data from localStorage
function loadData() {
  const savedData = localStorage.getItem("intelAttendanceData");

  if (savedData) {
    attendanceData = JSON.parse(savedData);
  }

  updateDisplay();
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("intelAttendanceData", JSON.stringify(attendanceData));
}

// Update all page display
function updateDisplay() {
  // Update total count
  attendeeCount.textContent = attendanceData.total;

  // Update team counts
  waterCount.textContent = attendanceData.teams.water;
  zeroCount.textContent = attendanceData.teams.zero;
  powerCount.textContent = attendanceData.teams.power;

  // Update progress bar
  const progressPercent = Math.min(
    (attendanceData.total / ATTENDANCE_GOAL) * 100,
    100
  );

  progressBar.style.width = progressPercent + "%";

  // Update attendee list
  displayAttendeeList();

  // Check celebration
  checkCelebration();
}

// Display attendee names and teams
function displayAttendeeList() {
  attendeeList.innerHTML = "";

  if (attendanceData.attendees.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "No attendees checked in yet.";
    emptyMessage.style.color = "#94a3b8";
    emptyMessage.style.fontSize = "15px";
    emptyMessage.style.padding = "12px";
    attendeeList.appendChild(emptyMessage);
    return;
  }

  attendanceData.attendees.forEach(function (attendee, index) {
    const listItem = document.createElement("li");

    listItem.style.display = "flex";
    listItem.style.justifyContent = "space-between";
    listItem.style.alignItems = "center";
    listItem.style.backgroundColor = "#f8fafc";
    listItem.style.borderRadius = "10px";
    listItem.style.padding = "12px 15px";
    listItem.style.marginBottom = "10px";
    listItem.style.fontSize = "15px";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${index + 1}. ${attendee.name}`;
    nameSpan.style.fontWeight = "600";
    nameSpan.style.color = "#334155";

    const teamSpan = document.createElement("span");
    teamSpan.textContent = TEAM_NAMES[attendee.team];
    teamSpan.style.color = "#0071c5";
    teamSpan.style.fontWeight = "500";

    listItem.appendChild(nameSpan);
    listItem.appendChild(teamSpan);

    attendeeList.appendChild(listItem);
  });
}

// Find the team with the highest attendance
function getWinningTeam() {
  const teams = attendanceData.teams;

  let winningTeam = "water";
  let highestCount = teams.water;

  if (teams.zero > highestCount) {
    winningTeam = "zero";
    highestCount = teams.zero;
  }

  if (teams.power > highestCount) {
    winningTeam = "power";
    highestCount = teams.power;
  }

  return TEAM_NAMES[winningTeam];
}

// Show celebration when goal is reached
function checkCelebration() {
  if (attendanceData.total >= ATTENDANCE_GOAL) {
    const winningTeam = getWinningTeam();

    celebrationMessage.textContent =
      `🎉 Goal reached! Congratulations! The leading team is ${winningTeam}!`;

    celebrationMessage.style.display = "block";
  } else {
    celebrationMessage.style.display = "none";
  }
}

// Handle form submission
checkInForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;

  // Prevent empty name or no team
  if (attendeeName === "" || selectedTeam === "") {
    greeting.textContent = "Please enter a name and select a team.";
    greeting.style.display = "block";
    greeting.classList.remove("success-message");
    greeting.style.backgroundColor = "#fee2e2";
    greeting.style.color = "#991b1b";
    return;
  }

  // Add attendee
  attendanceData.total++;
  attendanceData.teams[selectedTeam]++;

  attendanceData.attendees.push({
    name: attendeeName,
    team: selectedTeam,
  });

  // Save and update page
  saveData();
  updateDisplay();

  // Show personalized greeting
  greeting.textContent =
    `Welcome, ${attendeeName}! You are checked in for ${TEAM_NAMES[selectedTeam]}.`;

  greeting.style.display = "block";
  greeting.classList.add("success-message");
  greeting.style.backgroundColor = "#e8f4fc";
  greeting.style.color = "#003c71";

  // Reset form
  checkInForm.reset();
});

// Load saved progress when page opens
loadData();
