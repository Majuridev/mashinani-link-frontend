
/* =====================================
   MASHINANI LINK - JAVASCRIPT
===================================== */


/* =====================================
   REPORT ISSUE FORM
===================================== */

const reportForm = document.getElementById("reportForm");

if (reportForm) {

    reportForm.addEventListener("submit", function(event) {

        event.preventDefault();

        // Get information from the form
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const category = document.getElementById("category").value;
        const location = document.getElementById("location").value.trim();
        const description = document.getElementById("description").value.trim();

        // Get the selected photo
        const photoInput = document.getElementById("photo");
        const photo = photoInput ? photoInput.files[0] : null;

        // Check photo size (maximum 5MB)
        if (photo && photo.size > 5 * 1024 * 1024) {

            alert("Photo size must not exceed 5MB.");
            return;

        }

        // Check photo format
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (photo && !allowedTypes.includes(photo.type)) {

            alert("Please upload a JPG, PNG or WEBP image.");
            return;

        }

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
            status: "Submitted",
            photoName: photo ? photo.name : ""
        };

        // Get existing reports
        let reports = JSON.parse(localStorage.getItem("reports")) || [];

        // Add the new report
        reports.push(report);

        // Save reports
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


/* =====================================
   TRACK REPORT FORM
===================================== */

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

            return (report.id || "").toLowerCase() === reportId.toLowerCase();

        });

        // Get the result area
        const result = document.getElementById("trackResult");

        // Check whether the report exists
        if (foundReport) {

            result.hidden = false;

            result.innerHTML = `
                <h3>Report Found!</h3>
                <p><strong>Report ID:</strong> ${foundReport.id}</p>
                <p><strong>Category:</strong> ${foundReport.category || "Not provided"}</p>
                <p><strong>Location:</strong> ${foundReport.location || "Not provided"}</p>
                <p><strong>Description:</strong> ${foundReport.description || "Not provided"}</p>
                <p><strong>Status:</strong> ${foundReport.status || "Submitted"}</p>
                <p><strong>Photo:</strong> ${foundReport.photoName || "No photo attached"}</p>
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


/* =====================================
   ADMIN DASHBOARD
===================================== */

const reportsTable = document.getElementById("reportsTable");

if (reportsTable) {

    // Get reports saved in localStorage
    function getReports() {

        return JSON.parse(localStorage.getItem("reports")) || [];

    }


    // Display reports in the dashboard
    function displayReports() {

        const allReports = getReports();

        // Get search input
        const searchInput = document.getElementById("searchReports");

        const searchText = searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


        // Filter reports using ID or location
        const reports = allReports.filter(function(report) {

            const reportId = (report.id || "").toLowerCase();
            const location = (report.location || "").toLowerCase();

            return (
                reportId.includes(searchText) ||
                location.includes(searchText)
            );

        });


        // Clear existing table
        reportsTable.innerHTML = "";


        // Update dashboard statistics
        document.getElementById("totalReports").textContent = allReports.length;

        document.getElementById("submittedReports").textContent =
            allReports.filter(report => report.status === "Submitted").length;

        document.getElementById("reviewReports").textContent =
            allReports.filter(report => report.status === "Under Review").length;

        document.getElementById("resolvedReports").textContent =
            allReports.filter(report => report.status === "Resolved").length;


        // Display message if no matching reports exist
        if (reports.length === 0) {

            reportsTable.innerHTML = `
                <tr>
                    <td colspan="6">No matching reports found.</td>
                </tr>
            `;

            return;

        }


        // Display each report
        reports.forEach(function(report) {

            const row = document.createElement("tr");


            // Report information
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

                if ((report.status || "Submitted") === status) {

                    option.selected = true;

                }

                statusSelect.appendChild(option);

            });


            // Update report status
            statusSelect.addEventListener("change", function() {

                const updatedReports = getReports();

                const reportIndex = updatedReports.findIndex(function(item) {

                    return item.id === report.id;

                });

                if (reportIndex !== -1) {

                    updatedReports[reportIndex].status = statusSelect.value;

                    localStorage.setItem(
                        "reports",
                        JSON.stringify(updatedReports)
                    );

                    displayReports();

                }

            });


            statusCell.appendChild(statusSelect);

            row.appendChild(statusCell);


            // Action column
            const actionCell = document.createElement("td");

            actionCell.textContent = "Update using status menu";

            row.appendChild(actionCell);


            // Add row to table
            reportsTable.appendChild(row);

        });

    }


    // Load reports when dashboard opens
    displayReports();


    // Search reports as the admin types
    const searchInput = document.getElementById("searchReports");

    if (searchInput) {

        searchInput.addEventListener("input", function() {

            displayReports();

        });

    }

}


/* =====================================
   LOGIN FORM
===================================== */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        // Get user's email and password
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // Get message area
        const loginMessage = document.getElementById("loginMessage");

        // Check whether fields are empty
        if (email === "" || password === "") {

            loginMessage.textContent = "Please fill in all fields.";
            loginMessage.hidden = false;

            return;

        }

        // Temporary message until backend authentication is connected
        loginMessage.textContent =
            "Your details have been entered. Account verification will be available when the backend is connected.";

        loginMessage.hidden = false;

    });

}
