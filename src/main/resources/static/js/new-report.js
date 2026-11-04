
const reportForm = document.getElementById("report-form");
const message = document.getElementById("message");

const fieldLabels = {
    title: "Title",
    description: "Description",
    category: "Category",
    area: "Area",
    reporterName: "Your name",
    reporterEmail: "Your email"
};

function clearFieldErrors() {
    Object.keys(fieldLabels).forEach(field => {
        const input = document.getElementById(field);
        const error = document.getElementById(field + "-error");

        input.removeAttribute("aria-invalid");
        error.textContent = "";
    });
}

function showFieldErrors(errorMessage) {
    const errors = errorMessage.split(";").map(error => error.trim());
    let firstInvalidField = null;
    let hasFieldErrors = false;

    errors.forEach(errorText => {
        const match = errorText.match(/^(\w+)\s+(.+)$/);

        if (!match) return;

        const field = match[1];
        const input = document.getElementById(field);
        const errorElement = document.getElementById(field + "-error");

        if (!fieldLabels[field] || !input || !errorElement) return;

        let friendlyMessage = errorText
            .replace(/^must not be blank$/i, "is required")
            .replace(/^must not be null$/i, "is required");

        errorElement.textContent =
            fieldLabels[field] + " " + friendlyMessage;

        input.setAttribute("aria-invalid", "true");
        hasFieldErrors = true;

        if (!firstInvalidField) {
            firstInvalidField = input;
        }
    });

    if (firstInvalidField) {
        firstInvalidField.focus();
    }

    return hasFieldErrors;
}

reportForm.addEventListener("input", () => {
    clearFieldErrors();
});

reportForm.addEventListener("submit", async event => {
    event.preventDefault();

    clearFieldErrors();
    message.className = "message";
    message.textContent = "Sending...";

    const report = Object.fromEntries(new FormData(reportForm));
    report.category = report.category || null;

    try {
        const createdReport = await createReport(report);
        window.location.href = "report.html?id=" + createdReport.id;
    } catch (error) {
        message.textContent = "";

        const hasFieldErrors = showFieldErrors(error.message);

        if (!hasFieldErrors) {
            message.className = "message message-error";
            message.textContent = error.message;
        }
    }
});
