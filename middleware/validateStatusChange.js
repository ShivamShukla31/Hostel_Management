export const validateStatusChange = (req, res, next) => {
    const { status } = req.body;

    if (req.user.role === "Student" && status !== "Closed") {
        return res.status(403).json({
            message: "Student can only close after completion"
        });
    }

    next();
};