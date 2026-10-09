/**
 * dashboard.js
 * Reads the `students` array from data.js and:
 *   1. Fills the summary cards
 *   2. Draws the bar chart (participation by college)
 *   3. Draws the pie chart (status breakdown)
 *   4. Populates the student table
 *   5. Handles live search / filter
 */

// ─── 1. SUMMARY CARDS ────────────────────────────────────────────────────────

const total     = students.length;
const active    = students.filter(s => s.status === "Active").length;
const completed = students.filter(s => s.status === "Completed").length;
const rate      = Math.round((active + completed) / total * 100);

document.getElementById("totalStudents").textContent     = total;
document.getElementById("activeParticipants").textContent = active;
document.getElementById("completedTraining").textContent  = completed;
document.getElementById("participationRate").textContent  = rate + "%";


// ─── 2. BAR CHART — Participation by College ─────────────────────────────────

// Count students per college
const colleges = [...new Set(students.map(s => s.college))];  // unique college names
const countByCollege = colleges.map(
  college => students.filter(s => s.college === college).length
);

const barCtx = document.getElementById("barChart").getContext("2d");
new Chart(barCtx, {
  type: "bar",
  data: {
    labels: colleges,
    datasets: [{
      label: "Students",
      data: countByCollege,
      backgroundColor: "#3b82d4",
      borderRadius: 5,
      borderSkipped: false,
    }]
  },
  options: {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: { color: "#f0f2f5" }
      },
      x: { grid: { display: false } }
    }
  }
});


// ─── 3. PIE CHART — Status Breakdown ─────────────────────────────────────────

const statusLabels = ["Active", "Completed", "Pending", "Inactive"];
const statusColors = ["#16a34a", "#1d4ed8", "#b45309", "#6b7280"];
const statusCounts = statusLabels.map(
  label => students.filter(s => s.status === label).length
);

const pieCtx = document.getElementById("pieChart").getContext("2d");
new Chart(pieCtx, {
  type: "doughnut",
  data: {
    labels: statusLabels,
    datasets: [{
      data: statusCounts,
      backgroundColor: statusColors,
      borderWidth: 2,
      borderColor: "#ffffff"
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: { padding: 16, font: { size: 12 } }
      }
    }
  }
});


// ─── 4. STUDENT TABLE ────────────────────────────────────────────────────────

/**
 * Renders rows into the table body.
 * @param {Array} data - filtered or full student array
 */
function renderTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";          // clear existing rows

  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:#57606a;padding:20px">No students found.</td></tr>`;
    return;
  }

  data.forEach((s, index) => {
    const badgeClass = {
      "Active":    "badge-active",
      "Completed": "badge-completed",
      "Pending":   "badge-pending",
      "Inactive":  "badge-inactive",
    }[s.status] || "badge-inactive";

    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${s.name}</td>
        <td>${s.college}</td>
        <td>${s.programme}</td>
        <td><span class="badge ${badgeClass}">${s.status}</span></td>
      </tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

// Initial render — show all students
renderTable(students);


// ─── 5. LIVE SEARCH / FILTER ─────────────────────────────────────────────────

/**
 * Called by oninput on the search box in index.html.
 * Filters by student name or college (case-insensitive).
 */
function filterTable() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.college.toLowerCase().includes(query)
  );
  renderTable(filtered);
}
