const STORAGE_KEY = "assignedProjects";

// =========================================================
// GET PROJECTS
// =========================================================

export const getProjects = () => {
    try {
        const storedProjects =
            localStorage.getItem(STORAGE_KEY);

        if (!storedProjects) {
            return [];
        }

        return JSON.parse(storedProjects);
    } catch (error) {
        console.error(
            "Failed to load projects:",
            error
        );

        return [];
    }
};

// =========================================================
// SAVE PROJECTS
// =========================================================

export const saveProjects = (projects) => {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(projects)
        );

        return true;
    } catch (error) {
        console.error(
            "Failed to save projects:",
            error
        );

        return false;
    }
};

// =========================================================
// UPDATE PROJECT EMPLOYEES
// =========================================================

export const updateProjectEmployees = (
    projectId,
    employeeIds
) => {
    try {
        const projects = getProjects();

        if (!projects.length) {
            console.error(
                "No projects found in localStorage."
            );

            return null;
        }

        // -------------------------------------------------
        // Validate minimum 2 employees
        // -------------------------------------------------

        if (employeeIds.length < 2) {
            console.error(
                "At least 2 employees are required for every project."
            );

            return null;
        }

        // -------------------------------------------------
        // Update matching project
        // -------------------------------------------------

        const updatedProjects =
            projects.map((project) => {

                if (
                    String(project.id) ===
                    String(projectId)
                ) {
                    return {
                        ...project,

                        employeeIds: [
                            ...employeeIds,
                        ],
                    };
                }

                return project;
            });

        // -------------------------------------------------
        // Check whether project exists
        // -------------------------------------------------

        const projectExists =
            projects.some(
                (project) =>
                    String(project.id) ===
                    String(projectId)
            );

        if (!projectExists) {
            console.error(
                `Project with ID ${projectId} was not found.`
            );

            return null;
        }

        // -------------------------------------------------
        // Save updated projects
        // -------------------------------------------------

        const saved =
            saveProjects(
                updatedProjects
            );

        if (!saved) {
            return null;
        }

        return updatedProjects;

    } catch (error) {
        console.error(
            "Failed to update project employees:",
            error
        );

        return null;
    }
};

// =========================================================
// UPDATE COMPLETE PROJECT
// =========================================================

export const updateProject = (
    projectId,
    updatedData
) => {
    try {
        const projects = getProjects();

        const projectExists =
            projects.some(
                (project) =>
                    String(project.id) ===
                    String(projectId)
            );

        if (!projectExists) {
            console.error(
                `Project with ID ${projectId} was not found.`
            );

            return null;
        }

        const updatedProjects =
            projects.map((project) =>
                String(project.id) ===
                String(projectId)
                    ? {
                          ...project,
                          ...updatedData,
                      }
                    : project
            );

        const saved =
            saveProjects(
                updatedProjects
            );

        if (!saved) {
            return null;
        }

        return updatedProjects;

    } catch (error) {
        console.error(
            "Failed to update project:",
            error
        );

        return null;
    }
};

// =========================================================
// DELETE PROJECT
// =========================================================

export const deleteProject = (
    projectId
) => {
    try {
        const projects = getProjects();

        const updatedProjects =
            projects.filter(
                (project) =>
                    String(project.id) !==
                    String(projectId)
            );

        saveProjects(
            updatedProjects
        );

        return updatedProjects;

    } catch (error) {
        console.error(
            "Failed to delete project:",
            error
        );

        return null;
    }
};