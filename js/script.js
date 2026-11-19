
// =====================================
// MASHINANI LINK - JAVASCRIPT
// =====================================


// =====================================
// REPORT ISSUE FORM
// =====================================

const reportForm = document.getElementById("reportForm");

if (reportForm) {

    reportForm.addEventListener("submit", function(event) {

        event.preventDefault();

        // Get information from the form
        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const category = document.getElementById("category").value;
        const location = document.getElementById("location").value;
        const description = document.getElementById("description").value;

        // Generate a unique report ID
        const reportId = "ML-" + Date.now();

        // Create a report object
        const report = {
            id: reportId,
            fullName: fullName,
            email: email,
            category: category,
            location: location,
            description: description,
            status: "Submitted"
        };

        // Get existing reports from localStorage
        let reports = JSON.parse(localStorage.getItem("reports")) || [];

        // Add the new report
        reports.push(report);

        // Save reports in localStorage
        localStorage.setItem("reports", JSON.stringify(reports));

        // Show confirmation
        alert(
            "Your report has been submitted successfully!\n" +
            "Your Report ID is: " + reportId
        );

        // Clear the form
        reportForm.reset();

    });

}


// =====================================
// TRACK REPORT FORM
// =====================================

const trackForm = document.getElementById("trackForm");

if (trackForm) {

    trackForm.addEventListener("submit", function(event) {

        event.preventDefault();

        // Get the entered report ID
        const reportId = document.getElementById("reportId").value.trim();

        // Get saved reports
        const reports = JSON.parse(localStorage.getItem("reports")) || [];

        // Find the report
        const foundReport = reports.find(function(report) {
            return report.id.toLowerCase() === reportId.toLowerCase();
        });

        // Get the result area
        const result = document.getElementById("trackResult");

        // Check whether the report exists
        if (foundReport) {

            result.hidden = false;

            result.innerHTML = `
                <h3>Report Found!</h3>
                <p><strong>Report ID:</strong> ${foundReport.id}</p>
                <p><strong>Category:</strong> ${foundReport.category}</p>
                <p><strong>Location:</strong> ${foundReport.location}</p>
                <p><strong>Description:</strong> ${foundReport.description}</p>
                <p><strong>Status:</strong> ${foundReport.status}</p>
            `;

        } else {

            result.hidden = false;

            result.innerHTML = `
                <h3>Report Not Found</h3>
                <p>Please check your report reference number and try again.</p>
            `;

        }

    });

}

// =====================================
// ADMIN DASHBOARD
// =====================================

const reportsTable = document.getElementById("reportsTable");

if (reportsTable) {

    // Get reports saved in localStorage
    function getReports() {
        return JSON.parse(localStorage.getItem("reports")) || [];
    }

    // Display reports in the dashboard
    function displayReports() {

        const reports = getReports();

        reportsTable.innerHTML = "";

        // Update dashboard statistics
        document.getElementById("totalReports").textContent = reports.length;

        document.getElementById("submittedReports").textContent =
            reports.filter(report => report.status === "Submitted").length;

        document.getElementById("reviewReports").textContent =
            reports.filter(report => report.status === "Under Review").length;

        document.getElementById("resolvedReports").textContent =
            reports.filter(report => report.status === "Resolved").length;

        // Display message if there are no reports
        if (reports.length === 0) {
            reportsTable.innerHTML = `
                <tr>
                    <td colspan="6">No reports available yet.</td>
                </tr>
            `;
            return;
        }

        // Display each report
        reports.forEach(function(report, index) {

            const row = document.createElement("tr");

            const values = [
                report.id,
                report.category,
                report.location,
                report.fullName
            ];

            values.forEach(function(value) {
                const cell = document.createElement("td");
                cell.textContent = value || "Not provided";
                row.appendChild(cell);
            });

            // Status column
            const statusCell = document.createElement("td");

            const statusSelect = document.createElement("select");

            const statuses = [
                "Submitted",
                "Under Review",
                "Resolved"
            ];

            statuses.forEach(function(status) {
                const option = document.createElement("option");
                option.value = status;
                option.textContent = status;

                if (report.status === status) {
                    option.selected = true;
                }

                statusSelect.appendChild(option);
            });

            statusSelect.addEventListener("change", function() {

                const updatedReports = getReports();

                updatedReports[index].status = statusSelect.value;

                localStorage.setItem(
                    "reports",
                    JSON.stringify(updatedReports)
                );

                displayReports();
            });

            statusCell.appendChild(statusSelect);
            row.appendChild(statusCell);

            // Action column
            const actionCell = document.createElement("td");
            actionCell.textContent = "Update using status menu";

            row.appendChild(actionCell);

            reportsTable.appendChild(row);
        });
    }

    // Load reports when dashboard opens
    displayReports();
}

